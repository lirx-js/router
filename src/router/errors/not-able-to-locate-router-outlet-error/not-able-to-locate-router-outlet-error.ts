import { createCustomError, ICustomError, ICustomErrorMessageOptionalOptions, isCustomError } from '@lirx/core';

export const NOT_ABLE_TO_LOCATE_ROUTER_OUTLET_ERROR_NAME = 'NotAbleToLocateRouterOutletError';

export type INotAbleToLocateRouterOutletErrorName = typeof NOT_ABLE_TO_LOCATE_ROUTER_OUTLET_ERROR_NAME;

export interface INotAbleToLocateRouterOutletErrorOptions extends ICustomErrorMessageOptionalOptions {
}

export interface INotAbleToLocateRouterOutletErrorProperties {
}

export interface INotAbleToLocateRouterOutletError extends ICustomError<INotAbleToLocateRouterOutletErrorName, INotAbleToLocateRouterOutletErrorProperties> {
}

export function createNotAbleToLocateRouterOutletError(
  options?: INotAbleToLocateRouterOutletErrorOptions,
): INotAbleToLocateRouterOutletError {
  return createCustomError({
    name: NOT_ABLE_TO_LOCATE_ROUTER_OUTLET_ERROR_NAME,
    message: `Unable to locate router outlet`,
    ...options,
  });
}

export function isNotAbleToLocateRouterOutletError(
  value: unknown,
): value is INotAbleToLocateRouterOutletError {
  return isCustomError<INotAbleToLocateRouterOutletErrorName, INotAbleToLocateRouterOutletErrorProperties>(
    value,
    NOT_ABLE_TO_LOCATE_ROUTER_OUTLET_ERROR_NAME,
  );
}
