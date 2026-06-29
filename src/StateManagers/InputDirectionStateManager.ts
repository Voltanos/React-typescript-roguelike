import { useReducer } from "react";
import { ZERO_POSITION, type PositionModel } from "../Models";
import { WorldStateManager } from "./WorldStateManager";

export interface InputDirectionState {
    up: boolean,
    down: boolean,
    left: boolean,
    right: boolean,
    isMoving: boolean
};

export const INPUT_DIRECTION_INITIAL_STATE: InputDirectionState = {
    up: false,
    down: false,
    left: false,
    right: false,
    isMoving: false
};

export const UP_DIRECTION_STATE: InputDirectionState = {
    ...INPUT_DIRECTION_INITIAL_STATE,
    up: true,
    isMoving: true
};

export const DOWN_DIRECTION_STATE: InputDirectionState = {
    ...INPUT_DIRECTION_INITIAL_STATE,
    down: true,
    isMoving: true
};

export const LEFT_DIRECTION_STATE: InputDirectionState = {
    ...INPUT_DIRECTION_INITIAL_STATE,
    left: true,
    isMoving: true
};

export const RIGHT_DIRECTION_STATE: InputDirectionState = {
    ...INPUT_DIRECTION_INITIAL_STATE,
    right: true,
    isMoving: true
};

type INPUTMAPTYPE = {
    [key: string]: InputDirectionState
}

const INPUT_MAP: INPUTMAPTYPE = {
    'arrowup': UP_DIRECTION_STATE,
    'arrowleft': LEFT_DIRECTION_STATE,
    'arrowright': RIGHT_DIRECTION_STATE,
    'arrowdown': DOWN_DIRECTION_STATE,
    'w': UP_DIRECTION_STATE,
    'a': LEFT_DIRECTION_STATE,
    'd': RIGHT_DIRECTION_STATE,
    's': DOWN_DIRECTION_STATE
};

type InputDirectionAction =
    | { type: 'KEY_DOWN', payload: { lowerCaseKey: string, worldStateManager: WorldStateManager } }
    | { type: 'KEY_UP' }
    | { type: 'HANDLE_INPUT', payload: { worldStateManager: WorldStateManager } };

function inputDirectionReducer(
    state: InputDirectionState = INPUT_DIRECTION_INITIAL_STATE,
    action: InputDirectionAction
): InputDirectionState {
    switch (action.type) {
        case 'KEY_DOWN': {
            state = addDirection(state, action.payload.lowerCaseKey, action.payload.worldStateManager);
            return state;
        }

        case 'KEY_UP': {
            return removeDirection();
        }

        case 'HANDLE_INPUT': {
            handleInput(state, action.payload.worldStateManager);
            return state;
        }

        default: {
            return state;
        }
    }
}

// Helper Methods
function removeDirection(): InputDirectionState {
    return INPUT_DIRECTION_INITIAL_STATE;
}

function addDirection(
    state: InputDirectionState,
    lowerCaseKey: string,
    worldStateManager: WorldStateManager
): InputDirectionState {
    const newDirection: InputDirectionState = INPUT_MAP[lowerCaseKey];

    if (newDirection !== undefined && !state.isMoving) {
        state = newDirection;
        handleInput(state, worldStateManager);
    }

    return state;
}

function handleInput(
    state: InputDirectionState,
    worldStateManager: WorldStateManager
) {
    const newPosition: PositionModel = Object.assign({}, ZERO_POSITION);

    if (state.up) {
        newPosition.y += 1;
    }

    if (state.down) {
        newPosition.y -= 1;
    }

    if (state.right) {
        newPosition.x += 1;
    }

    if (state.left) {
        newPosition.x -= 1;
    }

    if (newPosition !== ZERO_POSITION) {
        worldStateManager.interact(newPosition);
    }
}

export class InputDirectionStateManager {
    #state: InputDirectionState;
    #dispatch: React.ActionDispatch<[InputDirectionAction]>;

    constructor(
        state: InputDirectionState,
        dispatch: React.ActionDispatch<[InputDirectionAction]>
    ) {
        this.#state = state;
        this.#dispatch = dispatch;
    }

    public get state(): InputDirectionState {
        return this.#state;
    }

    public onKeyDown(lowerCaseKey: string, worldStateManager: WorldStateManager) {
        this.#dispatch({ type: 'KEY_DOWN', payload: { lowerCaseKey, worldStateManager } });
    }

    public onKeyUp() {
        this.#dispatch({ type: 'KEY_UP' });
    }

    public handleInput(worldStateManager: WorldStateManager) {
        this.#dispatch({ type: 'HANDLE_INPUT', payload: { worldStateManager } });
    }
}

export function useInputDirectionStateManager() {
    const [state, dispatch] = useReducer(inputDirectionReducer, INPUT_DIRECTION_INITIAL_STATE);
    const manager: InputDirectionStateManager = new InputDirectionStateManager(state, dispatch);
    return manager;
}