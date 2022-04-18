import { IStringOrURL } from '@lirx/dom';
import { INavigationNavigateOptions } from '../../navigation/navigation';
import { ILinkTypeEventOptions } from '../shared/link-type-event-options.type';

export interface ILinkType extends ILinkTypeEventOptions, INavigationNavigateOptions {
  type: 'link';
  url: IStringOrURL;
}
