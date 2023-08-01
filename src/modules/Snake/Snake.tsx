import { snakeColor } from "../../gameConfig";
import { coordinate2D } from "../../types/types";

export function drawSnake (ctx : CanvasRenderingContext2D, snake :coordinate2D[]) {
	ctx.fillStyle = snakeColor;
	snake.forEach((segment) => ctx.fillRect(segment.x, segment.y, 1, 1));

}

