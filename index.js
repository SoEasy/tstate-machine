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
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var StatesStore_1 = __webpack_require__(5);
/**
 * Store for all registered machines in runtime and them states.
 */
var StateMachineStore = (function () {
    function StateMachineStore() {
    }
    StateMachineStore.defineState = function (target, stateName, parentState, to) {
        var metadata;
        if (!this.statesByMachineStore.has(target)) {
            metadata = new StatesStore_1.StatesStore();
            this.statesByMachineStore.set(target, metadata);
        }
        metadata = this.statesByMachineStore.get(target);
        metadata.addState(stateName, parentState, to);
    };
    StateMachineStore.getState = function (target, stateName) {
        var metadata = this.statesByMachineStore.get(target);
        return metadata.getState(stateName);
    };
    StateMachineStore.defineInitialKey = function (target, key) {
        var keys;
        if (!this.initialKeysByMachineStore.has(target)) {
            keys = [];
            this.initialKeysByMachineStore.set(target, keys);
        }
        keys = this.initialKeysByMachineStore.get(target);
        keys.push(key);
    };
    StateMachineStore.getStatesForMachine = function (machinePrototype) {
        return this.statesByMachineStore.get(machinePrototype);
    };
    StateMachineStore.getInitialKeysForMachine = function (machinePrototype) {
        return this.initialKeysByMachineStore.get(machinePrototype) || [];
    };
    /**
     * Store states by machine.
     * Key - machine constructor
     * Value - States store
     */
    StateMachineStore.statesByMachineStore = new Map();
    StateMachineStore.initialKeysByMachineStore = new Map();
    return StateMachineStore;
}());
exports.StateMachineStore = StateMachineStore;


/***/ }),
/* 1 */
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
/* 2 */
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
var merge_1 = __webpack_require__(1);
var StateMachineInnerStore_1 = __webpack_require__(4);
var StateMachineStore_1 = __webpack_require__(0);
/**
 * @description isolated store for meta-information of concrete StateMachine
 */
