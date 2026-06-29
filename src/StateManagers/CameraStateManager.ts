import { useReducer } from "react";

const TILE_SIZE: number = 25;

export interface CameraState {
    tileSize: number,
    top: number,
    width: number,
    height: number
};

const CAMERA_INITIAL_STATE: CameraState = {
    tileSize: TILE_SIZE,
    top: 0,
    width: 0,
    height: 0
};

type CameraAction =
    { type: 'RESIZE' };

function cameraReducer(state: CameraState = CAMERA_INITIAL_STATE, action: CameraAction) {
    switch (action.type) {
        case 'RESIZE': {
            return Object.assign({}, state, {
                tileSize: TILE_SIZE,
                top: 1,
                width: 20,
                height: 20
            });
        }

        default:
            return state;
    }
}

export class CameraStateManager {
    #state: CameraState;
    #dispatch: React.ActionDispatch<[CameraAction]>;

    constructor(
        state: CameraState,
        dispatch: React.ActionDispatch<[CameraAction]>
    ) {
        this.#state = state
        this.#dispatch = dispatch;
    }

    public get state(): CameraState {
        return this.#state;
    }

    public Resize() {
        this.#dispatch({ type: 'RESIZE' });
    }
}

export function useCameraStateManager(): CameraStateManager {
    const [state, dispatch] = useReducer(cameraReducer, CAMERA_INITIAL_STATE);
    const manager: CameraStateManager = new CameraStateManager(state, dispatch);
    return manager;
}