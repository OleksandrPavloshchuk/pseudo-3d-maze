import {Maze} from "./Maze"
import {Point} from "./Point"

export class Player {
    private readonly turnStep = 0.1
    private readonly moveStep = 3

    public readonly viewAngleHalfWidth = Math.PI / 4
    public viewAngleStep
    public viewAngleSteps

    public viewAngleMiddle: number = Math.PI / 2

    constructor(
        public readonly position: Point,
        fpvWidth: number)
    {
        this.viewAngleStep = Math.PI / fpvWidth
        this.viewAngleSteps = fpvWidth
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