export type IStateDeclaration<T> = {
    [F in keyof T]?: T[F];
}
