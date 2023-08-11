import { AbstractControl } from "@angular/forms";
import { Observable } from "rxjs";

export interface Validator<T, V> {
  validator?: Validate<T, V> | Validate<T, V>[];
  when?: When<T, V>;
  each?: AnyValidator<T, any>;
  message?: string | ((value: V, form: T) => string);
}

export interface Validate<T, V> {
  (value: V, formValue: T, index?: number):
    | ValidationMessages
    | null
    | Observable<ValidationMessages | null>;
}

export type AnyValidator<T = any, V = any> =
  | Validator<T, V>
  | Validate<T, V>
  | (Validator<T, V> | Validate<T, V>)[];

export interface When<T, V> {
  (value: V, formValue: T): boolean;
}

export type ValidationMessagesWithTemplate = Record<
  string,
  { messageTemplate?: string }
>;

export type ValidationMessages = Record<string, {}>;

export type FormMessages = Record<string, ControlMessages>;

export interface ControlMessages {
  control: AbstractControl;
  errors: ValidationMessages;
  childrenErrors: ControlMessages[];
  asyncValidators: Observable<ValidationMessages>[];
}

export type ValidatorsByControlKey<T> = {
  [P in keyof T]?: AnyValidator<T, T[P]> | AnyValidator<T, T[P]>[]
};

export type ControlValidators<T> = { [P in keyof T]?: Validator<T, any>[] };
