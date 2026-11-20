import {Player} from "../model/Player"

function drawPoint(context: CanvasRenderingContext2D, player: Player, mapScale: number) {
    context.fillStyle = "red"
    context.fillRect(player.position.x / mapScale - 1, player.position.y / mapScale - 1, 2, 2)
}

export const drawPlayer = (
    context: CanvasRenderingContext2D,
    player: Player,
    mapScale: number
) => {
    drawPoint(context, player, mapScale);
}