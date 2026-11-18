import {CEILING_PIXEL, FLOOR_PIXEL, Pixel, setPixel} from "./Pixel"
import {getPixelFromTexture, TEXTURE_SIZE} from "../textures/textureStorage";
import {Intersection, Point} from "../model/Point";
import {RayIntersections} from "../model/IntersectionsDetector";

const K = 25_000

export const createFpvImageData = (
    context: CanvasRenderingContext2D,
    imageWidth: number,
    imageHeight: number,
    intersections: RayIntersections[],
    playerPosition: Point
) => {
    const imageData = context.createImageData(imageWidth, imageHeight)

    for (let x = 0; x < imageWidth; x++) {
        const index = Math.floor(x * intersections.length / imageWidth)
        drawVerticalLine(
            imageData,
            x,
            imageWidth,
            imageHeight,
            intersections[index],
            playerPosition
        )
    }

    context.putImageData(imageData, 0, 0)
}

const drawVerticalLine = (
    imageData: ImageData,
    x: number,
    width: number,
    height: number,
    intersection: RayIntersections,
    playerPosition: Point
) => {
    const data = imageData.data

    const wallIntersection = intersection.wall

    const lineHeight = K / wallIntersection.distance!

    const wallTop = Math.floor((height - lineHeight) / 2)
    const wallBottom = Math.floor((height + lineHeight) / 2)

    for (let y = 0; y < height; y++) {
        setPixel(
            data,
            width,
            x,
            y,
            getPixel(
                y,
                wallTop,
                wallBottom,
                lineHeight,
                wallIntersection,
                height,
                playerPosition
            )
        )
    }
}

const getPixel = (
    y: number,
    wallTop: number,
    wallBottom: number,
    lineHeight: number,
    intersection: Intersection,
    height: number,
    playerPosition: Point
): Pixel => {
    if (y < wallTop) {
        return CEILING_PIXEL
    }

    if (y >= wallBottom) {
        return getFloorPixel(y, height, intersection, playerPosition)
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

const getFloorPixel = (
    y: number,
    height: number,
    intersection: Intersection,
    playerPosition: Point
): Pixel => {
    const distance = K / (2 * (y + 0.5 - height / 2))

    const worldX = playerPosition.x + distance * intersection.dx!
    const worldY = playerPosition.y + distance * intersection.dy!

    const textureX = ((worldX % TEXTURE_SIZE) + TEXTURE_SIZE) % TEXTURE_SIZE
    const textureY = ((worldY % TEXTURE_SIZE) + TEXTURE_SIZE) % TEXTURE_SIZE

    return getPixelFromTexture("floor", Math.floor(textureX), Math.floor(textureY))
}