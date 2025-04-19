import Canvas from './Canvas.js';
import {generateBoard} from '../scripts/generateBoard.js';
import {useRef, useState} from 'react';
import copyBoard from '../scripts/copyBoard.js';

export default function Game(){
    function handleClick(){
        boardColors.current.map(() => new Array(9).fill(null));
        let numStartingSquares;
        if(difficulty.current === "Easy"){
            numStartingSquares = 50;
        }
        else if(difficulty.current === "Medium"){
            numStartingSquares = 35;
        }
        else if(difficulty.current === "Hard"){
            numStartingSquares = 25;
        }
        else{
            throw new Error(`difficulty.current is not one of the valid values: difficulty.current is ${difficulty.current}`);
        }
        let newBoard = generateBoard(numStartingSquares);
        for(let i = 0; i < newBoard.length; ++i){
            originalBoard.current[i] = new Array(newBoard[i].length).fill(null);
            for(let j = 0; j < newBoard[i].length; ++j){
                if(newBoard[i][j] !== null){
                    boardColors.current[i][j] = colors.startColor;
                    originalBoard.current[i][j] = newBoard[i][j];
                }
            }
        }
        setBoard(newBoard);
    }

    function updateBoard(row, col, val, boardColors, validColor){
        let newBoard = copyBoard(board);
        const prevVal = newBoard[row][col];
        if(prevVal === val){
            return;
        }
        newBoard[row][col] = val;
        let prevIncorrectEntries = validateEntry(newBoard, row, col, prevVal);
        let duplicateEntries = validateEntry(newBoard, row, col, val);
        if(boardColors.current[row][col] === colors.incorrectColor){
            console.log('prevIncorrectEntries are ', prevIncorrectEntries);
            for(let entry of prevIncorrectEntries){
                if(originalBoard.current[entry[0]][entry[1]] === null){
                    boardColors.current[entry[0]][entry[1]] = validColor;
                }
                else{
                    boardColors.current[entry[0]][entry[1]] = colors.startColor;
                }
            }
        }
        if(duplicateEntries === null){
            boardColors.current[row][col] = validColor;
        }
        else{
            for(let entry of duplicateEntries){
                boardColors.current[entry[0]][entry[1]] = colors.incorrectColor;
            }
        }
        setBoard(newBoard);
    }
    function validateEntry(board, row, col, entry){
        if(board[row][col] === null){
            return null;
        }
        let duplicateEntries = [[row, col]];
        for(let i = 0; i < board[row].length; ++i){
            if(i !== col && board[row][i] === entry){
                duplicateEntries.push([row, i]);
            }
        }
        for(let i = 0; i < board.length; ++i){
            if(i !== row && board[i][col] === entry){
                duplicateEntries.push([i, col]);
            }
        }
        let subRow = Math.floor(row / 3) * 3;
        let subCol = Math.floor(col / 3) * 3;
        for(let i = subRow; i < subRow + 3; ++i){
            for(let j = subCol; j < subCol + 3; ++j){
                if(i !== row && j !== col && board[i][j] === entry){
                    duplicateEntries.push([i, j]);
                }
            }
        }
        if(duplicateEntries.length === 1)
            return null;
        return duplicateEntries;
    }

    const [timesRestarted, setTimesRestarted] = useState(0);
    const [board, setBoard] = useState(new Array(9).fill(null).map(() => new Array(9).fill(null)))
    const boardColors = useRef(new Array(9).fill(null).map(() => new Array(9).fill(null)))
    const originalBoard = useRef(new Array(9).fill(null).map(()=> new Array(9).fill(null)));
    const difficulty = useRef('Easy');
    //colors refer to the drawing of the numbers on the sudoku board
    //startColor: numbers in the starting board
    //guessColor: numbers that you input into the board
    //correctColor: guesses that are correct when you finish/ click solve board

    //incorrectColor: for when you input a number that contradicts with the current board state, ie same 2 numbers in row
    //note: a number that is incorrect w.r.t to the final solution but has no current contradictions will be guessColor, not incorrectColor
    let colors = {startColor:"black", guessColor:"grey", correctColor: "green", incorrectColor: "red"}
    
    return(
        <>
            <Canvas 
                board = {board} 
                updateBoard = {(row, col, val, boardColors) => updateBoard(row, col, val, boardColors, colors.guessColor)} 
                boardColors = {boardColors} colors = {colors}
                originalBoard = {originalBoard}
            />
            <button onClick = {handleClick}>New Game</button>
            <label>
                Difficulty:
                <select defaultValue="Easy" onChange = {(event) => difficulty.current = event.target.value}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </label>
        </>
    )
}