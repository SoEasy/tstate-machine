(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("index", [], factory);
	else if(typeof exports === 'object')
		exports["index"] = factory();
	else
		root["index"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Yep, I'm too lazy to do cloning and merging myself :D
// But I add some changes - drop links to target and sources by using `clone`
// https://stackoverflow.com/a/1042676/2122752
// https://stackoverflow.com/a/34749873/2122752
Object.defineProperty(exports, "__esModule", { value: true });
function clone(from) {
    if (from === null || typeof from !== 'object')
        return from;
    if (from.constructor !== Object && from.constructor !== Array)
        return from;
    if (from.constructor === Date || from.constructor === RegExp || from.constructor === Function ||
        from.constructor === String || from.constructor === Number || from.constructor === Boolean) {
        return new from.constructor(from);
    }
    var to = new from.constructor();
    for (var name_1 in from) {
        to[name_1] = typeof to[name_1] === 'undefined' ? clone(from[name_1]) : to[name_1];
    }
    return to;
}
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}
function merge(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    if (!sources.length)
        return target;
    var source = clone(sources.shift());
    // target = clone(target);
    if (isObject(target) && isObject(source)) {
        for (var key in source) {
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, (_a = {}, _a[key] = {}, _a));
                }
                if (isObject(target[key])) {
                    merge(target[key], source[key]);
                }
                else {
                    target[key] = source[key];
                }
            }
            else {
                Object.assign(target, (_b = {}, _b[key] = source[key], _b));
            }
        }
    }
    else {
        target = clone(source);
    }
    return merge.apply(void 0, [target].concat(sources));
    var _a, _b;
}
exports.merge = merge;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

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
var merge_1 = __webpack_require__(0);
var StateMachineInnerStore_1 = __webpack_require__(2);
var StateMachineMetadata_1 = __webpack_require__(3);
/**
 * @description изолированное хранилище внутренней информации конкретной StateMachine
 */
