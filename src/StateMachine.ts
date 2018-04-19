import { merge } from './utils/merge';
import { StateMachineInnerStore } from './StateMachineInnerStore';
import { StateMachineStore } from './StateMachineStore';
import { IStateMetadata } from './StatesStore';
import { IStateMachine } from './types';

/**
 * @description isolated store for meta-information of concrete StateMachine
 */
const StateMachineWeakMap: WeakMap<StateMachine, StateMachineInnerStore> = new WeakMap<StateMachine, StateMachineInnerStore>();

export class StateMachine implements IStateMachine {
  private _$next: Array<string> = [];
  /**
   * @description constant to store initial state name
   * @type {string}
   */
  static INITIAL: string = 'initial';

  /**
   * @description static service method for generate error text about unable transit to
   * @param currentState - from what state cant transit
   * @param stateName - to what state cant transit
   * @returns string - message
   */
  private static NEXT_STATE_RESTRICTED(currentState: string, stateName: string): string {
    return `Navigate to ${stateName} restircted by 'to' argument of state ${currentState}`;
  }

  /**
   * @description Static service decorator for hiding property/method in for-in
   */
  static hide(_target: object, _key: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    console.error('StateMachine.hide is deprecated. Use StateMachineDecorator($next) and StateDecorator(parent, to) instead');
    if (descriptor) {
      descriptor.enumerable = false;
    } else {
      descriptor = { enumerable: false, configurable: true };
    }
    return descriptor;
  }

  private static innerHide(_target: object, _key: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    if (descriptor) {
      descriptor.enumerable = false;
    } else {
      descriptor = { enumerable: false, configurable: true };
    }
    return descriptor;
  }

  /**
   * @description Static service decorator - make state inheritance
   * Name of decorated property becomes as state name
   * @param parentState - name of parent state
   * @param to - states in which we can transit from them state
   */
  static extend(
    parentState: string,
    to: string | Array<string> = []
  ): any {
    console.error('StateMachine.extend decorator is deprecated. Use StateDecorator(parent, to) instead');
    return (target: new (...args: Array<any>) => IStateMachine, stateName: string): void =>
      StateMachineStore.defineState(target, stateName, parentState, to);
  }

  /**
   * @description Receive store of inner information for this instance of StateMachine
   */
  @StateMachine.innerHide
  private get $store(): StateMachineInnerStore {
    let store: StateMachineInnerStore | undefined = StateMachineWeakMap.get(this);
    if (store) {
      return store;
    }
    store = new StateMachineInnerStore();
    StateMachineWeakMap.set(this, store);
    return store;
  }

  /**
   * @description Array of states in which machine can transit from initial
   */
  @StateMachine.innerHide
  protected get $next(): Array<string> {
    console.error('$next is deprecated. Use StateMachineDecorator($next) instead')
    return this._$next;
  }

  protected set $next(value: Array<string>) {
    this._$next = value;
  }

  /**
   * @description Service method for get prototype of current instance
   */
  @StateMachine.innerHide
  private get selfPrototype(): any {
    return Object.getPrototypeOf(this);
  }

  /**
   * @description Service method for get metadata for state
   */
  @StateMachine.innerHide
  private getMetadataByName(stateName: string): IStateMetadata {
    return StateMachineStore.getState(this.selfPrototype, stateName);
  }

  /**
   * @description Method for transit machine to another state
   * Check the target state is registered, check transition is possible
   * @param targetState - name of state to transit
   * @param args - any data for pass to onEnter callback
   */
  @StateMachine.innerHide
  transitTo(targetState: string, ...args: Array<any>): void {
    // Check target state is registered
    const stateToApply = targetState !== 'initial' ? this[targetState] : this.$store.initialState;
    if (!stateToApply) {
      // Here and next - simply write error to console and return
      console.error(`No state '${targetState}' for navigation registered`);
      return;
    }

    // Check transition is possible
    if (this.$store.isInitialState) {
      // initial state store next on $next
      if (!this.$next.includes(targetState)) {
        console.error(StateMachine.NEXT_STATE_RESTRICTED(this.$store.currentState, targetState));
        return;
      }
    } else {
      // another states store next in them metadata
      const currentStateProps: IStateMetadata = this.getMetadataByName(this.$store.currentState);
      const to: Array<string> = currentStateProps.to;
      if (!to.includes(targetState)) {
        console.error(StateMachine.NEXT_STATE_RESTRICTED(this.$store.currentState, targetState));
        return;
      }
    }

    // Make chain of states
    const stateChain: Array<any> = [stateToApply];

    if (targetState !== 'initial') {
      const targetStateProps: IStateMetadata = this.getMetadataByName(targetState);
      let parentStateName = targetStateProps.parentState;

      while (parentStateName !== 'initial') {
        stateChain.unshift(this[parentStateName]);
        const prevStateProps: IStateMetadata = this.getMetadataByName(parentStateName);
        parentStateName = prevStateProps.parentState;
      }
    }

    // Call onLeave callbacks
    this.$store.callLeaveCbs();

    // Apply states chain
    merge(this, this.$store.initialState);
    while (stateChain.length) {
      const tempState = stateChain.shift();
      merge(this, tempState);
    }

    // Call all onEnter callbacks
    this.$store.callEnterCbs(targetState, args);

    this.$store.currentState = targetState;
  }

  /**
   * @description Service method. Required to call in constructor of child-class
   * for create a snapshot of initial state
   */
  @StateMachine.innerHide
  protected rememberInitState(): void {
    console.error('rememberInitState is deprecated. Use Initial and StateMachineDecorator($next) decorators instead');
    for (const key in this) {
      if (key !== 'constructor') {
        this.$store.rememberInitialKey(key, this[key]);
      }
    }
  }

  @StateMachine.innerHide
  onEnter(stateName: string, cb: (...args: Array<any>) => void): () => void {
    return this.$store.registerEnterCallback(stateName, cb);
  }

  @StateMachine.innerHide
  onLeave(stateName: string, cb: () => void): () => void {
    return this.$store.registerLeaveCallback(stateName, cb);
  }

  /**
   * @description getter for current state name
   */
  @StateMachine.innerHide
  get currentState(): string {
    return this.$store.currentState;
  }

  @StateMachine.innerHide
  is(stateName: string): boolean {
    return this.currentState === stateName;
  }

  @StateMachine.innerHide
  can(stateName: string): boolean {
    if (this.$store.isInitialState) {
      return this.$next.includes(stateName);
    }
    const currentStateProps: IStateMetadata = StateMachineStore.getState(this.selfPrototype, this.currentState);
    return currentStateProps.to.includes(stateName);
  }

  @StateMachine.innerHide
  transitions(): Array<string> {
    return this.$store.isInitialState ? this.$next : this.getMetadataByName(this.currentState).to;
  }
}
