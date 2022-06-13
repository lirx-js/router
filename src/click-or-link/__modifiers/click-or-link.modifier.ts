import { fromEventTarget, IObservable, IUnsubscribe, noop } from '@lirx/core';
import { createHTMLElementModifier, onNodeConnectedToWithImmediateCached, toObservableThrowIfUndefined } from '@lirx/dom';
import { IOptionalClickOrLinkType } from '../shared/optional/optional-click-or-link-type.type';
import {
  reflectOptionalClickOrLinkTypeOnHTMLAnchorElement,
} from '../shared/optional/reflect-optional-click-or-link-type-on-html-anchor-element';
import { resolveClickOrLinkTypeOnClick } from '../shared/resolve-click-or-link-type-on-click';

function isHTMLAnchorElement(
  value: unknown,
): value is HTMLAnchorElement {
  return (value instanceof HTMLAnchorElement);
}

export function clickOrLinkModifierFunction<GElement extends HTMLElement>(
  element: GElement,
  clickOrLink: IObservable<IOptionalClickOrLinkType> | IOptionalClickOrLinkType,
): GElement {
  const clickOrLink$ = toObservableThrowIfUndefined(clickOrLink);

  const _isHTMLAnchorElement = isHTMLAnchorElement(element);
  const click$ = fromEventTarget<'click', MouseEvent>(element, 'click');

  let unsubscribeOfClickOrLink: IUnsubscribe = noop;
  let unsubscribeOfClick: IUnsubscribe = noop;

  onNodeConnectedToWithImmediateCached(element)((connected: boolean) => {
    if (connected) {
      unsubscribeOfClickOrLink = clickOrLink$((clickOrLink: IOptionalClickOrLinkType): void => {
        unsubscribeOfClick();

        if (_isHTMLAnchorElement) {
          reflectOptionalClickOrLinkTypeOnHTMLAnchorElement(clickOrLink, element);
        }

        if (clickOrLink !== void 0) {
          unsubscribeOfClick = click$((event: MouseEvent): void => {
            resolveClickOrLinkTypeOnClick({
              event,
              clickOrLink: {
                preventDefault: _isHTMLAnchorElement,
                ...clickOrLink,
              },
            });
          });
          // if (
          //   !_isHTMLAnchorElement
          //   || isClickType(clickOrLink)
          //   || (isLinkType(clickOrLink) && ((clickOrLink.replaceState === void 0) ? false : clickOrLink.replaceState))
          // ) {
          //   unsubscribeOfClick = click$((event: MouseEvent): void => {
          //     resolveClickOrLinkTypeOnClick({
          //       event,
          //       clickOrLink,
          //     });
          //   });
          // }
        }

      });
    } else {
      unsubscribeOfClickOrLink();
      unsubscribeOfClick();
    }
  });
  return element;
}

export const CLICK_OR_LINK_MODIFIER = createHTMLElementModifier('click-or-link', clickOrLinkModifierFunction);

