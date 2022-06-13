import { IStringOrURL } from '../../misc/string-or-url/string-or-url.type';
import { INavigationNavigateOptions } from '../../navigation/navigation';
import { ILinkTypeEventOptions } from '../shared/link-type-event-options.type';

export interface ILinkType extends ILinkTypeEventOptions, INavigationNavigateOptions {
  type: 'link';
  url: IStringOrURL;
}
