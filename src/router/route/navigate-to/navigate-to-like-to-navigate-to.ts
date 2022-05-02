import { IStringOrURL } from '@lirx/dom';
import { INavigateTo } from './navigate-to.type';

export type INavigateToLike = IStringOrURL | INavigateTo;

export function navigateToLikeToNavigateTo(
  input: INavigateToLike,
): INavigateTo {
  if (
    (typeof input === 'string')
    || (input instanceof URL)
  ) {
    return {
      url: input,
    };
  } else {
    return input;
  }
}
