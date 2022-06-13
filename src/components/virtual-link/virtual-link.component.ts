import { createComponent, INJECT_CONTENT_TEMPLATE, VirtualCustomElementNode } from '@lirx/dom';
import { resolveOptionalClickOrLinkTypeOnClick } from '../../click-or-link/shared/optional/resolve-optional-click-or-link-type-on-click';
import { INavigationNavigateTarget } from '../../navigation/navigation';

/**
 * COMPONENT: 'v-link'
 */

interface IVirtualLinkComponentConfig {
  element: HTMLAnchorElement;
  inputs: [
    ['replaceState', boolean],
  ];
}

export const VirtualLinkComponent = createComponent<IVirtualLinkComponentConfig>({
  name: 'v-link',
  extends: 'a',
  template: INJECT_CONTENT_TEMPLATE,
  inputs: [
    ['replaceState', false],
  ],
  init: (node: VirtualCustomElementNode<IVirtualLinkComponentConfig>): void => {
    node.on$<MouseEvent>('click')((event: MouseEvent) => {
      const getTarget = (): INavigationNavigateTarget => {
        return (node.getProperty('target') === '_blank')
          ? '_blank'
          : '_self';
      };

      const getRel = (): string => {
        return node.getProperty('rel');
      };

      const getNoOpener = (): boolean => {
        const rel: string = getRel();
        return (rel === '')
          || rel.includes('noopener');
      };

      const getNoReferer = (): boolean => {
        const rel: string = getRel();
        return (rel === '')
          || rel.includes('noreferrer');
      };

      resolveOptionalClickOrLinkTypeOnClick({
        clickOrLink: {
          type: 'link',
          url: new URL(node.getProperty('href'), node.getProperty('baseURI')),
          preventDefault: true,
          replaceState: node.inputs.get('replaceState'),
          target: getTarget(),
          noopener: getNoOpener(),
          noreferrer: getNoReferer(),
        },
        event,
      });
    });
  },
});

