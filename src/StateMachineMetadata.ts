const StateMachineMetadataKey = 'Tochka_StateMachineMetadata';

/**
 * Хранилище метаданных для состояний машины. Хранит родительское состояние и названия состояний куда можно перейти
 */
export class StateMachineMetadata {
    parentState: string;
    to: Array<string>;

    /**
     * @description Записывает специфичные метаданные для состояния
     * @param target - Прототип класса StateMachine
     * @param stateName - название переменной, в которой описано состояние. По совместительству - название состояния
     * @param parentState - состояние, от которого наследуемся
     * @param to - массив/название состояний, в которые/которое можем перейти
     */
    static defineMetadata(target: object, stateName: string, parentState: string, to: string | Array<string>): void {
        (Reflect as any).defineMetadata(StateMachineMetadataKey, {
            parentState,
            to: Array.isArray(to) ? to : [to]
        }, target, stateName);
    }

    /**
     * @description Получение метаданных о состоянии
     * @param target - прототип класса StateMachine
     * @param name - название состояния, для которого извлекаем метаданные
     */
    static getByName(target: object, name: string): StateMachineMetadata {
        return (Reflect as any).getMetadata(StateMachineMetadataKey, target, name);
    }
}
