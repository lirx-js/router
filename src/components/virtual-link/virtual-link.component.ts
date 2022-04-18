import { Component, HTMLAnchorElementWithInputs, IComponentInput } from '@lirx/dom';
import { createEventListener } from '@lirx/core';
import { resolveOptionalClickOrLinkTypeOnClick } from '../../click-or-link/shared/optional/resolve-optional-click-or-link-type-on-click';

/** COMPONENT **/

type IComponentInputs = [
  IComponentInput<'replaceState', boolean>,
];

@Component({
  name: 'v-link',
  extends: 'a',
})
export class AppVirtualLinkComponent extends HTMLAnchorElementWithInputs<IComponentInputs>(['replaceState']) {

  constructor() {
    super();

    this.replaceState = false;

    createEventListener(this, 'click', (event: MouseEvent) => {
      resolveOptionalClickOrLinkTypeOnClick({
        clickOrLink: {
          type: 'link',
          url: new URL(this.href, this.baseURI),
          preventDefault: true,
          replaceState: this.replaceState,
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