var StateMachineWeakMap = new WeakMap();
var StateMachine = (function () {
    function StateMachine() {
        this._$next = [];
    }
    /**
     * @description static service method for generate error text about unable transit to
     * @param currentState - from what state cant transit
     * @param stateName - to what state cant transit
     * @returns string - message
     */
    StateMachine.NEXT_STATE_RESTRICTED = function (currentState, stateName) {
        return "Navigate to " + stateName + " restircted by 'to' argument of state " + currentState;
    };
    /**
     * @description Static service decorator for hiding property/method in for-in
     */
    StateMachine.hide = function (_target, _key, descriptor) {
        console.error('StateMachine.hide is deprecated. Use StateMachineDecorator($next) and StateDecorator(parent, to) instead');
        if (descriptor) {
            descriptor.enumerable = false;
        }
        else {
            descriptor = { enumerable: false, configurable: true };
        }
        return descriptor;
    };
    StateMachine.innerHide = function (_target, _key, descriptor) {
        if (descriptor) {
            descriptor.enumerable = false;
        }
        else {
            descriptor = { enumerable: false, configurable: true };
        }
        return descriptor;
    };
    /**
     * @description Static service decorator - make state inheritance
     * Name of decorated property becomes as state name
     * @param parentState - name of parent state
     * @param to - states in which we can transit from them state
     */
    StateMachine.extend = function (parentState, to) {
        if (to === void 0) { to = []; }
        console.error('StateMachine.extend decorator is deprecated. Use StateDecorator(parent, to) instead');
        return function (target, stateName) {
            return StateMachineStore_1.StateMachineStore.defineState(target, stateName, parentState, to);
        };
    };
    Object.defineProperty(StateMachine.prototype, "$store", {
        /**
         * @description Receive store of inner information for this instance of StateMachine
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
         * @description Array of states in which machine can transit from initial
         */
        get: function () {
            console.error('$next is deprecated. Use StateMachineDecorator($next) instead');
            return this._$next;
        },
        set: function (value) {
            this._$next = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateMachine.prototype, "selfPrototype", {
        /**
         * @description Service method for get prototype of current instance
         */
        get: function () {
            return Object.getPrototypeOf(this);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @description Service method for get metadata for state
     */
    StateMachine.prototype.getMetadataByName = function (stateName) {
        return StateMachineStore_1.StateMachineStore.getState(this.selfPrototype, stateName);
    };
    /**
     * @description Method for transit machine to another state
     * Check the target state is registered, check transition is possible
     * @param targetState - name of state to transit
     * @param args - any data for pass to onEnter callback
     */
    StateMachine.prototype.transitTo = function (targetState) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        // Check target state is registered
        var stateToApply = targetState !== 'initial' ? this[targetState] : this.$store.initialState;
        if (!stateToApply) {
            // Here and next - simply write error to console and return
            console.error("No state '" + targetState + "' for navigation registered");
            return;
        }
        // Check transition is possible
        if (this.$store.isInitialState) {
            // initial state store next on $next
            if (!this.$next.includes(targetState)) {
                console.error(StateMachine.NEXT_STATE_RESTRICTED(this.$store.currentState, targetState));
                return;
            }
        }
        else {
            // another states store next in them metadata
            var currentStateProps = this.getMetadataByName(this.$store.currentState);
            var to = currentStateProps.to;
            if (!to.includes(targetState)) {
                console.error(StateMachine.NEXT_STATE_RESTRICTED(this.$store.currentState, targetState));
                return;
            }
        }
        // Make chain of states
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
        // Call onLeave callbacks
        this.$store.callLeaveCbs();
        // Apply states chain
        merge_1.merge(this, this.$store.initialState);
        while (stateChain.length) {
            var tempState = stateChain.shift();
            merge_1.merge(this, tempState);
        }
        // Call all onEnter callbacks
        this.$store.callEnterCbs(targetState, args);
        this.$store.currentState = targetState;
    };
    /**
     * @description Service method. Required to call in constructor of child-class
     * for create a snapshot of initial state
     */
    StateMachine.prototype.rememberInitState = function () {
        console.error('rememberInitState is deprecated. Use Initial and StateMachineDecorator($next) decorators instead');
        for (var key in this) {
            if (key !== 'constructor') {
                this.$store.rememberInitialKey(key, this[key]);
            }
        }
    };
    StateMachine.prototype.onEnter = function (stateName, cb) {
        return this.$store.registerEnterCallback(stateName, cb);
    };
    StateMachine.prototype.onLeave = function (stateName, cb) {
        return this.$store.registerLeaveCallback(stateName, cb);
    };
    Object.defineProperty(StateMachine.prototype, "currentState", {
        /**
         * @description getter for current state name
         */
        get: function () {
            return this.$store.currentState;
        },
        enumerable: true,
        configurable: true
    });
    StateMachine.prototype.is = function (stateName) {
        return this.currentState === stateName;
    };
    StateMachine.prototype.can = function (stateName) {
        if (this.$store.isInitialState) {
            return this.$next.includes(stateName);
        }
        var currentStateProps = StateMachineStore_1.StateMachineStore.getState(this.selfPrototype, this.currentState);
        return currentStateProps.to.includes(stateName);
    };
    StateMachine.prototype.transitions = function () {
        return this.$store.isInitialState ? this.$next : this.getMetadataByName(this.currentState).to;
    };
    /**
     * @description constant to store initial state name
     * @type {string}
     */
    StateMachine.INITIAL = 'initial';
    __decorate([
        StateMachine.innerHide,
        __metadata("design:type", StateMachineInnerStore_1.StateMachineInnerStore),
        __metadata("design:paramtypes", [])
    ], StateMachine.prototype, "$store", null);
    __decorate([
        StateMachine.innerHide,
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], StateMachine.prototype, "$next", null);
    __decorate([
        StateMachine.innerHide,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], StateMachine.prototype, "selfPrototype", null);
    __decorate([
        StateMachine.innerHide,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Object)
    ], StateMachine.prototype, "getMetadataByName", null);
    __decorate([
        StateMachine.innerHide,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], StateMachine.prototype, "transitTo", null);
    __decorate([
        StateMachine.innerHide,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], StateMachine.prototype, "rememberInitState", null);
    __decorate([
        StateMachine.innerHide,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Function]),
        __metadata("design:returntype", Function)
    ], StateMachine.prototype, "onEnter", null);
    __decorate([
        StateMachine.innerHide,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Function]),
        __metadata("design:returntype", Function)
    ], StateMachine.prototype, "onLeave", null);
    __decorate([
        StateMachine.innerHide,
        __metadata("design:type", String),
        __metadata("design:paramtypes", [])
    ], StateMachine.prototype, "currentState", null);
    __decorate([
        StateMachine.innerHide,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Boolean)
    ], StateMachine.prototype, "is", null);
    __decorate([
        StateMachine.innerHide,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Boolean)
    ], StateMachine.prototype, "can", null);
    __decorate([
        StateMachine.innerHide,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Array)
    ], StateMachine.prototype, "transitions", null);
    return StateMachine;
}());
exports.StateMachine = StateMachine;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var State_1 = __webpack_require__(7);
exports.StateDecorator = State_1.StateDecorator;
var StateMachine_1 = __webpack_require__(8);
exports.StateMachineDecorator = StateMachine_1.StateMachineDecorator;
var Initial_1 = __webpack_require__(6);
exports.Initial = Initial_1.Initial;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var merge_1 = __webpack_require__(1);
/**
 * Store for inner meta-information for concrete StateMachine.
 * All methods and properties of this class used only in parent StateMachine class
 * and no one child statemachine dosnt have access to it
 */
