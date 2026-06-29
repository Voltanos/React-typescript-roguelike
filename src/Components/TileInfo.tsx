import { type StateManagerDto } from "../DTOs/StateManagerDto";

export function TileInfo(stateManagerDto: StateManagerDto) {
    return (<span>{stateManagerDto.managers.worldStateManager.state.hud.tileInfo}</span>);
}