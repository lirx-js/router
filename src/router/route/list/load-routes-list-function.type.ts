import { IDefaultNotificationsUnion, IObservable } from '@lirx/core';
import { IRoutesList } from './routes-list.type';

export type ILoadRoutesListFunctionReturnedObservableValue<GExtra> = IDefaultNotificationsUnion<IRoutesList<GExtra>>;
export type ILoadRoutesListFunctionReturn<GExtra> = IObservable<ILoadRoutesListFunctionReturnedObservableValue<GExtra>>;

export interface ILoadRoutesListFunction<GExtra> {
  (): ILoadRoutesListFunctionReturn<GExtra>;
}
