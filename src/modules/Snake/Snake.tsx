export function drawSnake (ctx : CanvasRenderingContext2D, snake :number[][]) {
	ctx.fillStyle = "#a3d001"
	snake.forEach(([ x, y ]) => ctx.fillRect(x, y, 1, 1))

}

