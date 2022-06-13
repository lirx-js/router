import { IStringOrURL } from './string-or-url.type';

export function stringOrURLToURL(
  input: IStringOrURL,
): URL {
  return (typeof input === 'string')
    ? new URL(input, window.origin)
    : input;
}
