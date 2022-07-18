export const transaction = async (model, mongooseQuery: any) => {
  let result;
  const session = await model.startSession();
  await session.withTransaction(async () => {
    result = await model.mongooseQuery;
  });
  return result;
};
