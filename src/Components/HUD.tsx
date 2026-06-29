import { type StateManagerDto } from "../DTOs/index";
import { EndGameModal } from './EndGameModal';
import { InstructionsButton } from './InstructionsButton';
import { StatusBar } from './StatusBar';
import { TileInfo } from './TileInfo';
import { Modal } from 'react-bootstrap';

export function HUD(stateManagerDto: StateManagerDto) {
    const cameraState = stateManagerDto.managers.cameraStateManager.state;
    const instructionState = stateManagerDto.managers.instructionStateManager.state;

    const style = {
        height: cameraState.top * cameraState.tileSize
    };

    function handleOnHide() {
        stateManagerDto.managers.instructionStateManager.hideInstructions();
    }

    return (
        <div style={style}>
            <Modal
                show={instructionState.isShown}
                onHide={handleOnHide}>
                    
                    <Modal.Header closeButton>
                        <Modal.Title>Instructions</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        Use the arrow keys or 'WASD' to move. Move against enemies to attack. Collect green health pickups and weapons. Kill the boss on the 3rd level to win.
                    </Modal.Body>

            </Modal>

            <EndGameModal managers = { stateManagerDto.managers } />
            <h3 style={{textAlign: 'center'}}>React/TypeScript Roguelike</h3>

            <InstructionsButton managers = { stateManagerDto.managers } />
            <StatusBar managers = { stateManagerDto.managers } />
            <TileInfo managers = { stateManagerDto.managers } />
        </div>
    );
}