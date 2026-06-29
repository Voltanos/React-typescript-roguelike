import {
    Container,
    Row
} from "react-bootstrap";
import { type StateManagerDto } from "../DTOs/StateManagerDto";
import { HUD } from "./HUD";
import { Map } from "./Map";

export function GameDisplay(stateManagerDto: StateManagerDto) {
    return (
        <div>
            <Container>
                <Row style={{ paddingBottom: 50 }}>
                    <HUD managers = { stateManagerDto.managers } />
                </Row>
                <Row style={{ paddingTop: 50, display: 'flex', justifyContent: 'center' }}>
                    <Map managers = { stateManagerDto.managers } />
                </Row>
            </Container>            
        </div>
    );
}