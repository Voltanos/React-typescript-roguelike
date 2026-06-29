import { useReducer } from "react";

export interface InstructionState {
    isShown: boolean
};

export const INSTRUCTIONS_INITIAL_STATE: InstructionState = {
    isShown: false
};

type InstructionAction =
    | { type: 'SHOW_INSTRUCTIONS' }
    | { type: 'HIDE_INSTRUCTIONS' };

function instructionsReducer(state: InstructionState = INSTRUCTIONS_INITIAL_STATE, action: InstructionAction) {
    switch (action.type) {
        case 'SHOW_INSTRUCTIONS': {
            return Object.assign({}, state, { isShown: true });
        }

        case 'HIDE_INSTRUCTIONS': {
            return Object.assign({}, state, { isShown: false });
        }

        default: {
            return state;
        }
    }
}

export class InstructionStateManager {
    #state: InstructionState;
    #dispatch: React.ActionDispatch<[InstructionAction]>;

    constructor(
        state: InstructionState,
        dispatch: React.ActionDispatch<[InstructionAction]>
    ) {
        this.#state = state;
        this.#dispatch = dispatch;
    }

    public get state(): InstructionState {
        return this.#state;
    }

    public showInstructions() {
        this.#dispatch({ type: 'SHOW_INSTRUCTIONS' });
    }

    public hideInstructions() {
        this.#dispatch({ type: 'HIDE_INSTRUCTIONS' });
    }
}

export function useInstructionStateManager(): InstructionStateManager {
    const [state, dispatch] = useReducer(instructionsReducer, INSTRUCTIONS_INITIAL_STATE);
    const manager: InstructionStateManager = new InstructionStateManager(state, dispatch);
    return manager;
}