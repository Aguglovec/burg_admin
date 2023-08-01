import React, { useEffect, useRef, useState } from "react";
import "./Game.css";
import {useInterval} from "./modules/hooks/useInterval";
import {boardColor, canvasX, canvasY, scale, timeDelay} from "./gameConfig";
import {drawSnake} from "./modules/Snake/Snake";
import {drawApple} from "./modules/Apple/Apple";
import { coordinate2D } from "./types/types";


function Game() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [ snake, setSnake ] = useState([randomCoord(canvasX, canvasY, scale)]);
	const [ apple, setApple ] = useState(randomCoord(canvasX, canvasY, scale));
	const [ direction, setDirection ] = useState<coordinate2D>({x : 1, y : 0});
	const [ delay, setDelay ] = useState<number | null>(null);
	const [ gameOver, setGameOver ] = useState(false);
	const [ arrowPressed, setArrowPressed ] = useState(false);

	useInterval(() => runGame(), delay);

	useEffect(
		() => {
			if (canvasRef.current) {
				const canvas = canvasRef.current;
				const ctx = canvas.getContext("2d");
				if (ctx) {
					ctx.setTransform(scale, 0, 0, scale, 0, 0);
					ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
					ctx.fillStyle = boardColor;
					drawSnake (ctx, snake);
					drawApple (ctx, apple);
					setArrowPressed(false);
				}
			}
		},
		[ snake, apple, gameOver ]
	)

	function play() {
		setSnake([randomCoord(canvasX, canvasY, scale)]);
		setApple(randomCoord(canvasX, canvasY, scale));
		setDirection({x : 1, y : 0});
		setDelay(timeDelay);
		setGameOver(false);
	}

	function checkCollision (head: coordinate2D) {
		if (head.x < 0 || head.x * scale >= canvasX) return true
		if (head.y < 0 || head.y * scale >= canvasY) return true
		
		for (const segment of snake) {
			if (head.x === segment.x && head.y === segment.y) return true
		}
		return false
	}

	function randomCoord (canvasX:number, canvasY:number, scale:number) {
		let coord : coordinate2D = { x:Math.floor(Math.random() * canvasX / scale), y:Math.floor(Math.random() * canvasY / scale)};
		return coord
	}


	function appleEaten(snakeHead: coordinate2D) {
		if (snakeHead.x === apple.x && snakeHead.y === apple.y) {
			setApple(randomCoord(canvasX, canvasY, scale));
			return true
		}
		return false
	}

	function runGame() {
		const newSnake = [ ...snake ];
		const newSnakeHead : coordinate2D = { x:newSnake[0].x + direction.x, y:newSnake[0].y + direction.y };
		newSnake.unshift(newSnakeHead);
		if (checkCollision(newSnakeHead)) {
			setDelay(null);
			setGameOver(true);
		}
		if (!appleEaten(newSnakeHead)) {
			newSnake.pop();
		}
		setSnake(newSnake);
	}

	function changeDirection(e: React.KeyboardEvent<HTMLDivElement>) {
		if (!arrowPressed) {
			switch (e.key) {
				case "ArrowLeft":
					if (direction.x != 1) setDirection({x : -1, y : 0});
					break
				case "ArrowUp":
					if (direction.y != 1) setDirection({x : 0, y : -1});
					break
				case "ArrowRight":
					if (direction.x != -1) setDirection({x : 1, y : 0});
					break
				case "ArrowDown":
					if (direction.y != -1) setDirection({x : 0, y : 1});
					break
			}
			setArrowPressed(true);
		}
	}

	return (
		<div onKeyDown={(e) => changeDirection(e)} >
			{gameOver && <div className="gameOver">Game Over</div>}
			<canvas className="playArea border-4 border-red-500" ref={canvasRef} width={`${canvasX}px`} height={`${canvasY}px`} />
			<button onClick={play} className="playButton">
				Play
			</button>
		</div>
	)
}

export default Game