import { AbstractControl, FormGroup, FormArray } from "@angular/forms";
import {
  animationFrameScheduler,
  isObservable,
  merge,
  Observable,
  of,
  OperatorFunction
} from "rxjs";
import { tap, map, startWith, switchMap, observeOn } from "rxjs/operators";
import { buildMessage, DEFAULT_MESSAGES, MESSAGE_KEYS } from "./messages";
import {
  Validator,
  AnyValidator,
  ControlMessages,
  FormMessages,
  ValidatorsByControlKey,
  ControlValidators,
  ValidationMessages,
  ValidationMessagesWithTemplate
} from "./types";

export function createValidator<T = any>(
  formGroup: FormGroup,
  formValidators: ValidatorsByControlKey<T>
) {
  const validator = buildValidator(formValidators);
  return formGroup.valueChanges.pipe(
    startWith(formGroup.value),
    observeOn(animationFrameScheduler),
    map(() => formGroup.getRawValue()),
    switchMap(validateSync(formGroup, validator)),
    switchMap(validateAsync),
    updateControlStatus(),
    mapToOutput()
  );
}

function buildValidator<T>(formValidators: ValidatorsByControlKey<T>) {
  const groupedValidators = Object.entries(formValidators).reduce(
    (validators, [controlKey, validator]) => {
      return {
        ...validators,
        [controlKey]: createValidatorsOfInput(validator as AnyValidator<T>)
      };
    },
    {} as ControlValidators<T>
  );

  return groupedValidators;
}

function validateSync<T>(
  formGroup: FormGroup,
  formValidators: ControlValidators<T>
): OperatorFunction<T, FormMessages> {
  return (formValue: any) => {
    const formMessages = Object.entries(formGroup.controls).reduce(
      (messages, [controlKey, control]) => {
        removeAngularValidators(control, controlKey);

        const controlValidators = formValidators[
          controlKey as keyof T
        ] as Validator<T, any>[];
        return {
          ...messages,
          [controlKey]: validateControl(
            controlKey,
            control,
            controlValidators || [],
            formValue
          )
        };
      },
      {} as FormMessages
    );

    return of(formMessages);
  };
}

function validateAsync(formMessages: FormMessages): Observable<FormMessages> {
  const asyncValidators = Object.entries(formMessages)
    .filter(([_, control]) => Object.keys(control.errors).length === 0)
    .filter(([_, control]) => control.asyncValidators.length > 0)
    .map(([controlKey, controlError]) => {
      return controlError.asyncValidators.map(asyncValidator => {
        return new Observable<FormMessages>(subscriber => {
          return asyncValidator.subscribe({
            next: validateResult => {
              formMessages[controlKey] = {
                ...formMessages[controlKey],
                errors: {
                  ...(formMessages[controlKey].errors || {}),
                  ...createMessages(
                    validateResult,
                    controlKey,
                    controlError.control.value
                  )
                },
                asyncValidators: formMessages[
                  controlKey
                ].asyncValidators.filter(v => v !== asyncValidator)
              };
              subscriber.next(formMessages);
            },
            error: e => subscriber.error(e),
            complete: () => subscriber.complete()
          });
        });
      });
    })
    .reduce(
      (formAsyncValidators, controlAsyncValidator) => [
        ...formAsyncValidators,
        ...controlAsyncValidator
      ],
      []
    );

  return merge(of(formMessages), ...asyncValidators);
}

function createValidatorsOfInput<T, V>(validator: AnyValidator) {
  const validators = Array.isArray(validator) ? validator : [validator];
  return validators.map(v => (typeof v === "function" ? { validator: v } : v));
}

