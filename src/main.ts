import {Maze} from "./model/Maze";
import {Player} from "./model/Player";
import {loadMaze} from "./loadMaze";
import {drawPlayer} from "./ui/drawPlayer";
import {drawMaze} from "./ui/drawMaze";
import {drawIntersections} from "./ui/drawIntersections";
import {Intersection, IntersectionsDetector} from "./model/IntersectionsDetector";
import {drawPov} from "./ui/drawPov";

const cellSize = 50
const playerWallGap = 6
const playerSize = 4
const pointerSize = 8

const povWidth = 480
const povHeight = 320

const mapCanvas = document.getElementById("maze-map-canvas") as HTMLCanvasElement
let mapContext: CanvasRenderingContext2D | null = null

const povCanvas = document.getElementById("maze-pov-canvas") as HTMLCanvasElement
let povContext: CanvasRenderingContext2D | null = null

let maze: Maze | undefined = undefined
let player: Player | undefined = undefined

// TODO use Intersection objects instead of Point here
let intersections: Intersection[] = []

function draw(
    mapContext: CanvasRenderingContext2D,
    povContext: CanvasRenderingContext2D
): void {
    drawMaze(mapContext, maze!)
    drawPlayer(mapContext, player!, intersections, playerSize, pointerSize)
    drawIntersections(mapContext, intersections)
    drawPov(povContext, povWidth, povHeight, maze!, player!)
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

const calculateIntersections = () => {
    intersections = new IntersectionsDetector(player!, maze!).calculate()
}

const redraw = () => {
    calculateIntersections()
    draw(mapContext!, povContext!)
}

async function initialize(): Promise<void> {
    mapContext = mapCanvas.getContext("2d");
    if (!mapContext) {
        throw new Error("Canvas 2D context for map is unavailable");
    }

    povContext = povCanvas.getContext("2d");
    if (!povContext) {
        throw new Error("Canvas 2D context for POV is unavailable");
    }

    povCanvas.width = povWidth
    povCanvas.height = povHeight

    maze = await loadMaze("/maze_samples/1.txt", cellSize, playerWallGap)
    mapCanvas.width = cellSize * maze!.mazeWidth
    mapCanvas.height = cellSize * maze!.mazeHeight

    player = new Player({x: cellSize * 1.5, y: cellSize * 1.5})

    addKeyboardListener()

    redraw()
}

initialize().catch((e) => console.log(e))