import { merge } from './utils/merge';
import { StateMachineInnerStore } from './StateMachineInnerStore';
import { StateMachineMetadata } from './StateMachineMetadata';

/**
 * @description изолированное хранилище внутренней информации конкретной StateMachine
 */
const StateMachineWeakMap: WeakMap<StateMachine, StateMachineInnerStore> = new WeakMap<StateMachine, StateMachineInnerStore>();

export class StateMachine {
    /**
     * @description константа с названием initial-состояния.
     * @type {string}
     */
    static INITIAL: string = 'initial';

    /**
     * @description Служебный статический метод, генерирующий текст ошибки, сообщающей о невозможности перейти в состояние
     * @param currentState - из какого состояния не смогли перейти
     * @param stateName - в какой состяоние не смогли перейти
     * @returns string - сообщение об ошибке
     */
    private static NEXT_STATE_RESTRICTED(currentState: string, stateName: string): string {
        return `Navigate to ${stateName} restircted by 'to' argument of state ${currentState}`;
    }

    /**
     * @description Служебный статический декоратор, прячет декорированный метод от перебора в цикле for-in
     */
    static hide(): (o: object, key: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
        return (_target: object, _key: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
            descriptor.enumerable = false;
            return descriptor;
        };
    }

    /**
     * @description Служебный статичный декоратор, делает наследование состояния.
     * Название декорируемого свойства класса будет названием регистрируемого сосотояния
     * @param parentState - имя родительского сосотояния(от которого наследуемся)
     * @param to - массив/строка состояний/состояния, в которые/которое можно перейти из данного состояния.
     */
    static extend(parentState: string, to: string | Array<string> = []): (target: object, stateName: string) => void {
        return (target: object, stateName: string): void => StateMachineMetadata.defineMetadata(target, stateName, parentState, to);
    }

    /**
     * @description Получить хранилище внутренней информации для данного экземпляра StateMachine
     */
    @StateMachine.hide()
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
     * @description Массив состояний, в которые можно перейти из 'initial'
     */
    @StateMachine.hide()
    protected get $next(): Array<string> {
        return [];
    }

    /**
     * @description Служебный метод для получения прототипа текущего экземпляра StateMachine. Нужен для извлечения метаданных
     */
    @StateMachine.hide()
    private get selfPrototype(): any {
        return Object.getPrototypeOf(this);
    }

    /**
     * @description Служебный метод для получения метаданных о состоянии stateName
     * @param stateName - название состояния
     */
    @StateMachine.hide()
    private getMetadataByName(stateName: string): StateMachineMetadata {
        return StateMachineMetadata.getByName(this.selfPrototype, stateName);
    }

    /**
     * @description Метод для смены состояния StateMachine в targetState.
     * Проверяет что оно зарегистрировано, что в него можно перейти из текущего состояния и если ок - переходит.
     * @param targetState - название состояния, в которое нужно перейти
     * @param args - любые данные, которые будут проброшены в onEnter-callback при входе в состояние
     */
    @StateMachine.hide()
    transitTo(targetState: string, ...args: Array<any>): void {
        // Проверить, что нужное состояние зарегистрировано
        const stateToApply = targetState !== 'initial' ? this[targetState] : this.$store.initialState;
        if (!stateToApply) {
            // Здесь и далее - просто напишу ошибку в консоль и выйду из метода.
            // Сделано это затем, что если метод вызвать внутри коллбэков промиса - промис словит эту ошибку и промолчит.
            // А ошибка по сути служебная, только для разработчика, что он забыл что-то описать или опечатался
            console.error(`No state '${targetState}' for navigation registered`);
            return;
        }

        // Проверим, что можем совершить переход в нужное состояние
        if (this.$store.isInitialState) {
            // У initial-состояния допуски для перехода хранятся в $next
            if (!this.$next.includes(targetState)) {
                console.error(StateMachine.NEXT_STATE_RESTRICTED(this.$store.currentState, targetState));
                return;
            }
        } else {
            // У других состояний допуски хранятся в их метаданных
            const currentStateProps: StateMachineMetadata = this.getMetadataByName(this.$store.currentState);
            const to: Array<string> = currentStateProps.to;
            if (!to.includes(targetState)) {
                console.error(StateMachine.NEXT_STATE_RESTRICTED(this.$store.currentState, targetState));
                return;
            }
        }

        // Т.к. состояния не "чистые", а наследуемые - применять любое состояние буду от initial до требуемого. Использую стек, LIFO
        const stateChain: Array<any> = [stateToApply];

        if (targetState !== 'initial') {
            const targetStateProps: StateMachineMetadata = this.getMetadataByName(targetState);
            let parentStateName = targetStateProps.parentState;

            while (parentStateName !== 'initial') {
                stateChain.unshift(this[parentStateName]);
                const prevStateProps: StateMachineMetadata = this.getMetadataByName(parentStateName);
                parentStateName = prevStateProps.parentState;
            }
        }

        // Вызввать все коллбэки при выходе из состояния
        this.$store.callLeaveCbs();

        // Применяем стек состояний
        merge(this, this.$store.initialState);
        while (stateChain.length) {
            const tempState = stateChain.shift();
            merge(this, tempState);
        }

        // Вызвать все коллбэки при входе в состояние
        this.$store.callEnterCbs(targetState, args);

        // Записываем, что пришли в состояние
        this.$store.currentState = targetState;
    }

    /**
     * @description Служебный метод, который обязательно вызывать в конструкторе класса-потомка
     * для создания слепка начального состояния StateMachine.
     */
    @StateMachine.hide()
    protected rememberInitState(): void {
        for (const key in this) {
            if (key !== 'constructor') {
                this.$store.rememberInitialKey(key, this[key]);
            }
        }
    }

    /**
     * @description Метод, регистрирующий коллбэк cb для ВХОДА в состяоние stateName
     * @param stateName - название состояния
     * @param cb - коллбэк
     */
    @StateMachine.hide()
    onEnter(stateName: string, cb: (...args: Array<any>) => void): () => void {
        return this.$store.registerEnterCallback(stateName, cb);
    }

    /**
     * @description Метод, регистрирующий коллбэк cb для ВЫХОДА из состояния stateName
     * @param stateName - название состояния
     * @param cb - коллбэк
     */
    @StateMachine.hide()
    onLeave(stateName: string, cb: () => void): () => void {
        return this.$store.registerLeaveCallback(stateName, cb);
    }

    /**
     * @description Название текущего состояния StateMachine
     */
    @StateMachine.hide()
    get currentState(): string {
        return this.$store.currentState;
    }

    /**
     * @description Проверка, находится-ли машина в состоянии stateName
     * @param stateName - название проверяемого состояния
     */
    @StateMachine.hide()
    is(stateName: string): boolean {
        return this.currentState === stateName;
    }

    /**
     * @description Проверка что машина может перейти в состояние stateName из текущего
     * @param stateName - название целевого состояния
     * @returns {boolean}
     */
    @StateMachine.hide()
    can(stateName: string): boolean {
        if (this.$store.isInitialState) {
            return this.$next.includes(stateName);
        }
        const currentStateProps: StateMachineMetadata = StateMachineMetadata.getByName(this.selfPrototype, this.currentState);
        return currentStateProps.to.includes(stateName);
    }

    /**
     * @description Получить список состояний, в которые машина может перейти из текущего
     * @return {Array<string>}
     */
    @StateMachine.hide()
    transitions(): Array<string> {
        return this.$store.isInitialState ? this.$next : this.getMetadataByName(this.currentState).to;
    }
}
