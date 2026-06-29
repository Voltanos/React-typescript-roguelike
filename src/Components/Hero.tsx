import { type HeroDto } from '../DTOs/index';

export function Hero(heroDto: HeroDto) {
    const dto = heroDto.dto;

    type DivStyle = {
        left: number,
        bottom: number,
        width: number,
        height: number,        
        color: string
    };

    const style: DivStyle = {
        left: (dto.position.x - dto.cameraX) * dto.tileSize,
        bottom: (dto.position.y - dto.cameraY) * dto.tileSize,
        width: dto.tileSize,
        height: dto.tileSize,
        color: 'white'
    };

    return (<div className="hero" style={style}>@</div>);
}