import type {Pixel} from "../ui/Pixel.ts";
import {MazeCellType} from "../model/MazeCell";

export const TEXTURE_SIZE = 64

export type HorizontalTexture = "floor" | "ceiling"

export type TextureType = HorizontalTexture | MazeCellType

export const prepareTexture = async (
    type: TextureType

) => {

    const url = `/textures/${type}.png`
    const image = new Image()
    image.src = url

    await image.decode()

    const canvas = document.createElement("canvas")
    canvas.width = image.width
    canvas.height = image.height

    const context = canvas.getContext("2d")!
    context.drawImage(image, 0, 0)

    storage.set(type, context.getImageData(0, 0, image.width, image.height))
}

export const getPixelFromTexture = (
    type: TextureType,
    x: number,
    y: number
): Pixel => {
    const pixels = storage.get(type)
    if (!pixels) {
        return NO_TEXTURE
    }

    const index = (y * TEXTURE_SIZE + x) * 4
    return {
        red: pixels.data[index],
        green: pixels.data[index + 1],
        blue: pixels.data[index + 2]
    }
}

const storage: Map<TextureType, ImageData> = new Map()
const NO_TEXTURE = {red: 0, green: 0, blue: 0}
