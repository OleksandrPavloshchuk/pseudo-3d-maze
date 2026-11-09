import {Player} from "../model/Player";
import {Intersection} from "../model/IntersectionsDetector";

function drawPointer(context: CanvasRenderingContext2D, player: Player, pointerSize: number) {
    const pointerX = player.position.x + pointerSize * Math.cos(player.viewAngleMiddle)
    const pointerY = player.position.y + pointerSize * Math.sin(player.viewAngleMiddle)

    context.beginPath();
    context.moveTo(player.position.x, player.position.y);
    context.lineTo(pointerX, pointerY);
    context.strokeStyle = "red";
    context.lineWidth = 2;
    context.stroke();
}

function drawViewAngle(context: CanvasRenderingContext2D, player: Player, intersections: Intersection[]) {

    context.beginPath();
    for (let a = -player.viewAngleHalfWidth; a <= player.viewAngleHalfWidth; a += player.viewAngleStep) {
        context.moveTo(player.position.x, player.position.y);

        const p = intersections.filter( i => i.a===a)![0].point

        context.lineTo(p.x, p.y)
    }
    context.strokeStyle = "azure";
    context.lineWidth = 1;
    context.stroke();
}

function drawCircle(context: CanvasRenderingContext2D, player: Player, playerSize: number) {
    context.beginPath()
    context.arc(player.position.x, player.position.y, playerSize, 0, 2 * Math.PI)
    context.fillStyle = "pink"
    context.fill();
}

export const drawPlayer = (
    context: CanvasRenderingContext2D,
    player: Player,
    intersections: Intersection[],
    playerSize: number,
    pointerSize: number
) => {
    drawViewAngle(context, player, intersections);
    drawPointer(context, player, pointerSize);
    drawCircle(context, player, playerSize);
}