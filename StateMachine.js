"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const StateMachineInnerStore_1 = require("./StateMachineInnerStore");
const StateMachineMetadata_1 = require("./StateMachineMetadata");
/**
 * @description изолированное хранилище внутренней информации конкретной StateMachine
 */
const StateMachineWeakMap = new WeakMap();
class StateMachine {
    /**
     * @description Служебный статический метод, генерирующий текст ошибки, сообщающей о невозможности перейти в состояние
     * @param currentState - из какого состояния не смогли перейти
     * @param stateName - в какой состяоние не смогли перейти
     * @returns string - сообщение об ошибке
     */
    static NEXT_STATE_RESTRICTED(currentState, stateName) {
        return `Navigate to ${stateName} restircted by 'to' argument of state ${currentState}`;
    }
    /**
     * @description Служебный статический декоратор, прячет декорированный метод от перебора в цикле for-in
     */
    static hide() {
        return (_target, _key, descriptor) => {
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
    static extend(parentState, to = []) {
        return (target, stateName) => StateMachineMetadata_1.StateMachineMetadata.defineMetadata(target, stateName, parentState, to);
    }
    /**
     * @description Получить хранилище внутренней информации для данного экземпляра StateMachine
     */
    get $store() {
        let store = StateMachineWeakMap.get(this);
        if (store) {
            return store;
        }
        store = new StateMachineInnerStore_1.StateMachineInnerStore();
        StateMachineWeakMap.set(this, store);
        return store;
    }
    /**
     * @description Массив состояний, в которые можно перейти из 'initial'
     */
    get $next() {
        return [];
    }
    /**
     * @description Служебный метод для получения прототипа текущего экземпляра StateMachine. Нужен для извлечения метаданных
     */
    get selfPrototype() {
        return Object.getPrototypeOf(this);
    }
    /**
     * @description Служебный метод для получения метаданных о состоянии stateName
     * @param stateName - название состояния
     */
    getMetadataByName(stateName) {
        return StateMachineMetadata_1.StateMachineMetadata.getByName(this.selfPrototype, stateName);
    }
    /**
     * @description Метод для смены состояния StateMachine в targetState.
     * Проверяет что оно зарегистрировано, что в него можно перейти из текущего состояния и если ок - переходит.
     * @param targetState - название состояния, в которое нужно перейти
     * @param args - любые данные, которые будут проброшены в onEnter-callback при входе в состояние
     */
    transitTo(targetState, ...args) {
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
        }
        else {
            // У других состояний допуски хранятся в их метаданных
            const currentStateProps = this.getMetadataByName(this.$store.currentState);
            const to = currentStateProps.to;
            if (!to.includes(targetState)) {
                console.error(StateMachine.NEXT_STATE_RESTRICTED(this.$store.currentState, targetState));
                return;
            }
        }
        // Т.к. состояния не "чистые", а наследуемые - применять любое состояние буду от initial до требуемого. Использую стек, LIFO
        const stateChain = [stateToApply];
        if (targetState !== 'initial') {
            const targetStateProps = this.getMetadataByName(targetState);
            let parentStateName = targetStateProps.parentState;
            while (parentStateName !== 'initial') {
                stateChain.unshift(this[parentStateName]);
                const prevStateProps = this.getMetadataByName(parentStateName);
                parentStateName = prevStateProps.parentState;
            }
        }
        // Вызввать все коллбэки при выходе из состояния
        this.$store.callLeaveCbs();
        // Применяем стек состояний
        lodash_1.merge(this, this.$store.initialState);
        while (stateChain.length) {
            const tempState = stateChain.shift();
            lodash_1.merge(this, tempState);
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
    rememberInitState() {
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
    onEnter(stateName, cb) {
        return this.$store.registerEnterCallback(stateName, cb);
    }
    /**
     * @description Метод, регистрирующий коллбэк cb для ВЫХОДА из состояния stateName
     * @param stateName - название состояния
     * @param cb - коллбэк
     */
    onLeave(stateName, cb) {
        return this.$store.registerLeaveCallback(stateName, cb);
    }
    /**
     * @description Название текущего состояния StateMachine
     */
    get currentState() {
        return this.$store.currentState;
    }
    /**
     * @description Проверка, находится-ли машина в состоянии stateName
     * @param stateName - название проверяемого состояния
     */
    is(stateName) {
        return this.currentState === stateName;
    }
    /**
     * @description Проверка что машина может перейти в состояние stateName из текущего
     * @param stateName - название целевого состояния
     * @returns {boolean}
     */
    can(stateName) {
        if (this.$store.isInitialState) {
            return this.$next.includes(stateName);
        }
        const currentStateProps = StateMachineMetadata_1.StateMachineMetadata.getByName(this.selfPrototype, this.currentState);
        return currentStateProps.to.includes(stateName);
    }
    /**
     * @description Получить список состояний, в которые машина может перейти из текущего
     * @return {Array<string>}
     */
    transitions() {
        return this.$store.isInitialState ? this.$next : this.getMetadataByName(this.currentState).to;
    }
}
/**
 * @description константа с названием initial-состояния.
 * @type {string}
 */
StateMachine.INITIAL = 'initial';
__decorate([
    StateMachine.hide(),
    __metadata("design:type", StateMachineInnerStore_1.StateMachineInnerStore),
    __metadata("design:paramtypes", [])
], StateMachine.prototype, "$store", null);
__decorate([
    StateMachine.hide(),
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [])
], StateMachine.prototype, "$next", null);
__decorate([
    StateMachine.hide(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], StateMachine.prototype, "selfPrototype", null);
__decorate([
    StateMachine.hide(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", StateMachineMetadata_1.StateMachineMetadata)
], StateMachine.prototype, "getMetadataByName", null);
__decorate([
    StateMachine.hide(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StateMachine.prototype, "transitTo", null);
__decorate([
    StateMachine.hide(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StateMachine.prototype, "rememberInitState", null);
__decorate([
    StateMachine.hide(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", Function)
], StateMachine.prototype, "onEnter", null);
__decorate([
    StateMachine.hide(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", Function)
], StateMachine.prototype, "onLeave", null);
__decorate([
    StateMachine.hide(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], StateMachine.prototype, "currentState", null);
__decorate([
    StateMachine.hide(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StateMachine.prototype, "is", null);
__decorate([
    StateMachine.hide(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StateMachine.prototype, "can", null);
__decorate([
    StateMachine.hide(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StateMachine.prototype, "transitions", null);
exports.StateMachine = StateMachine;
//# sourceMappingURL=StateMachine.js.map