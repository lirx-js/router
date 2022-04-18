import { objectDefineProperty } from '@lirx/dom';
import { IGenericFunction } from '@lirx/core';

export type IPatchObjectMethodFunction<GObject, GMethodName extends keyof GObject> =
  GObject[GMethodName] extends IGenericFunction
    ? {
      (
        _this: any,
        native: GObject[GMethodName],
        ...args: Parameters<GObject[GMethodName]>
      ): ReturnType<GObject[GMethodName]>;
    }
    : never;

export function patchObjectMethod<// generics
  GObject,
  GMethodName extends keyof GObject
  //
  >(
  obj: GObject,
  methodName: GMethodName,
  newFunction: IPatchObjectMethodFunction<GObject, GMethodName>,
): void {
  type GFunction = GObject[GMethodName] extends IGenericFunction
    ? GObject[GMethodName]
    : never;

  const native: GFunction = (obj[methodName] as GFunction).bind(obj);

  const patched = function(this: unknown, ...args: Parameters<GFunction>): unknown {
    return newFunction(this, native, ...args);
  };

  objectDefineProperty(patched, 'name', {
    ...Object.getOwnPropertyDescriptor(patched, 'name'),
    value: methodName,
  });
  patched.toString = native.toString.bind(native);

  obj[methodName] = patched as GFunction;
}
