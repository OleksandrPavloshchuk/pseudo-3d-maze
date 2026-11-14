import {Player} from "../model/Player"
import {Intersection} from "../model/IntersectionsDetector"

function drawViewAngle(
    context: CanvasRenderingContext2D,
    player: Player,
    intersections: Intersection[],
    mapScale: number
) {

    context.beginPath();
    for (let a = -player.viewAngleHalfWidth; a <= player.viewAngleHalfWidth; a += player.viewAngleStep) {
        drawRay(context, a, player, intersections, mapScale)
    }
    context.strokeStyle = "#F0F8F0";
    context.lineWidth = 1;
    context.stroke();
}

const drawRay = (
    context: CanvasRenderingContext2D,
    a: number,
    player: Player,
    intersections: Intersection[],
    mapScale: number
) => {
    context.moveTo(player.position.x / mapScale, player.position.y / mapScale);
    const p = intersections.find(i => i.a === a)!.point
    context.lineTo(p.x / mapScale, p.y / mapScale)
}

function drawPoint(context: CanvasRenderingContext2D, player: Player, mapScale: number) {
    context.fillStyle = "red"
    context.fillRect(player.position.x / mapScale - 1, player.position.y / mapScale - 1, 2, 2)
}

export const drawPlayer = (
    context: CanvasRenderingContext2D,
    player: Player,
    intersections: Intersection[],
    mapScale: number
) => {
    drawViewAngle(context, player, intersections, mapScale);
    drawPoint(context, player, mapScale);
}