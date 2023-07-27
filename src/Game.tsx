import React, { useEffect, useRef, useState } from "react";
import "./Game.css";
import {useInterval} from "./modules/hooks/useInterval";
import {canvasX, canvasY, scale, timeDelay} from "./gameConfig";
import {drawSnake} from "./modules/Snake/Snake";
import {drawApple} from "./modules/Apple/Apple";



function Game() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [ snake, setSnake ] = useState([randomCoord(canvasX, canvasY, scale)]);
	const [ apple, setApple ] = useState(randomCoord(canvasX, canvasY, scale));
	const [ direction, setDirection ] = useState([ 0, -1 ]);
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
					ctx.fillStyle = "#a3d001";
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
		setDirection([ 1, 0 ]);
		setDelay(timeDelay);
		setGameOver(false);
	}

	function checkCollision(head: number[]) {
		for (let i = 0; i < head.length; i++) {
			if (head[i] < 0 || head[i] * scale >= canvasX) return true
		}
		for (const s of snake) {
			if (head[0] === s[0] && head[1] === s[1]) return true
		}
		return false
	}

	function randomCoord (canvasX:number, canvasY:number, scale:number) {
		let coord = [Math.floor(Math.random() * canvasX / scale), Math.floor(Math.random() * canvasY / scale)];
		return coord
	}


	function appleEaten(newSnake: number[][]) {
		if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
			setApple(randomCoord(canvasX, canvasY, scale));
			return true
		}
		return false
	}

	function runGame() {
		const newSnake = [ ...snake ];
		const newSnakeHead = [ newSnake[0][0] + direction[0], newSnake[0][1] + direction[1] ];
		newSnake.unshift(newSnakeHead);
		if (checkCollision(newSnakeHead)) {
			setDelay(null);
			setGameOver(true);
		}
		if (!appleEaten(newSnake)) {
			newSnake.pop();
		}
		setSnake(newSnake);
	}

	function changeDirection(e: React.KeyboardEvent<HTMLDivElement>) {
		if (!arrowPressed) {
			switch (e.key) {
				case "ArrowLeft":
					if (direction[0] != 1) setDirection([ -1, 0 ]);
					break
				case "ArrowUp":
					if (direction[1] != 1) setDirection([ 0, -1 ]);
					break
				case "ArrowRight":
					if (direction[0] != -1) setDirection([ 1, 0 ]);
					break
				case "ArrowDown":
					if (direction[1] != -1) setDirection([ 0, 1 ]);
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