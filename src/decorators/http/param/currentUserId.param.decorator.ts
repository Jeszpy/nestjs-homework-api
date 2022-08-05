import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!request.user?.userId) throw new Error('Jwt auth guard must be used!');
    return request.user.userId;
  },
);
