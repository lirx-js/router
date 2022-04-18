import { createCustomError, ICustomError, ICustomErrorMessageOptionalOptions, isCustomError } from '@lirx/core';

export const NOT_A_VALID_PATH_FOR_THIS_ROUTE_ERROR_NAME = 'NotAValidPathForThisRouteError';

export type INotAValidPathForThisRouteErrorName = typeof NOT_A_VALID_PATH_FOR_THIS_ROUTE_ERROR_NAME;

export interface INotAValidPathForThisRouteErrorOptions extends ICustomErrorMessageOptionalOptions {
}

export interface INotAValidPathForThisRouteErrorProperties {
}

export interface INotAValidPathForThisRouteError extends ICustomError<INotAValidPathForThisRouteErrorName, INotAValidPathForThisRouteErrorProperties> {
}

export function createNotAValidPathForThisRouteError(
  options?: INotAValidPathForThisRouteErrorOptions,
): INotAValidPathForThisRouteError {
  return createCustomError({
    name: NOT_A_VALID_PATH_FOR_THIS_ROUTE_ERROR_NAME,
    message: 'Not a valid path for this route',
    ...options,
  });
}

export function isNotAValidPathForThisRouteError(
  value: unknown,
): value is INotAValidPathForThisRouteError {
  return isCustomError<INotAValidPathForThisRouteErrorName, INotAValidPathForThisRouteErrorProperties>(
    value,
    NOT_A_VALID_PATH_FOR_THIS_ROUTE_ERROR_NAME,
  );
}
