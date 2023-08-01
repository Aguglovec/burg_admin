import { appleColor } from "../../gameConfig";
import { coordinate2D } from "../../types/types";

export function drawApple (ctx : CanvasRenderingContext2D, apple : coordinate2D) {
	ctx.fillStyle = appleColor;
	ctx.fillRect(apple.x, apple.y, 1, 1);

}

