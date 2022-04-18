import { isClickType } from '../../click/is-click-type';
import { clickToTarget } from '../../click/to/click-to-target';
import { linkToTarget } from '../../link/to/link-to-target';
import { IClickOrLinkType } from '../click-or-link-type.type';

export function clickOrLinkTypeToTarget(
  value: IClickOrLinkType,
): string {
  return isClickType(value)
    ? clickToTarget(value)
    : linkToTarget(value);
}
