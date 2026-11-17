import {CEILING_PIXEL, FLOOR_PIXEL, Pixel, setPixel} from "./Pixel"
import {getPixelFromTexture, TEXTURE_SIZE} from "../textures/textureStorage";
import {Intersection} from "../model/Point";
import {RayIntersections} from "../model/IntersectionsDetector";

const K = 25_000

export const createFpvImageData = (
    context: CanvasRenderingContext2D,
    imageWidth: number,
    imageHeight: number,
    intersections: RayIntersections[]
) => {
    const imageData = context.createImageData(imageWidth, imageHeight)
    for (let x = 0; x < imageWidth; x++) {
        const index = Math.floor(x * intersections.length / imageWidth)
        drawVerticalLine(imageData, x, imageWidth, imageHeight, intersections[index])
    }
    context.putImageData(imageData, 0, 0)
}

const drawVerticalLine = (
    imageData: ImageData,
    x: number,
    width: number,
    height: number,
    intersection: RayIntersections
) => {
    const data = imageData.data

    const wallIntersection = intersection.wall

    const lineHeight = K / wallIntersection.distance!

    const wallTop = Math.floor((height - lineHeight) / 2)
    const wallBottom = Math.floor((height + lineHeight) / 2)

    for (let y = 0; y < height; y++) {
        setPixel(data, width, x, y, getPixel(y, wallTop, wallBottom, lineHeight, wallIntersection))
    }
}

const getPixel = (
    y: number,
    wallTop: number,
    wallBottom: number,
    lineHeight: number,
    intersection: Intersection
): Pixel => {
    if (y < wallTop) {
        return CEILING_PIXEL
    }
    if (y >= wallBottom) {
        return FLOOR_PIXEL
    }
    return getWallPixel(y, lineHeight, wallTop, intersection)
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

    return getPixelFromTexture(intersection.cell!.type, intersection.getTextureX(), textureY)

}