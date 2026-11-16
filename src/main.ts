import {Maze} from "./model/Maze"
import {Player} from "./model/Player"
import {loadMaze} from "./loadMaze"
import {drawPlayer} from "./ui/drawPlayer"
import {drawMaze} from "./ui/drawMaze"
import {IntersectionsDetector} from "./model/IntersectionsDetector"
import {createFpvImageData} from "./ui/drawFpv"
import {prepareTexture, TEXTURE_SIZE} from "./textures/textureStorage";
import {Intersection} from "./model/Point";

const playerWallGap = 6

const mapScale = 8 // "8" means, that map scale is 1/8

const fpvWidth = 1024
const fpvHeight = 768

const mapCanvas = document.getElementById("maze-map-canvas") as HTMLCanvasElement
let mapContext: CanvasRenderingContext2D | null = null

const fpvCanvas = document.getElementById("maze-pov-canvas") as HTMLCanvasElement
let fpvContext: CanvasRenderingContext2D | null = null

let maze: Maze | undefined = undefined
let player: Player | undefined = undefined
let intersections: Intersection[] = []

function draw(
    mapContext: CanvasRenderingContext2D,
    fpvContext: CanvasRenderingContext2D
): void {
    drawMaze(mapContext, maze!, mapScale)
    drawPlayer(mapContext, player!, intersections, mapScale)

    createFpvImageData(fpvContext, fpvWidth, fpvHeight, intersections)
}

function addKeyboardListener() {
    document.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.code.startsWith("Arrow")) {
            event.preventDefault();
        }
        switch (event.key) {
            case "ArrowUp":
                player!.stepForward(maze!)
                redraw()
                break;
            case "ArrowDown":
                player!.stepBackward(maze!)
                redraw()
                break;
            case "ArrowLeft":
                player!.turnLeft()
                redraw()
                break;
            case "ArrowRight":
                player!.turnRight()
                redraw()
                break;
        }
    });
}

const redraw = () => {
    intersections = new IntersectionsDetector(player!, maze!).calculate()
    draw(mapContext!, fpvContext!)
}

const getContext = (canvas: HTMLCanvasElement)=> {
    const result = canvas.getContext("2d");
    if (!result) {
        throw new Error("Context is unavailable");
    }
    return result
}

const prepareTextures = async () => {
    await prepareTexture("picture")
    await prepareTexture("wall")
    await prepareTexture("exitDoor")
    await prepareTexture("window")
}

async function initialize(): Promise<void> {

    await prepareTextures()

    fpvContext = getContext(fpvCanvas)
    fpvCanvas.width = fpvWidth
    fpvCanvas.height = fpvHeight

    maze = await loadMaze("/maze_samples/3.txt", playerWallGap)
    mapContext = getContext(mapCanvas)
    mapCanvas.width = TEXTURE_SIZE * maze!.mazeWidth / mapScale
    mapCanvas.height = TEXTURE_SIZE * maze!.mazeHeight / mapScale

    player = new Player({x: TEXTURE_SIZE * 1.5, y: TEXTURE_SIZE * 1.5}, fpvWidth)

    addKeyboardListener()

    redraw()
}

// Entry point
initialize().catch((e) => console.log(e))