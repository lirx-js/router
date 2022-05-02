import { singleN } from '@lirx/core';
import { INavigateToLike } from '../navigate-to/navigate-to-like-to-navigate-to';
import { ICanActivateFunction } from './can-activate-function.type';

export function navigateTo(
  url: INavigateToLike,
): ICanActivateFunction {
  const url$ = singleN(url);
  return () => url$;
}
