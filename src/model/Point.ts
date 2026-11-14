import {MazeCell} from "./MazeCell";

export interface Point {
    x: number
    y: number
}

export interface Intersection {
    a?: number
    point: Point
    cell?: MazeCell,
    distance?: number
    edge: "vertical" | "horizontal"
}