import { validateOrReject } from 'class-validator';

export const validateInputModelInBll = async (
  model: any,
  ctor: { new (): any },
) => {
  if (!(model instanceof ctor)) {
    throw new Error('Incorrect input data');
  }
  await validateOrReject(model);
};