var StateMachineWeakMap = new WeakMap();
var StateMachine = (function () {
    function StateMachine() {
    }
    /**
     * @description Служебный статический метод, генерирующий текст ошибки, сообщающей о невозможности перейти в состояние
     * @param currentState - из какого состояния не смогли перейти
     * @param stateName - в какой состяоние не смогли перейти
     * @returns string - сообщение об ошибке
     */
    StateMachine.NEXT_STATE_RESTRICTED = function (currentState, stateName) {
        return "Navigate to " + stateName + " restircted by 'to' argument of state " + currentState;
    };
    /**
     * @description Служебный статический декоратор, прячет декорированный метод от перебора в цикле for-in
     */
    StateMachine.hide = function () {
        return function (_target, _key, descriptor) {
            descriptor.enumerable = false;
            return descriptor;
        };
    };
    /**
     * @description Служебный статичный декоратор, делает наследование состояния.
     * Название декорируемого свойства класса будет названием регистрируемого сосотояния
     * @param parentState - имя родительского сосотояния(от которого наследуемся)
     * @param to - массив/строка состояний/состояния, в которые/которое можно перейти из данного состояния.
     */
    StateMachine.extend = function (parentState, to) {
        if (to === void 0) { to = []; }
        return function (target, stateName) { return StateMachineMetadata_1.StateMachineMetadata.defineMetadata(target, stateName, parentState, to); };
    };
    Object.defineProperty(StateMachine.prototype, "$store", {
        /**
         * @description Получить хранилище внутренней информации для данного экземпляра StateMachine
         */
        get: function () {
            var store = StateMachineWeakMap.get(this);
            if (store) {
                return store;
            }
            store = new StateMachineInnerStore_1.StateMachineInnerStore();
            StateMachineWeakMap.set(this, store);
            return store;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateMachine.prototype, "$next", {
        /**
         * @description Массив состояний, в которые можно перейти из 'initial'
         */
        get: function () {
            return [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateMachine.prototype, "selfPrototype", {
        /**
         * @description Служебный метод для получения прототипа текущего экземпляра StateMachine. Нужен для извлечения метаданных
         */
        get: function () {
            return Object.getPrototypeOf(this);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @description Служебный метод для получения метаданных о состоянии stateName
     * @param stateName - название состояния
     */
    StateMachine.prototype.getMetadataByName = function (stateName) {
        return StateMachineMetadata_1.StateMachineMetadata.getByName(this.selfPrototype, stateName);
    };
    /**
     * @description Метод для смены состояния StateMachine в targetState.
     * Проверяет что оно зарегистрировано, что в него можно перейти из текущего состояния и если ок - переходит.
     * @param targetState - название состояния, в которое нужно перейти
     * @param args - любые данные, которые будут проброшены в onEnter-callback при входе в состояние
     */
    StateMachine.prototype.transitTo = function (targetState) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        // Проверить, что нужное состояние зарегистрировано
        var stateToApply = targetState !== 'initial' ? this[targetState] : this.$store.initialState;
        if (!stateToApply) {
            // Здесь и далее - просто напишу ошибку в консоль и выйду из метода.
            // Сделано это затем, что если метод вызвать внутри коллбэков промиса - промис словит эту ошибку и промолчит.
            // А ошибка по сути служебная, только для разработчика, что он забыл что-то описать или опечатался
            console.error("No state '" + targetState + "' for navigation registered");
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
            var currentStateProps = this.getMetadataByName(this.$store.currentState);
            var to = currentStateProps.to;
            if (!to.includes(targetState)) {
                console.error(StateMachine.NEXT_STATE_RESTRICTED(this.$store.currentState, targetState));
                return;
            }
        }
        // Т.к. состояния не "чистые", а наследуемые - применять любое состояние буду от initial до требуемого. Использую стек, LIFO
        var stateChain = [stateToApply];
        if (targetState !== 'initial') {
            var targetStateProps = this.getMetadataByName(targetState);
            var parentStateName = targetStateProps.parentState;
            while (parentStateName !== 'initial') {
                stateChain.unshift(this[parentStateName]);
                var prevStateProps = this.getMetadataByName(parentStateName);
                parentStateName = prevStateProps.parentState;
            }
        }
        // Вызввать все коллбэки при выходе из состояния
        this.$store.callLeaveCbs();
        // Применяем стек состояний
        merge_1.merge(this, this.$store.initialState);
        while (stateChain.length) {
            var tempState = stateChain.shift();
            merge_1.merge(this, tempState);
        }
        // Вызвать все коллбэки при входе в состояние
        this.$store.callEnterCbs(targetState, args);
        // Записываем, что пришли в состояние
        this.$store.currentState = targetState;
    };
    /**
     * @description Служебный метод, который обязательно вызывать в конструкторе класса-потомка
     * для создания слепка начального состояния StateMachine.
     */
    StateMachine.prototype.rememberInitState = function () {
        for (var key in this) {
            if (key !== 'constructor') {
                this.$store.rememberInitialKey(key, this[key]);
            }
        }
    };
    /**
     * @description Метод, регистрирующий коллбэк cb для ВХОДА в состяоние stateName
     * @param stateName - название состояния
     * @param cb - коллбэк
     */
    StateMachine.prototype.onEnter = function (stateName, cb) {
        return this.$store.registerEnterCallback(stateName, cb);
    };
    /**
     * @description Метод, регистрирующий коллбэк cb для ВЫХОДА из состояния stateName
     * @param stateName - название состояния
     * @param cb - коллбэк
     */
    StateMachine.prototype.onLeave = function (stateName, cb) {
        return this.$store.registerLeaveCallback(stateName, cb);
    };
    Object.defineProperty(StateMachine.prototype, "currentState", {
        /**
         * @description Название текущего состояния StateMachine
         */
        get: function () {
            return this.$store.currentState;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @description Проверка, находится-ли машина в состоянии stateName
     * @param stateName - название проверяемого состояния
     */
    StateMachine.prototype.is = function (stateName) {
        return this.currentState === stateName;
    };
    /**
     * @description Проверка что машина может перейти в состояние stateName из текущего
     * @param stateName - название целевого состояния
     * @returns {boolean}
     */
    StateMachine.prototype.can = function (stateName) {
        if (this.$store.isInitialState) {
            return this.$next.includes(stateName);
        }
        var currentStateProps = StateMachineMetadata_1.StateMachineMetadata.getByName(this.selfPrototype, this.currentState);
        return currentStateProps.to.includes(stateName);
    };
    /**
     * @description Получить список состояний, в которые машина может перейти из текущего
     * @return {Array<string>}
     */
    StateMachine.prototype.transitions = function () {
        return this.$store.isInitialState ? this.$next : this.getMetadataByName(this.currentState).to;
    };
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
        __metadata("design:type", String),
        __metadata("design:paramtypes", [])
    ], StateMachine.prototype, "currentState", null);
    __decorate([
        StateMachine.hide(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Boolean)
    ], StateMachine.prototype, "is", null);
    __decorate([
        StateMachine.hide(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Boolean)
    ], StateMachine.prototype, "can", null);
    __decorate([
        StateMachine.hide(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Array)
    ], StateMachine.prototype, "transitions", null);
    return StateMachine;
}());
exports.StateMachine = StateMachine;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var merge_1 = __webpack_require__(0);
/**
 * Хранилище внутренней информации для конкретной StateMachine.
 * Все методы и свойства этого класса используются только в родительском классе StateMachine и никакие потомки сюда доступа не имеют
 */
var StateMachineInnerStore = (function () {
    function StateMachineInnerStore() {
        /**
         * @description Хранит начальное состояние машины
         */
        this.$initialState = {};
        /**
         * @description Название текущего состояния машины. Начальное - initial
         */
        this.currentState = 'initial';
        /**
         * @description - key-value-хранилище коллбэков, которые будут работать при ВХОДЕ в состояние.
         * Ключ - название состояния. Значение - массив с функциями
         */
        this.onEnterCbs = {};
        /**
         * @description - key-value-хранилище коллбэков, которые будут работать при ВЫХОДЕ из состояния.
         * Ключ - название состояния. Значение - массив с функциями
         */
        this.onLeaveCbs = {};
    }
    /**
     * @description метод, сохраняющий начальное ключа во внутренний объект $initialState.
     * Вызовы этого метода собирают чистое initial-состояние
     * @param key - ключ
     * @param value - значение
     */
    StateMachineInnerStore.prototype.rememberInitialKey = function (key, value) {
        // Здесь важно порвать ссылки с полями машины.
        // Было this.$initialState[key] = value. Если value не был примитивом - он сохранялся, очевидно, по ссылке.
        // И в случае его изменения - он изменялся и в initialState, что влекло за собой бардак.
        // Можно было использовать _.cloneDeep после запоминания всех ключей, но разницы имхо никакой кроме порождения лишнего метода
        var assignable = {};
        assignable[key] = value;
        merge_1.merge(this.$initialState, assignable);
        // Object.assign(this.$initialState, assignable);  // Here initial state become as mutable! We have test for it
    };
    Object.defineProperty(StateMachineInnerStore.prototype, "initialState", {
        /**
         * @description Начальное состояние машины
         */
        get: function () {
            return this.$initialState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateMachineInnerStore.prototype, "isInitialState", {
        /**
         * @description Находится-ли машина в начальном состоянии?
         */
        get: function () {
            return this.currentState === 'initial';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @description Регистрирует коллбэк cb, который вызовется при входе в состояние stateName
     * @param stateName - состояние, при входе в которое вызвать коллбэк
     * @param cb - коллбэк
     * @returns {()=>void} - функция удаления созданного коллбэка
     */
    StateMachineInnerStore.prototype.registerEnterCallback = function (stateName, cb) {
        if (!this.onEnterCbs[stateName]) {
            this.onEnterCbs[stateName] = [];
        }
        var stateEnterCbs = this.onEnterCbs[stateName];
        stateEnterCbs.push(cb);
        return function () { return stateEnterCbs.splice(stateEnterCbs.indexOf(cb), 1); };
    };
    /**
     * @description Регистрирует коллбэк cb, который вызовется при выходе из состояния stateName.
     * @param stateName - состояние, при выходе из которого вызвать коллбэк
     * @param cb - коллбэк
     * @returns {()=>void} - функция удаления созданного коллбэка
     */
    StateMachineInnerStore.prototype.registerLeaveCallback = function (stateName, cb) {
        if (!this.onLeaveCbs[stateName]) {
            this.onLeaveCbs[stateName] = [];
        }
        var stateLeaveCbs = this.onLeaveCbs[stateName];
        stateLeaveCbs.push(cb);
        return function () { return stateLeaveCbs.splice(stateLeaveCbs.indexOf(cb), 1); };
    };
    /**
     * @description Вызвать все коллбэки, зарегистрированные на вход в состояние stateName
     * @param stateName - имя состояния
     * @param args - возможные аргументы, переданные при переходе в состояние. Они попадут в коллбэк
     */
    StateMachineInnerStore.prototype.callEnterCbs = function (stateName, args) {
        if (this.onEnterCbs[stateName]) {
            this.onEnterCbs[stateName].forEach(function (cb) { return cb.apply(void 0, args); });
        }
    };
    /**
     * @description Вызывать все коллбэки по выходу из текущего состояния
     */
    StateMachineInnerStore.prototype.callLeaveCbs = function () {
        var stateName = this.currentState;
        if (this.onLeaveCbs[stateName]) {
            this.onLeaveCbs[stateName].forEach(function (cb) { return cb(); });
        }
    };
    return StateMachineInnerStore;
}());
exports.StateMachineInnerStore = StateMachineInnerStore;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var StateMachineMetadataKey = 'Tochka_StateMachineMetadata';
/**
 * Хранилище метаданных для состояний машины. Хранит родительское состояние и названия состояний куда можно перейти
 */
var StateMachineMetadata = (function () {
    function StateMachineMetadata() {
    }
    /**
     * @description Записывает специфичные метаданные для состояния
     * @param target - Прототип класса StateMachine
     * @param stateName - название переменной, в которой описано состояние. По совместительству - название состояния
     * @param parentState - состояние, от которого наследуемся
     * @param to - массив/название состояний, в которые/которое можем перейти
     */
    StateMachineMetadata.defineMetadata = function (target, stateName, parentState, to) {
        Reflect.defineMetadata(StateMachineMetadataKey, {
            parentState: parentState,
            to: Array.isArray(to) ? to : [to]
        }, target, stateName);
    };
    /**
     * @description Получение метаданных о состоянии
     * @param target - прототип класса StateMachine
     * @param name - название состояния, для которого извлекаем метаданные
     */
    StateMachineMetadata.getByName = function (target, name) {
        return Reflect.getMetadata(StateMachineMetadataKey, target, name);
    };
    return StateMachineMetadata;
}());
exports.StateMachineMetadata = StateMachineMetadata;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var StateMachine_1 = __webpack_require__(1);
exports.StateMachine = StateMachine_1.StateMachine;


/***/ })
/******/ ]);
});