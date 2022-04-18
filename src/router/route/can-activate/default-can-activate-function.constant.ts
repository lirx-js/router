import { IObservable, singleN } from '@lirx/core';
import {
  ICanActivateFunction,
  ICanActivateFunctionReturn,
  ICanActivateFunctionReturnedObservableValue,
  ICanActivateFunctionReturnedValue,
} from './can-activate-function.type';

const DEFAULT_CAN_ACTIVATE_FUNCTION_RETURN: ICanActivateFunctionReturn = singleN<ICanActivateFunctionReturnedValue>(true);

export const DEFAULT_CAN_ACTIVATE_FUNCTION: ICanActivateFunction = (): IObservable<ICanActivateFunctionReturnedObservableValue> => {
  return DEFAULT_CAN_ACTIVATE_FUNCTION_RETURN;
};
