import { getBaseURI } from '@lirx/dom';
import {
  createMulticastSource,
  createNotification,
  emptyN,
  freeze,
  fulfilled$$$,
  ICompleteNotification,
  IDefaultNotificationsUnion,
  IErrorNotification,
  INotification,
  IObservable,
  IUnsubscribe,
  let$$,
  pipe$$,
  single,
  throwError,
} from '@lirx/core';
import { getLocation } from '../../navigation/get-location';
import { NAVIGATION } from '../../navigation/navigation';
import {
  createNotAValidPathForThisRouteError,
} from '../errors/not-a-valid-path-for-this-route-error/not-a-valid-path-for-this-route-error';
import { differInjectedComponents, injectMatchingResolvedRXRoute, IOptionalInjectedComponentsList } from '../inject/inject';
import { normalizeRoutePath } from '../route/functions/normalize-route-path';
import { INavigateTo } from '../route/navigate-to/navigate-to.type';
import { resolveRoutes } from '../route/resolve-route';
import {
  genericRoutesListToResolvableRoutesList,
  IResolvableRXRoute,
  IResolvedRXRoute,
  IRXRouterOutletElement,
  IRXRoutesList,
} from '../rx-route/rx-route';

export interface ICreateRXRouterOptions {
  routes: IRXRoutesList;
  routerOutletElement: IRXRouterOutletElement;
}

export type IRXRouterNavigationState = 'idle' | 'updating';

export interface IRXRouter {
  readonly destroy: () => void;
  readonly state$: IObservable<IRXRouterNavigationState>;
  readonly error$: IObservable<any>;

}

export function createRXRouter(
  {
    routes,
    routerOutletElement,
  }: ICreateRXRouterOptions,
): IRXRouter {
  const resolvableRoutes: IResolvableRXRoute[] = genericRoutesListToResolvableRoutesList(routes);

  let previouslyInjectedComponents: IOptionalInjectedComponentsList = [];
  let unsubscribeOfUpdate: IUnsubscribe | undefined = void 0;
  let destroyed: boolean = false;

  const { emit: $state, subscribe: state$ } = let$$<IRXRouterNavigationState>('idle');
  const { emit: $error, subscribe: error$ } = createMulticastSource<any>();

  type IRedirectNotification = INotification<'redirect', INavigateTo>;
  type IUpdateNotifications = ICompleteNotification | IErrorNotification | IRedirectNotification;

  const update = (): IObservable<IUpdateNotifications> => {
    const resolvedRoute$: IObservable<IDefaultNotificationsUnion<IResolvedRXRoute>> = resolveRoutes({
      routes: resolvableRoutes,
      path: getCurrentPath(),
      params: {},
    });

    return pipe$$(resolvedRoute$, [
      fulfilled$$$((resolvedRoute: IResolvedRXRoute): IObservable<IUpdateNotifications> => {
        switch (resolvedRoute.state) {
          case 'matching': {
            const inject$ = injectMatchingResolvedRXRoute({
              resolvedRoute,
              routerOutletElement,
            });

            return pipe$$(inject$, [
              fulfilled$$$((injectedComponents: IOptionalInjectedComponentsList): IObservable<ICompleteNotification> => {
                differInjectedComponents(
                  previouslyInjectedComponents,
                  injectedComponents,
                );
                previouslyInjectedComponents = injectedComponents;
                return emptyN();
              }),
            ]);
          }
          case 'not-matching':
            return throwError(createNotAValidPathForThisRouteError());
          case 'redirect':
            return single<IRedirectNotification>(createNotification('redirect', resolvedRoute.to));
        }
      }),
    ]);
  };

  const destroy = (): void => {
    if (!destroyed) {
      destroyed = true;
      if (unsubscribeOfUpdate !== void 0) {
        unsubscribeOfUpdate();
      }
      unsubscribeOfNavigationChange();
      differInjectedComponents(
        previouslyInjectedComponents,
        [],
      );
    }
  };

  const onNavigationChange = (): void => {
    if (unsubscribeOfUpdate !== void 0) {
      unsubscribeOfUpdate();
      unsubscribeOfUpdate = void 0;
    }
    $state('updating');
    unsubscribeOfUpdate = update()((notification: IUpdateNotifications): void => {
      queueMicrotask((): void => {
        $state('idle');
        unsubscribeOfUpdate = void 0;
        switch (notification.name) {
          case 'error':
            $error(notification.value);
            break;
          case 'redirect':
            NAVIGATION.navigate(notification.value);
            break;
        }
      });
    });
  };

  const getCurrentPath = (): string => {
    const currentPathName: string = getLocation().pathname;
    const baseURIPathName: string = new URL(getBaseURI()).pathname;
    return normalizeRoutePath(
      currentPathName.startsWith(baseURIPathName)
        ? currentPathName.slice(baseURIPathName.length)
        : currentPathName,
    );
  };

  const unsubscribeOfNavigationChange: IUnsubscribe = NAVIGATION.change$(onNavigationChange);
  onNavigationChange();

  return freeze({
    destroy,
    state$,
    error$,
  });
}
