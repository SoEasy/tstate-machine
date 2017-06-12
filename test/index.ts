import { expect } from 'chai';

import {TestStateMachine} from './TestStateMachine';

const initialState = {
    loading: false,
    title: '',
    step: -1,
    button: {
        visible: false,
        title: 'Save',
        image: {
            src: null,
            width: null,
            height: null
        }
    }
};

describe('StateMachine', () => {
    it('should make initial state', () => {
        const sm: TestStateMachine = new TestStateMachine();
        expect(sm).to.deep.include(initialState);
    });
});