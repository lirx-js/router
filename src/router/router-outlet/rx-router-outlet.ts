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
import { VirtualDOMNode, virtualDOMNodeQuerySelectorOrThrow } from '@lirx/dom';
import {
  createNotAbleToLocateRouterOutletError,
  INotAbleToLocateRouterOutletError,
} from '../errors/not-able-to-locate-router-outlet-error/not-able-to-locate-router-outlet-error';

export const DEFAULT_ROUTER_OUTLET_ATTRIBUTE_NAME = 'rx-router-outlet';
export const DEFAULT_ROUTER_OUTLET_SELECTOR = `[${DEFAULT_ROUTER_OUTLET_ATTRIBUTE_NAME}]`;

export function locateRouterOutletElement(
  routerOutletSelector: string,
  parentNode: VirtualDOMNode,
): IObservable<VirtualDOMNode> {
  return (emit: IObserver<VirtualDOMNode>): IUnsubscribe => {
    let running: boolean = true;

    const clear = (): void => {
      if (running) {
        running = false;
        unsubscribeIdle();
      }
    };

    const unsubscribeIdle = idle({ timeout: 500 })((): void => {
      const routerOutletElement: VirtualDOMNode | null = virtualDOMNodeQuerySelectorOrThrow(parentNode, routerOutletSelector);
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
  parentNode: VirtualDOMNode,
): IObservable<IDefaultNotificationsUnion<VirtualDOMNode>> {
  return mergeMapS$$(
    locateRouterOutletElement(
      routerOutletSelector,
      parentNode,
    ),
    (routerOutletElement: VirtualDOMNode): IObservable<IDefaultNotificationsUnion<VirtualDOMNode>> => {
      return singleN(routerOutletElement);
    },
  );
}

export function locateRouterOutletElementWithNotificationsAndTimeout(
  routerOutletSelector: string,
  parentNode: VirtualDOMNode,
  duration: number,
): IObservable<IDefaultNotificationsUnion<VirtualDOMNode>> {
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


