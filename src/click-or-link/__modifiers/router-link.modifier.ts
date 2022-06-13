import { IObservable, reactiveFunction } from '@lirx/core';
import { createHTMLElementModifier, toObservable, toObservableThrowIfUndefined } from '@lirx/dom';
import { ILinkType } from '../link/link-type.type';
import { clickOrLinkModifierFunction } from './click-or-link.modifier';

export type ILinkModifierURL = ILinkType['url'];

export type ILinkModifierOptions = Omit<ILinkType, 'type' | 'url'>;

export function linkModifierFunction<GElement extends HTMLElement>(
  element: GElement,
  url: IObservable<ILinkModifierURL> | ILinkModifierURL,
  link?: IObservable<ILinkModifierOptions> | ILinkModifierOptions,
): GElement {
  const url$ = toObservableThrowIfUndefined(url);
  const link$ = toObservable(link);

  const clickOrLink$ = reactiveFunction(
    [url$, link$],
    (
      url: ILinkModifierURL,
      link: ILinkModifierOptions | undefined,
    ): ILinkType => {
      return {
        type: 'link',
        preventDefault: true,
        url,
        ...link,
      };
    },
  );

  return clickOrLinkModifierFunction(
    element,
    clickOrLink$,
  );
}

export const LINK_MODIFIER = createHTMLElementModifier('link', linkModifierFunction);

