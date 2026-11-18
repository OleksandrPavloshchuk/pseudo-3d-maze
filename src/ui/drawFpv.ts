import {CEILING_PIXEL, Pixel, setPixel} from "./Pixel"
import {getPixelFromTexture, TEXTURE_SIZE} from "../textures/textureStorage";
import {Intersection, Point} from "../model/Point";

const K = 25_000

export const createFpvImageData = (
    context: CanvasRenderingContext2D,
    imageWidth: number,
    imageHeight: number,
    intersections: Intersection[],
    playerPosition: Point
) => {
    new FpvRenderer(context, imageWidth, imageHeight, intersections, playerPosition).render()
}

class FpvRenderer {

    private readonly imageData: ImageData

    constructor(
        private context: CanvasRenderingContext2D,
        private readonly imageWidth: number,
        private readonly imageHeight: number,
        private readonly intersections: Intersection[],
        private readonly playerPosition: Point
    ) {
        this.imageData = context.createImageData(imageWidth, imageHeight)
    }

    render = () => {
        for (let x = 0; x < this.imageWidth; x++) {
            const index = Math.floor(x * this.intersections.length / this.imageWidth)
            this.drawVerticalLine(x, this.intersections[index])
        }

        this.context.putImageData(this.imageData, 0, 0)
    }

    drawVerticalLine = (
        x: number,
        intersection: Intersection,
    ) => {
        const data = this.imageData.data
        const lineHeight = K / intersection.distance!
        const wallTop = Math.floor((this.imageHeight - lineHeight) / 2)
        const wallBottom = Math.floor((this.imageHeight + lineHeight) / 2)

        for (let y = 0; y < this.imageHeight; y++) {
            const pixel = this.getPixel(y, wallTop, wallBottom, lineHeight, intersection)
            setPixel(data, this.imageWidth, x, y, pixel)
        }
    }

    getPixel = (
        y: number,
        wallTop: number,
        wallBottom: number,
        lineHeight: number,
        intersection: Intersection
    ): Pixel => {
        if (y < wallTop) {
            return CEILING_PIXEL
        } else if (y >= wallBottom) {
            return this.getFloorPixel(y, intersection)
        } else {
            return this.getWallPixel(y, lineHeight, wallTop, intersection)
        }
    }

    getWallPixel = (
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

    getFloorPixel = (
        y: number,
        intersection: Intersection,
    ): Pixel => {
        // 0.5 - we use center of pixel
        const distance = K / (2 * (y + 0.5 - this.imageHeight / 2))

        const worldX = this.playerPosition.x + distance * intersection.dx!
        const worldY = this.playerPosition.y + distance * intersection.dy!

        return getPixelFromTexture("floor", this.toTexture(worldX), this.toTexture(worldY))
    }

    toTexture = (n: number) =>
        Math.floor(((n % TEXTURE_SIZE) + TEXTURE_SIZE) % TEXTURE_SIZE)

}