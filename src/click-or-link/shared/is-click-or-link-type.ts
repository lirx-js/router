import { isObject } from '@lirx/core';
import { isClickType } from '../click/is-click-type';
import { isLinkType } from '../link/is-link-type';
import { IClickOrLinkType } from './click-or-link-type.type';

export function isClickOrLinkType(
  value: unknown,
): value is IClickOrLinkType {
  return isObject(value)
    && (
      isClickType(value as IClickOrLinkType)
      || isLinkType(value as IClickOrLinkType)
    );
}
