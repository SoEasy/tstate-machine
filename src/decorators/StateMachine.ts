import { StateMachineStore } from '../StateMachineStore';

export function StateMachineDecorator($next: Array<string> = []): any {
  return (target: any): any => {
    // tslint:disable-next-line
    // common code для переопределения конструктора
    const originalConstructor = target;

    function construct(constructor: any, args: Array<any>): any {
      // tslint:disable-next-line
      const c: any = function () {
        // tslint:disable-next-line
        return constructor.apply(this, args);
      };

      c.prototype = constructor.prototype;
      return new c();
    }

    // tslint:disable-next-line
    const newConstructor = function (...args) {
      const newInstance = construct(originalConstructor, args);
      const initialKeys = StateMachineStore.getInitialKeysForMachine(target.prototype);

      for (const key of initialKeys) {
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
