import { IStringOrURL } from '../../../misc/string-or-url/string-or-url.type';
import { INavigationNavigateOptions } from '../../../navigation/navigation';

export interface INavigateTo {
  url: IStringOrURL;
  transparent?: boolean; // (default: false)
  options?: INavigationNavigateOptions;
}

