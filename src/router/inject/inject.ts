import {
  createMulticastReplayLastSource,
  fulfilled$$$,
  IDefaultNotificationsUnion,
  IMulticastReplayLastSource,
  IObservable,
  pipe$$,
  singleN,
} from '@lirx/core';
import { IGenericGenericVirtualCustomElementNode, IVirtualDOMNodeOrNull, VirtualCustomElementNode } from '@lirx/dom';
import { IRouteParams } from '../route/route-params/route-params.type';
import {
  ILoadRXRouteComponentFunctionReturn,
  ILocateRXRouterOutletFunctionReturn,
  IMatchingResolvedRXRoute,
  IOptionalRXRouteComponent,
  IRXRouterOutletElement,
} from '../rx-route/rx-route';

export interface IInjectMatchingResolvedRXRouteOptions {
  resolvedRoute: IMatchingResolvedRXRoute;
  routerOutletElement: IRXRouterOutletElement;
}

export type IInjectedComponentState =
  'new'
  | 'recycled'
  ;

export interface IInjectedComponent {
  state: IInjectedComponentState;
  component: IGenericGenericVirtualCustomElementNode;
}

export type IOptionalInjectedComponent = IInjectedComponent | null;
export type IOptionalInjectedComponentsList = readonly IOptionalInjectedComponent[];
export type IInjectMatchingResolvedRXRouteReturnedObservableValue = IDefaultNotificationsUnion<IOptionalInjectedComponentsList>;

export function injectMatchingResolvedRXRoute(
  {
    resolvedRoute,
    routerOutletElement,
  }: IInjectMatchingResolvedRXRouteOptions,
): IObservable<IInjectMatchingResolvedRXRouteReturnedObservableValue> {

  const {
    params,
    childRoute,
    extra,
  } = resolvedRoute;

  const {
    locateRXRouterOutletElement,
    loadComponent,
    forceComponentReload,
  } = extra;

  const component$: ILoadRXRouteComponentFunctionReturn = (loadComponent === null)
    ? singleN<IOptionalRXRouteComponent>(null)
    : loadComponent();

  return pipe$$(component$, [
    fulfilled$$$((component: IOptionalRXRouteComponent): IObservable<IInjectMatchingResolvedRXRouteReturnedObservableValue> => {
      let injectedComponent: IInjectedComponent | null;

      if (component === null) {
        injectedComponent = null;
      } else {
        const routerOutletFirstElementChild: IVirtualDOMNodeOrNull = routerOutletElement.firstChild;

        if (
          forceComponentReload
          || (routerOutletFirstElementChild === null)
          || !(
            (routerOutletFirstElementChild instanceof VirtualCustomElementNode)
            && (routerOutletFirstElementChild.name === component.name)
          )
        ) {
          const componentInstance: IGenericGenericVirtualCustomElementNode = component.create();
          componentInstance.attach(routerOutletElement);
          injectedComponent = {
            state: 'new',
            component: componentInstance,
          };
          setRouteParams(componentInstance, params);
        } else {
          injectedComponent = {
            state: 'recycled',
            component: routerOutletFirstElementChild,
          };
          setRouteParams(routerOutletFirstElementChild, params);
        }
      }

      if (childRoute === null) {
        return singleN<IOptionalInjectedComponentsList>([
          injectedComponent,
        ]);
      } else {
        const childRouterOutletElement$: ILocateRXRouterOutletFunctionReturn = (component === null)
          ? singleN(routerOutletElement)
          : locateRXRouterOutletElement(routerOutletElement);

        return pipe$$(childRouterOutletElement$, [
          fulfilled$$$((childRouterOutletElement: IRXRouterOutletElement): IObservable<IInjectMatchingResolvedRXRouteReturnedObservableValue> => {
            return injectMatchingResolvedRXRoute({
              resolvedRoute: childRoute,
              routerOutletElement: childRouterOutletElement,
            });
          }),
          fulfilled$$$((injectedChildComponents: IOptionalInjectedComponentsList): IObservable<IInjectMatchingResolvedRXRouteReturnedObservableValue> => {
            return singleN<IOptionalInjectedComponentsList>([
              injectedComponent,
              ...injectedChildComponents,
            ]);
          }),
        ]);
      }
    }),
  ]);
}

export function differInjectedComponents(
  previouslyInjectedComponents: IOptionalInjectedComponentsList,
  injectedComponents: IOptionalInjectedComponentsList,
): void {
  const injectedElements = new Set<IGenericGenericVirtualCustomElementNode>();
  for (let i = 0, l = injectedComponents.length; i < l; i++) {
    const injectedComponent: IOptionalInjectedComponent = injectedComponents[i];
    if (injectedComponent !== null) {
      injectedElements.add(injectedComponent.component);
    }
  }

  for (let i = 0, l = previouslyInjectedComponents.length; i < l; i++) {
    const previousInjectedComponent: IOptionalInjectedComponent = previouslyInjectedComponents[i];
    if (previousInjectedComponent !== null) {
      const element = previousInjectedComponent.component;
      if (!injectedElements.has(element)) {
        element.detach();
      }
    }
  }
}

/* PARAMS */

const COMPONENT_PARAMS = new WeakMap<IGenericGenericVirtualCustomElementNode, IMulticastReplayLastSource<IRouteParams>>();

function getRouteParamsSource(
  component: IGenericGenericVirtualCustomElementNode,
): IMulticastReplayLastSource<IRouteParams> {
  let $routeParams$: IMulticastReplayLastSource<IRouteParams> | undefined = COMPONENT_PARAMS.get(component);
  if ($routeParams$ === void 0) {
    $routeParams$ = createMulticastReplayLastSource<IRouteParams>();
    COMPONENT_PARAMS.set(component, $routeParams$);
  }
  return $routeParams$;
}

function setRouteParams(
  component: IGenericGenericVirtualCustomElementNode,
  params: IRouteParams,
): void {
  return getRouteParamsSource(component).emit(params);
}

export function getRouteParams(
  component: IGenericGenericVirtualCustomElementNode,
): IObservable<IRouteParams> {
  return getRouteParamsSource(component).subscribe;
}
