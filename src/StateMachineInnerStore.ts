import { merge } from './utils/merge';

/**
 * Store for inner meta-information for concrete StateMachine.
 * All methods and properties of this class used only in parent StateMachine class
 * and no one child statemachine dosnt have access to it
 */
export class StateMachineInnerStore {
  /**
   * @description name of current state
   */
  currentState: string = 'initial';

  /**
   * @description Store initial state
   */
  private $initialState: Record<string, any> = {};

  /**
   * @description - key-value-store for onEnter callbacks
   * key - state name, value - array with callbacks
   */
  private onEnterCbs: Record<string, Array<(...args: Array<any>) => void>> = {};

  /**
   * @description - key-value-store for onLeave callbacks
   * key - state name, value - array with callbacks
   */
  private onLeaveCbs: Record<string, Array<() => void>> = {};

  /**
   * @description store initial value of property to $initialState
   */
  rememberInitialKey(key: string, value: any): void {
    // Here is important to break links with statemachine properties.
    // If value wasn`t primitive type - they save by link
    // And if we change them - initialState change too.
    const assignable: Record<string, any> = {};
    assignable[key] = value;
    merge(this.$initialState, assignable);
    // Object.assign(this.$initialState, assignable);  // Here initial state become as mutable! We have test for it
  }

  get initialState(): object {
    return this.$initialState;
  }

  get isInitialState(): boolean {
    return this.currentState === 'initial';
  }

  /**
   * @description register onEnter callback, return function for drop callback
   */
  registerEnterCallback(stateName: string, cb: () => void): () => void {
    if (!this.onEnterCbs[stateName]) {
      this.onEnterCbs[stateName] = [];
    }
    const stateEnterCbs: Array<() => void> = this.onEnterCbs[stateName];
    stateEnterCbs.push(cb);
    return (): any => stateEnterCbs.splice(stateEnterCbs.indexOf(cb), 1);
  }

  /**
   * @description register onLeave callback, return function for drop callback
   */
  registerLeaveCallback(stateName: string, cb: () => void): () => void {
    if (!this.onLeaveCbs[stateName]) {
      this.onLeaveCbs[stateName] = [];
    }
    const stateLeaveCbs: Array<() => void> = this.onLeaveCbs[stateName];
    stateLeaveCbs.push(cb);
    return (): any => stateLeaveCbs.splice(stateLeaveCbs.indexOf(cb), 1);
  }

  callEnterCbs(stateName: string, args?: Array<any>): void {
    if (this.onEnterCbs[stateName]) {
      this.onEnterCbs[stateName].forEach(cb => cb(...args as any));
    }
  }

  callLeaveCbs(): void {
    const stateName = this.currentState;
    if (this.onLeaveCbs[stateName]) {
      this.onLeaveCbs[stateName].forEach(cb => cb());
    }
  }
}