function validateControl<T>(
  controlKey: string,
  control: AbstractControl,
  controlValidators: Validator<T, any>[],
  formValue: T,
  index?: number
) {
  return controlValidators.reduce(
    (controlMessages, validator) => {
      if (validator.when && !validator.when(control.value, formValue)) {
        return controlMessages;
      }

      const validators = Array.isArray(validator.validator)
        ? validator.validator
        : [validator.validator];

      const customMessageTemplate = validator.message
        ? typeof validator.message === "function"
          ? validator.message(control.value, formValue)
          : validator.message
        : undefined;

      const controlResult = validators.filter(Boolean).reduce(
        (result, validate) => {
          let validateResult = (validate!(control.value, formValue, index) ||
            {}) as ValidationMessagesWithTemplate;
          if (isObservable(validateResult)) {
            controlMessages.asyncValidators.push(validateResult as Observable<
              ValidationMessages
            >);
            return result;
          }

          if (customMessageTemplate) {
            Object.values(validateResult).forEach(vr => {
              vr.messageTemplate = customMessageTemplate;
            });
          }

          return {
            ...result,
            ...validateResult
          };
        },
        {} as ValidationMessagesWithTemplate
      );

      const messages = createMessages(controlResult, controlKey, control.value);

      let childrenErrors = [];
      if (validator.each) {
        if (Array.isArray(control.value)) {
          let index = 0;
          for (const childControl of (control as FormArray).controls) {
            const childValidators = createValidatorsOfInput(validator.each);
            const childError = validateControl(
              controlKey,
              childControl,
              childValidators,
              formValue,
              index++
            ) as ControlMessages;
            if (childError) {
              childrenErrors.push(childError);
            }
          }
        }
      }

      return {
        ...controlMessages,
        errors: {
          ...controlMessages.errors,
          ...messages
        },
        childrenErrors: [...controlMessages.childrenErrors, ...childrenErrors]
      };
    },
    {
      control: control,
      errors: {},
      childrenErrors: [],
      asyncValidators: []
    } as ControlMessages
  );
}

function createMessages(
  validateResult: ValidationMessagesWithTemplate,
  controlKey: string,
  controlValue: any
) {
  return Object.entries(validateResult || {}).reduce(
    (messages, [errorKey, message]) => {
      return {
        ...messages,
        [errorKey]:
          typeof message === "string"
            ? {
                messageTemplate: message,
                [MESSAGE_KEYS.propertyName]: controlKey,
                [MESSAGE_KEYS.propertyValue]: controlValue
              }
            : {
                ...message,
                messageTemplate:
                  message.messageTemplate || DEFAULT_MESSAGES[errorKey],
                [MESSAGE_KEYS.propertyName]: controlKey,
                [MESSAGE_KEYS.propertyValue]: controlValue
              }
      };
    },
    {} as ValidationMessagesWithTemplate
  );
}

function removeAngularValidators(control: AbstractControl, controlKey: string) {
  if (control.validator) {
    console.warn(
      `[create-validator] Angular validators on ${controlKey} will be removed`
    );
    control.setValidators(null);
  }
  if (control.asyncValidator) {
    console.warn(
      `[create-validator] Angular async-validators on ${controlKey} will be removed`
    );
    control.setAsyncValidators(null);
  }
}

export function updateControlStatus(): (
  source: Observable<FormMessages>
) => Observable<FormMessages> {
  return source =>
    source.pipe(
      tap({
        next: (formMessages: FormMessages) => {
          for (const controlMessages of Object.values(formMessages)) {
            if (
              controlMessages.asyncValidators.length > 0 &&
              Object.keys(controlMessages.errors).length === 0
            ) {
              controlMessages.control.markAsPending();
              continue;
            }

            setControlErrors(controlMessages);
            controlMessages.childrenErrors.forEach(setControlErrors);
          }
        }
      })
    );
}

function setControlErrors(control: ControlMessages) {
  control.control.setErrors(
    Object.keys(control.errors).length === 0 ? null : control.errors
  );
}

export function mapToOutput(): (
  source: Observable<FormMessages>
) => Observable<ValidationMessages> {
  return source => {
    return source.pipe(
      map(formMessages => {
        return Object.entries(formMessages).reduce(
          (output, [controlKey, controlMessages]) => {
            return {
              ...output,
              [controlKey]: {
                errors: mapToHumanMessages(controlMessages.errors),
                childrenErrors: controlMessages.childrenErrors.length
                  ? controlMessages.childrenErrors.map(ce =>
                      mapToHumanMessages(ce.errors)
                    )
                  : undefined
              }
            };
          },
          {} as ValidationMessages
        );
      })
    );
  };
}

function mapToHumanMessages(validationMessages: ValidationMessages) {
  return Object.entries(validationMessages).reduce(
    (messages, [errorKey, errorValue]) => {
      return {
        ...messages,
        [errorKey]: {
          ...errorValue,
          messageTemplate: undefined,
          message: buildMessage(errorValue)
        }
      };
    },
    {}
  );
}
