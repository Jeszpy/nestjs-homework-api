import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

const prepareErrorResult = (errors: ValidationError[]) => {
  const result = [];
  errors.forEach((e) => {
    const constraintsKeys = Object.keys(e.constraints);
    constraintsKeys.forEach((ckey) => {
      result.push({ message: e.constraints[ckey], field: e.property });
    });
  });
  return result;
};

// const errorResult = (errors: ValidationError[]) => {
//   return errors.map((e) => {
//     const constraintsKeys = Object.keys(e.constraints)[0];
//     return { message: e.constraints[constraintsKeys], field: e.property };
//   });
// };

export const validationPipe = new ValidationPipe({
  transform: true,
  stopAtFirstError: true,
  exceptionFactory: (errors) => {
    throw new BadRequestException(prepareErrorResult(errors));
  },
});
