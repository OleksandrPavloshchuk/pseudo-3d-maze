import {Intersection} from "../model/IntersectionsDetector";

export const drawIntersections = (
    context: CanvasRenderingContext2D,
    intersections: Intersection[]
) => {
    const size = 2

    for(let i of intersections) {
        context.fillStyle = "red"
        context.fillRect( i.point.x - size/2, i.point.y - size/2, size, size)
    }

}