import { IStateMachine } from '../types';
import { StateMachineStore } from '../StateMachineStore';

export function StateDecorator(parentState: string, to: string | Array<string> = []): any {
  return (target: new (...args: Array<any>) => IStateMachine, stateName: string): void => {
    StateMachineStore.defineState(target, stateName, parentState, to);
  };
}
