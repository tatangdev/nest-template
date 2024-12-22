import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const BaseUrl = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const protocol = request.protocol;
  const host = request.headers.host;
  return `${protocol}://${host}`;
});
