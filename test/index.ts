import { expect } from 'chai';
import { StateMachine } from '../src/StateMachine';
import 'reflect-metadata';

describe('tstatemachine', () => {
    class Machine extends StateMachine {

    }

    it('dumb', () => {
        const machine = new Machine();
        expect(machine).to.be.not.null;
    });
    it('initial state is immutable', () => {});
    it('must be in initial state after creation', () => {});
    it('must correctly transit to next state', () => {});
    it('must not transit to incorrect state', () => {});
    it('currentState correct', () => {});
    it('.is() correct', () => {});
    it('.can() correct', () => {});
    it('.transitions() correct', () => {});
    it('.onEnter(...args) register correct', () => {});
    it('.onLeave() register correct', () => {});
    it('.onEnter() unregister correct', () => {});
    it('.onLeave() unregister correct', () => {});
});
