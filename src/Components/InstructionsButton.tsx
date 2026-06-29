import { type StateManagerDto } from "../DTOs/StateManagerDto";
import { Button } from "react-bootstrap";

export function InstructionsButton(stateManagerDto: StateManagerDto) {
    return (
        <Button
            style={{float: 'right'}}
            onClick={() => stateManagerDto.managers.instructionStateManager.showInstructions()}>
                Instructions
            </Button>
    )
}