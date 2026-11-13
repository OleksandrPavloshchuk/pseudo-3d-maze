import {Maze} from "./model/Maze"
import {Player} from "./model/Player"
import {loadMaze} from "./loadMaze"
import {drawPlayer} from "./ui/drawPlayer"
import {drawMaze} from "./ui/drawMaze"
import {drawIntersections} from "./ui/drawIntersections"
import {Intersection, IntersectionsDetector} from "./model/IntersectionsDetector"
import {drawFpv} from "./ui/drawFpv"

const cellSize = 64
const playerWallGap = 6
const playerSize = 4
const pointerSize = 8

const povWidth = 640
const povHeight = 480

const mapCanvas = document.getElementById("maze-map-canvas") as HTMLCanvasElement
let mapContext: CanvasRenderingContext2D | null = null

const fpvCanvas = document.getElementById("maze-pov-canvas") as HTMLCanvasElement
let fpvContext: CanvasRenderingContext2D | null = null

let maze: Maze | undefined = undefined
let player: Player | undefined = undefined
let intersections: Intersection[] = []

function draw(
    mapContext: CanvasRenderingContext2D,
    povContext: CanvasRenderingContext2D
): void {
    drawMaze(mapContext, maze!)
    drawPlayer(mapContext, player!, intersections, playerSize, pointerSize)
    drawIntersections(mapContext, intersections)
    drawFpv(povContext, povWidth, povHeight, player!, intersections)
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

async function initialize(): Promise<void> {
    fpvContext = getContext(fpvCanvas)
    fpvCanvas.width = povWidth
    fpvCanvas.height = povHeight

    maze = await loadMaze("/maze_samples/2.txt", cellSize, playerWallGap)
    mapContext = getContext(mapCanvas)
    mapCanvas.width = cellSize * maze!.mazeWidth
    mapCanvas.height = cellSize * maze!.mazeHeight

    player = new Player({x: cellSize * 1.5, y: cellSize * 1.5})

    addKeyboardListener()

    redraw()
}

// Entry point
initialize().catch((e) => console.log(e))