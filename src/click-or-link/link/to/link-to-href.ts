import { stringOrURLToString } from '../../../misc/string-or-url/string-or-url-to-string';
import { ILinkType } from '../link-type.type';

export function linkToHREF(
  {
    url,
  }: ILinkType,
): string {
  return stringOrURLToString(url);
}

