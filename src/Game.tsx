import { useEffect } from 'react';
import {
    useInstructionStateManager,
    useCameraStateManager,
    useWorldStateManager,
    useInputDirectionStateManager
} from './StateManagers/index';
import { HERO_SPEED } from './World'
import { GameDisplay } from './Components/GameDisplay';

let handleInputTimer: number = 0;

export function Game() {
    const instructionStateManager = useInstructionStateManager();
    const cameraStateManager = useCameraStateManager();
    const worldStateManager = useWorldStateManager();
    const inputDirectionStateManager = useInputDirectionStateManager();

    if (worldStateManager.state.levels.length === 0) {
        worldStateManager.initialize();
        cameraStateManager.Resize();
        instructionStateManager.showInstructions();
    }

    function onKeyDown(event: KeyboardEvent) {
        inputDirectionStateManager.onKeyDown(event.key.toLowerCase(), worldStateManager);

        handleInputTimer = setInterval(() => {
                onKeyUp();
            },
            (1000 / HERO_SPEED)
        );
    }

    function onKeyUp() {
        inputDirectionStateManager.onKeyUp();
        clearInterval(handleInputTimer);
    }

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        }
    });

    return (
    <>
    <GameDisplay
        managers = {{
                instructionStateManager: instructionStateManager,
                cameraStateManager: cameraStateManager,
                worldStateManager: worldStateManager
            }} />
    </>
    )
}