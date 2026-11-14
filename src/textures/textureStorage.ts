import type {MazeCellType} from "../model/MazeCell.ts";
import type {Pixel} from "../ui/Pixel.ts";

export const TEXTURE_SIZE = 64

export const prepareTexture = async (type: MazeCellType) => {

    const url = `public/textures/${type}.png`
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
    type: MazeCellType,
    width: number,
    x: number,
    y: number
): Pixel | undefined => {
    const pixels = storage.get(type)
    if (!pixels) {
        return undefined
    }

    const index = (y * width + x) * 4
    return {
        red: pixels.data[index],
        green: pixels.data[index + 1],
        blue: pixels.data[index + 2]
    }
}

const storage: Map<MazeCellType, ImageData> = new Map()