var StateMachineInnerStore = (function () {
    function StateMachineInnerStore() {
        /**
         * @description name of current state
         */
        this.currentState = 'initial';
        /**
         * @description Store initial state
         */
        this.$initialState = {};
        /**
         * @description - key-value-store for onEnter callbacks
         * key - state name, value - array with callbacks
         */
        this.onEnterCbs = {};
        /**
         * @description - key-value-store for onLeave callbacks
         * key - state name, value - array with callbacks
         */
        this.onLeaveCbs = {};
    }
    /**
     * @description store initial value of property to $initialState
     */
    StateMachineInnerStore.prototype.rememberInitialKey = function (key, value) {
        // Here is important to break links with statemachine properties.
        // If value wasn`t primitive type - they save by link
        // And if we change them - initialState change too.
        var assignable = {};
        assignable[key] = value;
        merge_1.merge(this.$initialState, assignable);
        // Object.assign(this.$initialState, assignable);  // Here initial state become as mutable! We have test for it
    };
    Object.defineProperty(StateMachineInnerStore.prototype, "initialState", {
        get: function () {
            return this.$initialState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateMachineInnerStore.prototype, "isInitialState", {
        get: function () {
            return this.currentState === 'initial';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @description register onEnter callback, return function for drop callback
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
     * @description register onLeave callback, return function for drop callback
     */
    StateMachineInnerStore.prototype.registerLeaveCallback = function (stateName, cb) {
        if (!this.onLeaveCbs[stateName]) {
            this.onLeaveCbs[stateName] = [];
        }
        var stateLeaveCbs = this.onLeaveCbs[stateName];
        stateLeaveCbs.push(cb);
        return function () { return stateLeaveCbs.splice(stateLeaveCbs.indexOf(cb), 1); };
    };
    StateMachineInnerStore.prototype.callEnterCbs = function (stateName, args) {
        if (this.onEnterCbs[stateName]) {
            this.onEnterCbs[stateName].forEach(function (cb) { return cb.apply(void 0, args); });
        }
    };
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var StatesStore = (function () {
    function StatesStore() {
        /**
         * Store states info by name
         */
        this.store = {};
    }
    StatesStore.prototype.addState = function (stateName, parentState, to) {
        this.store[stateName] = {
            parentState: parentState,
            to: Array.isArray(to) ? to : [to]
        };
    };
    StatesStore.prototype.getState = function (stateName) {
        return this.store[stateName];
    };
    return StatesStore;
}());
exports.StatesStore = StatesStore;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var StateMachineStore_1 = __webpack_require__(0);
function Initial(target, propertyKey) {
    StateMachineStore_1.StateMachineStore.defineInitialKey(target, propertyKey);
}
exports.Initial = Initial;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var StateMachineStore_1 = __webpack_require__(0);
function StateDecorator(parentState, to) {
    if (to === void 0) { to = []; }
    return function (target, stateName) {
        StateMachineStore_1.StateMachineStore.defineState(target, stateName, parentState, to);
    };
}
exports.StateDecorator = StateDecorator;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var StateMachineStore_1 = __webpack_require__(0);
function StateMachineDecorator($next) {
    if ($next === void 0) { $next = []; }
    return function (target) {
        // tslint:disable-next-line
        // common code для переопределения конструктора
        var originalConstructor = target;
        function construct(constructor, args) {
            // tslint:disable-next-line
            var c = function () {
                // tslint:disable-next-line
                return constructor.apply(this, args);
            };
            c.prototype = constructor.prototype;
            return new c();
        }
        // tslint:disable-next-line
        var newConstructor = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var newInstance = construct(originalConstructor, args);
            var initialKeys = StateMachineStore_1.StateMachineStore.getInitialKeysForMachine(target.prototype);
            for (var _a = 0, initialKeys_1 = initialKeys; _a < initialKeys_1.length; _a++) {
                var key = initialKeys_1[_a];
                if (key !== 'constructor') {
                    newInstance.$store.rememberInitialKey(key, newInstance[key]);
                }
            }
            newInstance.$next = $next;
            return newInstance;
        };
        newConstructor.prototype = originalConstructor.prototype;
        return newConstructor;
    };
}
exports.StateMachineDecorator = StateMachineDecorator;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var StateMachine_1 = __webpack_require__(2);
exports.StateMachine = StateMachine_1.StateMachine;
var decorators_1 = __webpack_require__(3);
exports.Initial = decorators_1.Initial;
exports.StateDecorator = decorators_1.StateDecorator;
exports.StateMachineDecorator = decorators_1.StateMachineDecorator;


/***/ })
/******/ ]);
});