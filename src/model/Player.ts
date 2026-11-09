import {Maze} from "./Maze";
import {Point} from "./Point";

export class Player {
    private readonly turnStep = 0.1
    private readonly moveStep = 3

    public readonly viewAngleHalfWidth = Math.PI / 4
    public readonly viewAngleStep = Math.PI / 512
    public readonly viewAngleSteps = 2 * this.viewAngleHalfWidth / this.viewAngleStep

    public position: Point
    public viewAngleMiddle: number = Math.PI / 2

    constructor(position: Point) {
        this.position = position
    }

    turnLeft = () => {
        this.viewAngleMiddle -= this.turnStep
        if (this.viewAngleMiddle <= 0) {
            this.viewAngleMiddle = Math.PI * 2
        }
    }

    turnRight = () => {
        this.viewAngleMiddle += this.turnStep
        if (this.viewAngleMiddle >= Math.PI * 2) {
            this.viewAngleMiddle = 0
        }
    }

    stepForward = (maze: Maze) => {
        const x = this.position.x + Math.cos(this.viewAngleMiddle) * this.moveStep
        const y = this.position.y + Math.sin(this.viewAngleMiddle) * this.moveStep
        if (!maze.isCollided({x, y})) {
            this.position.x = x
            this.position.y = y
        }
    }

    stepBackward = (maze: Maze) => {
        const x = this.position.x - Math.cos(this.viewAngleMiddle) * this.moveStep
        const y = this.position.y - Math.sin(this.viewAngleMiddle) * this.moveStep
        if (!maze.isCollided({x, y})) {
            this.position.x = x
            this.position.y = y
        }
    }
}