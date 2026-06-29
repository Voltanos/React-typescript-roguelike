import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { type StateManagerDto } from "../DTOs/StateManagerDto";

export function StatusBar(stateManagerDto: StateManagerDto) {
    const worldState = stateManagerDto.managers.worldStateManager.state;
    const heroState = stateManagerDto.managers.worldStateManager.state.hero;

    const playerHp: number = heroState.health;
    const playerMaxHp: number = heroState.maxHealth;
    const playerLevel: number = heroState.level + 1;
    const playerXp: number = heroState.xp;
    const playerXpToNext: number = heroState.xpToNext;
    const minDamage: number = heroState.weaponDamage.min;
    const maxDamage: number = heroState.weaponDamage.max;
    const weaponName: string = heroState.weapon.name;
    const dungeonLevel: number = worldState.activeLevel + 1;
       
    const healthRatio = (playerHp / playerMaxHp);
    const healthBarColor = ( healthRatio >= 0.5 ) ?
        'green' :
        (healthRatio >= 0.25) ?
        'yellow' :
        'red';

    return (
        <Container>
            <Row>
                <Col xs={1}>HP:</Col>
                <Col>
                    <span style={{ color: healthBarColor }}>{`${playerHp} / ${playerMaxHp}`}</span>
                </Col>
                <Col xs={2}>Weapon (Dmg):</Col>
                <Col>{weaponName} ({minDamage} - {maxDamage})</Col>
            </Row>

            <Row>
                <Col xs={1}>XP:</Col>
                <Col>
                    <span>{`lv.${playerLevel} ${playerXp}/${playerXpToNext}`}</span>
                </Col>
                <Col xs={2}>Dungeon Level:</Col>
                <Col>{dungeonLevel}</Col>
            </Row>
        </Container>
    );
}