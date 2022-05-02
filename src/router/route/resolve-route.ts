import {
  fulfilled$$$,
  IDefaultNotificationsUnion,
  IObservable,
  IObservablePipe,
  pipe$$,
  singleN,
  singleWithNotifications,
} from '@lirx/core';
import { ICanActivateFunctionReturnedValue } from './can-activate/can-activate-function.type';
import { normalizeRoutePath } from './functions/normalize-route-path';
import { IRoutesList } from './list/routes-list.type';
import { navigateToLikeToNavigateTo } from './navigate-to/navigate-to-like-to-navigate-to';
import { IMatchingResolvedRoute } from './resolved/matching-resolved-route.type';
import { NOT_MATCHING_RESOLVED_ROUTE } from './resolved/not-matching-resolved-route.constant';
import { INotMatchingResolvedRoute } from './resolved/not-matching-resolved-route.type';
import { IRedirectResolvedRoute } from './resolved/redirect-resolved-route.type';
import { IResolvedRoute } from './resolved/resolved-route.type';
import { IRouteParams } from './route-params/route-params.type';
import { IRoute } from './route.type';

const NOT_MATCHING_RESOLVED_ROUTE_OBSERVABLE = singleN<INotMatchingResolvedRoute>(NOT_MATCHING_RESOLVED_ROUTE);

export interface IResolveRouteOptions<GExtra> {
  route: IRoute<GExtra>;
  path: string; // normalized
  params: IRouteParams;
}

export type IResolveRouteReturn<GExtra> = IDefaultNotificationsUnion<IResolvedRoute<GExtra>>;

export function resolveRoute<GExtra>(
  {
    route,
    path: pathToResolve,
    params,
  }: IResolveRouteOptions<GExtra>,
): IObservable<IResolveRouteReturn<GExtra>> {
  const {
    path: routePath,
    canActivate,
    loadChildren,
    extra,
  } = route;

  const match: RegExpExecArray | null = routePath.exec(pathToResolve);

  if (match === null) {
    return singleWithNotifications(NOT_MATCHING_RESOLVED_ROUTE);
  } else {
    const routeParams: IRouteParams = {
      ...params,
      ...match.groups,
    };

    return pipe$$(canActivate(routeParams), [
      fulfilled$$$((isRouteActivable: ICanActivateFunctionReturnedValue): IObservable<IResolveRouteReturn<GExtra>> => {
        if (isRouteActivable !== true) {
          return singleN<IRedirectResolvedRoute>({
            state: 'redirect',
            to: navigateToLikeToNavigateTo(isRouteActivable),
          });
        } else {
          return pipe$$(loadChildren(), [
            fulfilled$$$((childRoutes: IRoutesList<GExtra>): IObservable<IResolveRouteReturn<GExtra>> => {
              const remainingPath: string = normalizeRoutePath(pathToResolve.slice(match[0].length));

              if (childRoutes.length === 0) {
                if (remainingPath === '/') {
                  return singleN<IMatchingResolvedRoute<GExtra>>({
                    state: 'matching',
                    params: routeParams,
                    childRoute: null,
                    extra,
                  });
                } else {
                  return NOT_MATCHING_RESOLVED_ROUTE_OBSERVABLE;
                }
              } else {
                return pipe$$(
                  resolveRoutes<GExtra>({
                    routes: childRoutes,
                    path: remainingPath,
                    params: routeParams,
                  }), [
                    fulfilled$$$((resolvedRoute: IResolvedRoute<GExtra>): IObservable<any> => {
                      if (resolvedRoute.state === 'matching') {
                        return singleN<IMatchingResolvedRoute<GExtra>>({
                          state: 'matching',
                          params: routeParams,
                          childRoute: resolvedRoute,
                          extra,
                        });
                      } else {
                        return singleN<IResolvedRoute<GExtra>>(resolvedRoute);
                      }
                    }),
                  ]);
              }
            }),
          ]);
        }
      }),
    ]);
  }
}

/*----*/

export interface IResolveRoutesOptions<GExtra> extends Omit<IResolveRouteOptions<GExtra>, 'route'> {
  routes: IRoutesList<GExtra>,
}

export function resolveRoutes<GExtra>(
  {
    routes,
    ...options
  }: IResolveRoutesOptions<GExtra>,
): IObservable<IResolveRouteReturn<GExtra>> {
  return pipe$$(
    NOT_MATCHING_RESOLVED_ROUTE_OBSERVABLE,
    routes.map((route: IRoute<GExtra>): IObservablePipe<IResolveRouteReturn<GExtra>, any> => {
      return fulfilled$$$((resolvedRoute: IResolvedRoute<GExtra>): IObservable<IResolveRouteReturn<GExtra>> => {
        if (resolvedRoute.state === 'not-matching') {
          return resolveRoute<GExtra>({
            ...options,
            route,
          });
        } else {
          return singleN<IResolvedRoute<GExtra>>(resolvedRoute);
        }
      });
    }),
  );
}
