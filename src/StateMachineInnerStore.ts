import { merge } from './utils/merge';

/**
 * Хранилище внутренней информации для конкретной StateMachine.
 * Все методы и свойства этого класса используются только в родительском классе StateMachine и никакие потомки сюда доступа не имеют
 */
export class StateMachineInnerStore {
    /**
     * @description Хранит начальное состояние машины
     */
    private $initialState: Record<string, any> = {};

    /**
     * @description Название текущего состояния машины. Начальное - initial
     */
    public currentState: string = 'initial';

    /**
     * @description - key-value-хранилище коллбэков, которые будут работать при ВХОДЕ в состояние.
     * Ключ - название состояния. Значение - массив с функциями
     */
    private onEnterCbs: Record<string, Array<(...args: Array<any>) => void>> = {};

    /**
     * @description - key-value-хранилище коллбэков, которые будут работать при ВЫХОДЕ из состояния.
     * Ключ - название состояния. Значение - массив с функциями
     */
    private onLeaveCbs: Record<string, Array<() => void>> = {};

    /**
     * @description метод, сохраняющий начальное ключа во внутренний объект $initialState.
     * Вызовы этого метода собирают чистое initial-состояние
     * @param key - ключ
     * @param value - значение
     */
    rememberInitialKey(key: string, value: any): void {
        // Здесь важно порвать ссылки с полями машины.
        // Было this.$initialState[key] = value. Если value не был примитивом - он сохранялся, очевидно, по ссылке.
        // И в случае его изменения - он изменялся и в initialState, что влекло за собой бардак.
        // Можно было использовать _.cloneDeep после запоминания всех ключей, но разницы имхо никакой кроме порождения лишнего метода
        const assignable: Record<string, any> = {};
        assignable[key] = value;
        merge(this.$initialState, assignable);
        // Object.assign(this.$initialState, assignable);  // Here initial state become as mutable! We have test for it
    }

    /**
     * @description Начальное состояние машины
     */
    get initialState(): object {
        return this.$initialState;
    }

    /**
     * @description Находится-ли машина в начальном состоянии?
     */
    get isInitialState(): boolean {
        return this.currentState === 'initial';
    }

    /**
     * @description Регистрирует коллбэк cb, который вызовется при входе в состояние stateName
     * @param stateName - состояние, при входе в которое вызвать коллбэк
     * @param cb - коллбэк
     * @returns {()=>void} - функция удаления созданного коллбэка
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
     * @description Регистрирует коллбэк cb, который вызовется при выходе из состояния stateName.
     * @param stateName - состояние, при выходе из которого вызвать коллбэк
     * @param cb - коллбэк
     * @returns {()=>void} - функция удаления созданного коллбэка
     */
    registerLeaveCallback(stateName: string, cb: () => void): () => void {
        if (!this.onLeaveCbs[stateName]) {
            this.onLeaveCbs[stateName] = [];
        }
        const stateLeaveCbs: Array<() => void> = this.onLeaveCbs[stateName];
        stateLeaveCbs.push(cb);
        return (): any => stateLeaveCbs.splice(stateLeaveCbs.indexOf(cb), 1);
    }

    /**
     * @description Вызвать все коллбэки, зарегистрированные на вход в состояние stateName
     * @param stateName - имя состояния
     * @param args - возможные аргументы, переданные при переходе в состояние. Они попадут в коллбэк
     */
    callEnterCbs(stateName: string, args?: Array<any>): void {
        if (this.onEnterCbs[stateName]) {
            this.onEnterCbs[stateName].forEach(cb => cb(...args as any));
        }
    }

    /**
     * @description Вызывать все коллбэки по выходу из текущего состояния
     */
    callLeaveCbs(): void {
        const stateName = this.currentState;
        if (this.onLeaveCbs[stateName]) {
            this.onLeaveCbs[stateName].forEach(cb => cb());
        }
    }
}
