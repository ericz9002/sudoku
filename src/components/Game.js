import Canvas from './Canvas.js';
import {generateBoard} from '../scripts/generateBoard.js';
import {useRef, useState} from 'react';
import copyBoard from '../scripts/copyBoard.js';

export default function Game(){
    function handleClick(){
        let newBoard = generateBoard(25);
        setBoard(newBoard);
    }

    function updateBoard(row, col, val){
        let newBoard = copyBoard(board);
        console.log('newBoard is ', newBoard);
        console.log('newBoard[0] is ', newBoard[0]);
        console.log('newBoard[0][0] is ', newBoard[0][0]);
        newBoard[row][col] = val;
        setBoard(newBoard);
    }

    const [timesRestarted, setTimesRestarted] = useState(0);
    const [board, setBoard] = useState(new Array(9).fill(null).map(() => new Array(9).fill(null)))
    console.log(`rendered game, timesRestarted is ${timesRestarted}`);
    return(
        <>
            <Canvas board = {board} updateBoard = {updateBoard}/>
            <button onClick = {handleClick}>New Game</button>
        </>
    )
}