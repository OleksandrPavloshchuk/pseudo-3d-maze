import {CEILING_PIXEL, FLOOR_PIXEL, getPixel, setPixel} from "./utils"
import {getPixelFromTexture, TEXTURE_SIZE} from "../textures/textureStorage";
import {Intersection} from "../model/Point";

const K = 10_000

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

    const halfLineHeight = height / 2

    const wallTop = Math.floor(height / 2 - halfLineHeight)
    const wallBottom = Math.floor(height / 2 + halfLineHeight)

    const lineHeight = wallBottom - wallTop

    /*
    const lineHeight = K / intersection.distance
    for (let y = 0; y < height; y++) {
        let pixel
        if (y < height / 2 - lineHeight) {
            // floor
            pixel = getPixel("empty")
        } else if (y > height / 2 + lineHeight) {
            // ceiling
            pixel = CEILING_PIXEL
        } else {
            // wall
            pixel = getPixel(intersection.cell.type)
        }
        setPixel(data, width, x, y, pixel)
    }
*/

    for (let y = 0; y < height; y++) {
        let pixel

        if (y < wallTop) {
            pixel = FLOOR_PIXEL
        } else if (y >= wallBottom) {
            pixel = CEILING_PIXEL
        } else {
            const textureY = Math.min(
                TEXTURE_SIZE - 1,
                Math.floor((y - wallTop) * TEXTURE_SIZE / lineHeight)
            )

            const offset = intersection.edge === "horizontal" ? intersection.point.x : intersection.point.y

            const textureX = Math.floor((offset % 1) * TEXTURE_SIZE)

            pixel = getPixelFromTexture(intersection.cell!.type, width, textureX, textureY)
            if (pixel) {
                setPixel(data, width, x, y, pixel)
            }
        }

    }
}