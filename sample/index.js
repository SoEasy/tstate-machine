import { StateMachine } from 'tstate-machine';

class ConcreteMachine extends StateMachine {
    @StateMachine.extend(StateMachine.INITIAL)
    get loadingState() {
        return {loading: true};
    };

    @StateMachine.hide()
    get $next() {
        return ['loadingState'];
    }

    constructor() {
        super();
        this.loading = false;
        this.rememberInitState();
    }
}

const m = new ConcreteMachine();
m.transitTo('loadingState');
console.log('Machine', m);