import {Maze} from "./model/Maze";
import {Player} from "./model/Player";
import {loadMaze} from "./loadMaze";
import {drawPlayer} from "./ui/drawPlayer";
import {drawMaze} from "./ui/drawMaze";
import {Point} from "./model/Point";
import {drawIntersections} from "./ui/drawIntersections";
import {Intersection, IntersectionsDetector} from "./model/IntersectionsDetector";

const cellSize = 80
const playerWallGap = 6
const playerSize = 4
const pointerSize = 8

const mapCanvas = document.getElementById("maze-map-canvas") as HTMLCanvasElement
let mapContext: CanvasRenderingContext2D | null = null

let maze: Maze | undefined = undefined
let player: Player | undefined = undefined

// TODO use Intersection objects instead of Point here
let intersections: Intersection[] = []

function draw(mapContext: CanvasRenderingContext2D): void {
    drawMaze(mapContext, maze!)
    drawPlayer(mapContext, player!, intersections, playerSize, pointerSize)
    drawIntersections(mapContext, intersections)
}

function addKeyboardListener() {
    document.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.code.startsWith("Arrow")) {
            event.preventDefault();
        }
        switch (event.key) {
            case "ArrowUp":
                player!.stepForward(maze!)
                calculateIntersections()
                draw(mapContext!)
                break;
            case "ArrowDown":
                player!.stepBackward(maze!)
                calculateIntersections()
                draw(mapContext!)
                break;
            case "ArrowLeft":
                player!.turnLeft()
                calculateIntersections()
                draw(mapContext!)
                break;
            case "ArrowRight":
                player!.turnRight()
                calculateIntersections()
                draw(mapContext!)
                break;
        }
    });
}

const calculateIntersections = () => {
    intersections = new IntersectionsDetector(player!, maze!).calculate()
}

async function initialize(): Promise<void> {
    mapContext = mapCanvas.getContext("2d");
    if (!mapContext) {
        throw new Error("Canvas 2D context is unavailable");
    }
    maze = await loadMaze("/maze_samples/1.txt", cellSize, playerWallGap)
    mapCanvas.width = cellSize * maze!.mazeWidth
    mapCanvas.height = cellSize * maze!.mazeHeight

    player = new Player({x: cellSize * 1.5, y: cellSize * 1.5})

    calculateIntersections()

    addKeyboardListener()

    draw(mapContext!)
}

initialize().catch((e) => console.log(e))