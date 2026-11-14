import {CEILING_PIXEL, FLOOR_PIXEL, setPixel} from "./Pixel"
import {getPixelFromTexture, TEXTURE_SIZE} from "../textures/textureStorage";
import {Intersection} from "../model/Point";

const K = 25_000

export const createFpvImageData = (
    context: CanvasRenderingContext2D,
    imageWidth: number,
    imageHeight: number,
    intersections: Intersection[]
) => {
    const imageData = context.createImageData(imageWidth, imageHeight)
    for (let x = 0; x < imageWidth; x++) {
        const index = Math.floor(x * intersections.length / imageWidth)

        drawVerticalLine(
            imageData,
            x,
            imageWidth,
            imageHeight,
            intersections[index]
        )
    }
    context.putImageData(imageData, 0, 0)
}

const drawVerticalLine = (
    imageData: ImageData,
    x: number,
    width: number,
    height: number,
    intersection: Intersection
) => {
    const data = imageData.data

    const lineHeight = K / intersection.distance!

    const wallTop = Math.floor((height - lineHeight) / 2)
    const wallBottom = Math.floor((height + lineHeight) / 2)

    for (let y = 0; y < height; y++) {
        let pixel

        if (y < wallTop) {
            pixel = CEILING_PIXEL
        } else if (y >= wallBottom) {
            pixel = FLOOR_PIXEL
        } else {
            pixel = getWallPixel(y, lineHeight, wallTop, intersection)
        }
        setPixel(data, width, x, y, pixel!)
    }
}

const getWallPixel = (
    y: number,
    lineHeight: number,
    wallTop: number,
    intersection: Intersection
) => {
    const textureY = Math.min(
        TEXTURE_SIZE - 1,
        Math.floor((y - wallTop) * TEXTURE_SIZE / lineHeight)
    )

    const offset = intersection.edge === "horizontal" ? intersection.point.x : intersection.point.y

    const cell = intersection.cell!

    const edgeStart = intersection.edge === "horizontal"
        ? cell.center.x - cell.cellSize / 2
        : cell.center.y - cell.cellSize / 2

    const textureX = Math.floor(
        (offset - edgeStart) / cell.cellSize * TEXTURE_SIZE
    )

    return getPixelFromTexture(intersection.cell!.type, TEXTURE_SIZE, textureX, textureY)

}