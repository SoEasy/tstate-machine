export type IStateDeclaration<T> = {
  [F in keyof T]?: T[F];
};

export interface IStateMachine {
  transitTo(targetState: string): void;
}
