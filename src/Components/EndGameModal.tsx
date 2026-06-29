import { Modal } from 'react-bootstrap';
import { type StateManagerDto } from "../DTOs/StateManagerDto";

export function EndGameModal(stateManagerDto: StateManagerDto) {
    let title: string;
    let body: string;
    let color: string;
    
    if (stateManagerDto.managers.worldStateManager.state.win) {
        title = 'You Win!';
        body = 'Another go?';
        color = '#5cb85c';
    }

    else {
        title = 'You Died!';
        body = 'Better luck next time!';
        color = '#d9534f';
    }

    return (
        <Modal
            show={stateManagerDto.managers.worldStateManager.state.showEndGameModal}
            onHide={() => stateManagerDto.managers.worldStateManager.hideEndGame()}>
            
            <Modal.Header style={{backgroundColor: color }}>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>{body}</Modal.Body>
        </Modal>
    )
}