import {MazeCellType} from "../model/MazeCell";

export const getColor= (type: MazeCellType)=> {
    switch (type) {
        case "wall":
            return "#BBFFCC"
        case "picture":
            return "#CC80CC"
        case "exitDoor":
            return "#99CC66"
        default:
            return "#B0D8FF"
    }
}

export type Pixel = {
    red: number, green: number, blue: number
}

export const setPixel = (
    pixels: ImageDataArray,
    width: number,
    x: number,
    y: number,
    pixel: Pixel
) => {
    const index = (y * width + x) * 4

    pixels[index] = pixel.red
    pixels[index + 1] = pixel.green
    pixels[index + 2] = pixel.blue
    pixels[index + 3] = 255    // opacity
}

export const FLOOR_PIXEL = {
    red: 204,
    green: 204,
    blue: 204
}

export const CEILING_PIXEL = {
    red: 153,
    green: 204,
    blue: 255
}