import { Component, HTMLAnchorElementWithInputs, IComponentInput, INJECT_CONTENT_TEMPLATE } from '@lirx/dom';
import { createEventListener } from '@lirx/core';
import { resolveOptionalClickOrLinkTypeOnClick } from '../../click-or-link/shared/optional/resolve-optional-click-or-link-type-on-click';
import { INavigationNavigateTarget } from '../../navigation/navigation';

/** COMPONENT **/

type IComponentInputs = [
  IComponentInput<'replaceState', boolean>,
];

@Component({
  name: 'v-link',
  extends: 'a',
  template: INJECT_CONTENT_TEMPLATE,
})
export class AppVirtualLinkComponent extends HTMLAnchorElementWithInputs<IComponentInputs>(['replaceState']) {

  constructor() {
    super();

    this.replaceState = false;

    createEventListener(this, 'click', (event: MouseEvent) => {

      const getTarget = (): INavigationNavigateTarget => {
        return (this.target === '_blank')
          ? '_blank'
          : '_self';
      };

      const getNoOpener = (): boolean => {
        return (this.rel === '')
          || this.rel.includes('noopener');
      };

      const getNoReferer = (): boolean => {
        return (this.rel === '')
          || this.rel.includes('noreferrer');
      };

      resolveOptionalClickOrLinkTypeOnClick({
        clickOrLink: {
          type: 'link',
          url: new URL(this.href, this.baseURI),
          preventDefault: true,
          replaceState: this.replaceState,
          target: getTarget(),
          noopener: getNoOpener(),
          noreferrer: getNoReferer(),
        },
        event,
      });
      // if (
      //   (event.button === 0)
      //   && !event.ctrlKey
      //   && (this.target !== '_blank')
      //   && ['http:', 'https:'].includes(new URL(this.href, this.baseURI).protocol)
      // ) {
      //   event.preventDefault();
      //   NAVIGATION.navigate(this.href, {
      //     replaceState: this.replaceState,
      //   });
      // }
    });
  }
}
