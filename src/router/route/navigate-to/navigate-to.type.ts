import { IStringOrURL } from '@lirx/dom';
import { INavigationNavigateOptions } from '../../../navigation/navigation';

export interface INavigateTo {
  url: IStringOrURL;
  transparent?: boolean; // (default: false)
  options?: INavigationNavigateOptions;
}

