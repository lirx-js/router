import { IDefaultNotificationsUnion, IObservable } from '@lirx/core';
import { INavigateToLike } from '../navigate-to/navigate-to-like-to-navigate-to';
import { IRouteParams } from '../route-params/route-params.type';

export type ICanActivateFunctionReturnedValue = INavigateToLike | true;

export type ICanActivateFunctionReturnedObservableValue = IDefaultNotificationsUnion<ICanActivateFunctionReturnedValue>;

export type ICanActivateFunctionReturn = IObservable<ICanActivateFunctionReturnedObservableValue>;

export interface ICanActivateFunction {
  (
    params: IRouteParams,
  ): ICanActivateFunctionReturn;
}
