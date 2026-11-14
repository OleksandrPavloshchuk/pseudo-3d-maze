import {Intersection} from "../model/IntersectionsDetector"
import {CEILING_PIXEL, getPixel, setPixel} from "./utils"

const K = 10_000

export const createFpvImageData = (
    context: CanvasRenderingContext2D,
    imageWidth: number,
    imageHeight: number,
    intersections: Intersection[]
)=> {
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
    context.putImageData(imageData, 0 ,0)
}

const drawVerticalLine = (
    imageData: ImageData,
    x: number,
    width: number,
    height: number,
    intersection: Intersection
) => {
    const data = imageData.data

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
}