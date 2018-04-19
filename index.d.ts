// Generated by dts-bundle v0.7.2

export class StateMachine implements IStateMachine {
        /**
            * @description constant to store initial state name
            * @type {string}
            */
        static INITIAL: string;
        /**
            * @description Static service decorator for hiding property/method in for-in
            */
        static hide(_target: object, _key: string, descriptor: PropertyDescriptor): PropertyDescriptor;
        /**
            * @description Static service decorator - make state inheritance
            * Name of decorated property becomes as state name
            * @param parentState - name of parent state
            * @param to - states in which we can transit from them state
            */
        static extend(parentState: string, to?: string | Array<string>): any;
        /**
            * @description Array of states in which machine can transit from initial
            */
        protected $next: Array<string>;
        /**
            * @description Method for transit machine to another state
            * Check the target state is registered, check transition is possible
            * @param targetState - name of state to transit
            * @param args - any data for pass to onEnter callback
            */
        transitTo(targetState: string, ...args: Array<any>): void;
        /**
            * @description Service method. Required to call in constructor of child-class
            * for create a snapshot of initial state
            */
        protected rememberInitState(): void;
        onEnter(stateName: string, cb: (...args: Array<any>) => void): () => void;
        onLeave(stateName: string, cb: () => void): () => void;
        /**
            * @description getter for current state name
            */
        readonly currentState: string;
        is(stateName: string): boolean;
        can(stateName: string): boolean;
        transitions(): Array<string>;
}

export type IStateDeclaration<T> = {
    [F in keyof T]?: T[F];
};
export interface IStateMachine {
    transitTo(targetState: string): void;
}

export function StateDecorator(parentState: string, to?: string | Array<string>): any;

export function StateMachineDecorator($next?: Array<string>): any;

export function Initial(target: any, propertyKey: string): void;

