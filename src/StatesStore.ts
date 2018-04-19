export interface IStateMetadata {
  parentState: string;
  to: Array<string>;
}

export class StatesStore {
  /**
   * Store states info by name
   */
  private store: Record<string, IStateMetadata> = {};

  addState(stateName: string, parentState: string, to: string | Array<string>): void {
    this.store[stateName] = {
      parentState,
      to: Array.isArray(to) ? to : [to]
    };
  }

  getState(stateName: string): IStateMetadata {
    return this.store[stateName];
  }
}
