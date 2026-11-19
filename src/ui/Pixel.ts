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