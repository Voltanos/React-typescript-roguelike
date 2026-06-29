import {
    InstructionStateManager,
    WorldStateManager,
    CameraStateManager
} from "../StateManagers/index";

export interface StateManagerDto {
    managers: {
        instructionStateManager: InstructionStateManager,
        cameraStateManager: CameraStateManager,
        worldStateManager: WorldStateManager
    }
};