import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isNotFutureDate', async: false })
export class IsNotFutureDateConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (value === null || value === undefined) {
      return true;
    }

    if (
      !(value instanceof Date) &&
      typeof value !== 'string' &&
      typeof value !== 'number'
    ) {
      return false;
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return false;
    }

    return date.getTime() <= Date.now();
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} cannot be a future date`;
  }
}

export function IsNotFutureDate(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNotFutureDateConstraint,
    });
  };
}
