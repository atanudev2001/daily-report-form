import { Validate } from "./types";

export function equal<T, V>(comparer: V | ((group: T) => V)): Validate<T, V> {
  return (value: V, group: T) => {
    const comparisonValue =
      typeof comparer === "function" ? (comparer as Function)(group) : comparer;
    return value !== comparisonValue
      ? {
          equal: {
            comparisonValue
          }
        }
      : null;
  };
}

export function notEqual<T, V>(
  comparer: V | ((group: T) => V)
): Validate<T, V> {
  return (value: V, group: T) => {
    const comparisonValue =
      typeof comparer === "function" ? (comparer as Function)(group) : comparer;
    return value !== comparisonValue
      ? {
          notEqual: {
            comparisonValue
          }
        }
      : null;
  };
}

export function required<T>(): Validate<T, any> {
  return (value: any) =>
    value == null || value == undefined || value.length === 0
      ? { required: {} }
      : null;
}

export function length(
  minLength: number,
  maxLength: number = minLength
): Validate<any, string | any[]> {
  return (value: string | any[]) => {
    if (typeof value !== "string" && !("length" in value)) {
      return null;
    }
    return value.length < minLength || value.length > maxLength
      ? {
          length: {
            minLength,
            maxLength,
            totalLength: value.length
          }
        }
      : null;
  };
}

export function minLength(minLength: number): Validate<any, string | any[]> {
  return (value: string | any[]) => {
    if (typeof value !== "string" && !("length" in value)) {
      return null;
    }
    return value.length < minLength
      ? {
          minLength: {
            minLength,
            totalLength: value.length
          }
        }
      : null;
  };
}

export function maxLength(maxLength: number): Validate<any, string | any[]> {
  return (value: string | any[]) => {
    if (typeof value !== "string" && !("length" in value)) {
      return null;
    }
    return value.length > maxLength
      ? {
          maxLength: {
            maxLength,
            totalLength: value.length
          }
        }
      : null;
  };
}

export function lessThan<T>(
  comparer: number | ((group: T) => number)
): Validate<T, number> {
  return (value: number, group: T) => {
    const comparisonValue =
      typeof comparer === "function" ? comparer(group) : comparer;
    return value > comparisonValue
      ? {
          lessThan: {
            comparisonValue
          }
        }
      : null;
  };
}

export function greaterThan<T>(
  comparer: number | ((group: T) => number)
): Validate<T, number> {
  return (value: number, group: T) => {
    const comparisonValue =
      typeof comparer === "function" ? comparer(group) : comparer;
    return value < comparisonValue
      ? {
          greaterThan: {
            comparisonValue
          }
        }
      : null;
  };
}

export function between<T>(min: number, max: number): Validate<T, number> {
  return (value: number) => {
    return value < min || value > max
      ? {
          between: {
            min,
            max
          }
        }
      : null;
  };
}
