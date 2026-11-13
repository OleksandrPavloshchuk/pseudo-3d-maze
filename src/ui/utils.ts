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