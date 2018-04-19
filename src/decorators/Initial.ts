import { StateMachineStore } from '../StateMachineStore';

export function Initial(target: any, propertyKey: string): void {
  StateMachineStore.defineInitialKey(target, propertyKey);
}
