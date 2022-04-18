import {
  createErrorNotification,
  IDefaultNotificationsUnion,
  idle,
  IErrorNotification,
  IObservable,
  IObserver,
  IUnsubscribe,
  mergeMapS$$,
  raceWithNotifications,
  singleN,
  timeout,
} from '@lirx/core';
import {
  createNotAbleToLocateRouterOutletError,
  INotAbleToLocateRouterOutletError,
} from '../errors/not-able-to-locate-router-outlet-error/not-able-to-locate-router-outlet-error';

export const DEFAULT_ROUTER_OUTLET_ATTRIBUTE_NAME = 'rx-router-outlet';
export const DEFAULT_ROUTER_OUTLET_SELECTOR = `[${DEFAULT_ROUTER_OUTLET_ATTRIBUTE_NAME}]`;

export function locateRouterOutletElement(
  routerOutletSelector: string,
  parentNode: ParentNode,
): IObservable<HTMLElement> {
  return (emit: IObserver<HTMLElement>): IUnsubscribe => {
    let running: boolean = true;

    const clear = (): void => {
      if (running) {
        running = false;
        unsubscribeIdle();
      }
    };

    const unsubscribeIdle = idle({ timeout: 500 })((): void => {
      const routerOutletElement: HTMLElement | null = parentNode.querySelector(routerOutletSelector);
      if (routerOutletElement !== null) {
        emit(routerOutletElement);
        clear();
      }
    });

    return clear;
  };
}

export function locateRouterOutletElementWithNotifications(
  routerOutletSelector: string,
  parentNode: ParentNode,
): IObservable<IDefaultNotificationsUnion<HTMLElement>> {
  return mergeMapS$$(
    locateRouterOutletElement(
      routerOutletSelector,
      parentNode,
    ),
    (routerOutletElement: HTMLElement): IObservable<IDefaultNotificationsUnion<HTMLElement>> => {
      return singleN(routerOutletElement);
    },
  );
}

export function locateRouterOutletElementWithNotificationsAndTimeout(
  routerOutletSelector: string,
  parentNode: ParentNode,
  duration: number,
): IObservable<IDefaultNotificationsUnion<HTMLElement>> {
  return raceWithNotifications([
    locateRouterOutletElementWithNotifications(routerOutletSelector, parentNode),
    timeout<IErrorNotification<INotAbleToLocateRouterOutletError>>(
      duration,
      (): IErrorNotification<INotAbleToLocateRouterOutletError> => {
        return createErrorNotification<INotAbleToLocateRouterOutletError>(createNotAbleToLocateRouterOutletError());
      },
    ),
  ]);
}


