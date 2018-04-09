import { IStateMetadata, StateMachineMetadata } from './StateMachineMetadata';
import { IStateMachine } from './types';

export class StateMachineStore {
  private static store: Map<new (...args: Array<any>) => IStateMachine, StateMachineMetadata> = new Map();

  static defineState(
    target: new (...args: Array<any>) => IStateMachine,
    stateName: string,
    parentState: string,
    to: string | Array<string>
  ): void {
    let metadata;

    if (!this.store.has(target)) {
      metadata = new StateMachineMetadata();
      this.store.set(target, metadata);
    }

    metadata = this.store.get(target);

    metadata.addState(stateName, parentState, to);
  }

  static getState(
    target: new (...args: Array<any>) => IStateMachine,
    stateName: string
  ): IStateMetadata {
    const metadata: StateMachineMetadata = this.store.get(target)!;
    return metadata.getState(stateName);
  }
}
