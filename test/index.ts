import { expect } from 'chai';
import { StateMachine } from '../src/StateMachine';
import 'reflect-metadata';
import { IStateDeclaration } from '../src/StateDeclaration';

type MachineState = IStateDeclaration<Machine>;

class Machine extends StateMachine {
    text: string = 'do';
    alert: Record<string, any> = {
        text: 'alert',
        visible: false
    };

    @StateMachine.extend(StateMachine.INITIAL, ['requestState'])
    mainState: MachineState = {};

    @StateMachine.extend('mainState', ['successState', 'errorState'])
    requestState: MachineState = {
        text: 'request'
    };

    // Base state for extending only
    @StateMachine.extend('mainState', [])
    doneState: MachineState = {
        text: 'done',
        alert: {
            visible: true
        }
    };

    @StateMachine.extend('doneState', ['mainState'])
    successState: MachineState = {
        alert: {
            text: 'success',
        }
    };

    @StateMachine.extend('doneState', ['mainState'])
    errorState: MachineState = {
        alert: {
            text: 'error',
        }
    };

    @StateMachine.hide
    protected get $next(): Array<string> {
        return ['mainState'];
    }

    constructor() {
        super();
        this.rememberInitState();
    }
}

function expectIsInitial(machine: Machine): void {
    // TODO
    // Actually I don`t know why expect(machine).to.include(...) not work
    // to have property 'alert' of { text: 'alert', visible: false }, but got { text: 'alert', visible: false }
    expect(machine.text).to.be.equal('do');
    expect(machine.alert).to.be.eql({
        text: 'alert',
        visible: false
    });
}

describe('tstatemachine', () => {
    it('initial state is immutable', () => {
        const machine = new Machine();
        machine.transitTo('mainState');
        machine.transitTo('requestState');
        machine.transitTo('successState');
        machine.transitTo('mainState');
        machine.transitTo('requestState');

        expect(machine.alert).to.deep.equal({
            text: 'alert',
            visible: false
        });
    });

    it('must be in initial state after creation', () => {
        const machine = new Machine();
        expectIsInitial(machine);
    });

    it('must correctly transit to next state', () => {
        const machine = new Machine();
        machine.transitTo('mainState');
        machine.transitTo('requestState');
        expect(machine.text).to.be.eq('request');
    });

    it('must not transit to incorrect state from initial', () => {
        const machine = new Machine();
        // Correct transition
        machine.transitTo('mainState');
        // Incorrect transition
        machine.transitTo('successState');

        expectIsInitial(machine);
    });

    it('must not transit to incorrect state', () => {
        const machine = new Machine();
        // Correct transitions
        machine.transitTo('mainState');
        machine.transitTo('requestState');
        // Incorrect state
        machine.transitTo('mainState');

        expect(machine.text).to.be.equal('request');
        expect(machine.alert).to.be.eql({
            text: 'alert',
            visible: false
        });
    });

    it('must not transit to unregistered state from initial', () => {
        const machine = new Machine();
        machine.transitTo('foobar');
        expectIsInitial(machine);
    });

    it('must not transit to incorrect state from initial', () => {
        const machine = new Machine();
        machine.transitTo('requestState');
        expectIsInitial(machine);
    });

    it('must correct extend state', () => {
        const machine = new Machine();
        machine.transitTo('mainState');
        machine.transitTo('requestState');
        machine.transitTo('successState');

        expect(machine.text).to.be.equal('done');
        expect(machine.alert).to.be.eql({
            text: 'success',
            visible: true
        });
    });

    it('currentState correct', () => {
        const machine = new Machine();
        expect(machine.currentState).to.be.eq('initial');
        machine.transitTo('mainState');
        expect(machine.currentState).to.be.eq('mainState');
    });

    it('.is() correct', () => {
        const machine = new Machine();
        expect(machine.is('initial')).to.be.true;
        machine.transitTo('mainState');
        expect(machine.is('mainState')).to.be.true;
    });

    it('.can() correct', () => {
        const machine = new Machine();
        expect(machine.can('mainState')).to.be.true;
        expect(machine.can('requestState')).to.be.false;
        machine.transitTo('mainState');
        expect(machine.can('requestState')).to.be.true;
        expect(machine.can('successState')).to.be.false;
    });

    it('.transitions() correct', () => {
        const machine = new Machine();
        expect(machine.transitions()).to.be.eql(['mainState']);
        machine.transitTo('mainState');
        expect(machine.transitions()).to.be.eql(['requestState']);
        machine.transitTo('requestState');
        expect(machine.transitions()).to.be.eql(['successState', 'errorState']);
    });

    it('.onEnter() register correct', () => {
        const machine = new Machine();
        let a = 1;
        machine.onEnter('mainState', () => { a += 1; });
        machine.transitTo('mainState');
        expect(a).to.be.eq(2);
    });

    it('.onEnter(...args) register correct', () => {
        const machine = new Machine();
        let a = 1;
        machine.onEnter('mainState', (inc: number) => { a += inc; });
        machine.transitTo('mainState', 2);
        expect(a).to.be.eq(3);
    });

    it('.onLeave() register correct', () => {
        const machine = new Machine();
        let a = 1;
        machine.onLeave('mainState', () => { a += 1; });
        machine.transitTo('mainState');
        machine.transitTo('requestState');
        expect(a).to.be.eq(2);
    });

    it('.onEnter() unregister correct and dont touch another callbacks', () => {
        const machine = new Machine();
        let a = 1;
        let b = 1;
        const dropCb = machine.onEnter('mainState', () => { a += 1; });
        machine.onEnter('mainState', () => { b += 1; });
        dropCb();
        machine.transitTo('mainState');
        expect(a).to.be.eq(1);
        expect(b).to.be.eq(2);
    });

    it('.onLeave() unregister correct and dont touch another callbacks', () => {
        const machine = new Machine();
        let a = 1;
        let b = 1;
        const dropCb = machine.onLeave('mainState', () => { a += 1; });
        machine.onLeave('mainState', () => { b += 1; });
        dropCb();
        machine.transitTo('mainState');
        expect(a).to.be.eq(1);
        expect(b).to.be.eq(1);
        machine.transitTo('requestState');
        expect(a).to.be.eq(1);
        expect(b).to.be.eq(2);
    });
});
