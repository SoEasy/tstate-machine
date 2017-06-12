import { IStateDeclaration, StateMachine } from '../src';

export const STATES = {
    LOADING_STATE: 'loadingState',
    MAIN_STATE: 'mainState'
};

export class TestStateMachine extends StateMachine {
    loading: boolean = false;
    title: string = '';
    step: number = -1;
    button: any = {
        visible: false,
        title: 'Save',
        image: {
            src: null,
            width: null,
            height: null
        }
    };

    @StateMachine.extend(StateMachine.INITIAL, [STATES.MAIN_STATE])
    loadingState: IStateDeclaration = {
        loading: true
    };

    @StateMachine.hide()
    protected get $next(): Array<string> {
        return [STATES.LOADING_STATE];
    }

    constructor() {
        super();
        this.rememberInitState();
    }
}
