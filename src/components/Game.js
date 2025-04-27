import Canvas from './Canvas.js';
import Buttons from './Buttons.js';
import Stats from './Stats.js';
import Confetti from './Confetti.js';
import {generateBoard} from '../scripts/generateBoard.js';
import {useRef, useState, useEffect} from 'react';
import copyBoard from '../scripts/copyBoard.js';

export default function Game(){
    function newGame(){
        solved.current = false;
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
        else if(difficulty.current === "Very Easy"){
            numStartingSquares = 78;
        }
        else{
            throw new Error(`difficulty.current is not one of the valid values: difficulty.current is ${difficulty.current}`);
        }
        numCellsSolved.current = numStartingSquares;
        let [newBoard, solvedNewBoard] = generateBoard(numStartingSquares);
        for(let i = 0; i < newBoard.length; ++i){
            originalBoard.current[i] = new Array(newBoard[i].length).fill(null);
            solvedBoard.current[i] = new Array(newBoard[i].length).fill(null);
            boardColors.current[i] = new Array(newBoard[i].length).fill(null);
            for(let j = 0; j < newBoard[i].length; ++j){
                if(newBoard[i][j] !== null){
                    boardColors.current[i][j] = colors.startColor;
                    originalBoard.current[i][j] = newBoard[i][j];
                }
                solvedBoard.current[i][j] = solvedNewBoard[i][j];
            }
        }
        setBoard(newBoard);
        setNumHints(0);
        setNumMistakes(0);
        currentDifficulty.current = difficulty.current;
    }

    function updateBoard(row, col, val){
        let newBoard = copyBoard(board);
        const prevVal = newBoard[row][col];
        if(prevVal === val){
            return;
        }
        newBoard[row][col] = val;
        if(val === solvedBoard.current[row][col]){
            boardColors.current[row][col] = colors.correctColor;
            numCellsSolved.current += 1;
        }
        else{
            boardColors.current[row][col] = colors.incorrectColor;
            setNumMistakes(numMistakes + 1);
        }
        setBoard(newBoard);
        if(numCellsSolved.current === 81){
            solved.current = true;
        }
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

    function solveBoard(){
        for(let i = 0; i < board.length; ++i){
            for(let j  = 0; j < board[i].length; ++j){
                if(originalBoard.current[i][j] !== null){
                    boardColors.current[i][j] = colors.startColor;
                }
                else{
                    boardColors.current[i][j] = colors.correctColor;
                }
            }
        }
        let solvedBoardCopy = copyBoard(solvedBoard.current);
        setBoard(solvedBoardCopy);
        solved.current = true;
        const extraHints = 81 - numCellsSolved.current;
        setNumHints(numHints + extraHints);
        numCellsSolved.current = 81;
    }

    function solveCell(){
        let newBoard = copyBoard(board);
        let val = solvedBoard.current[selectedCell[0]][selectedCell[1]]
        let prevVal = board[selectedCell[0]][selectedCell[1]]
        newBoard[selectedCell[0]][selectedCell[1]] = val;
        setBoard(newBoard);
        setNumHints(numHints + 1);
        boardColors.current[selectedCell[0]][selectedCell[1]] = colors.correctColor;
        numCellsSolved.current += 1;
        if(numCellsSolved.current === 81){
            solved.current = true;
        }
        setSelectedCell(null);
    }

    const [timesRestarted, setTimesRestarted] = useState(0);
    const [board, setBoard] = useState(new Array(9).fill(null).map(() => new Array(9).fill(null)))
    const boardColors = useRef(new Array(9).fill(null).map(() => new Array(9).fill(null)))
    const originalBoard = useRef(new Array(9).fill(null).map(()=> new Array(9).fill(null)));
    const solvedBoard = useRef(new Array(9).fill(null).map(()=> new Array(9).fill(null)));
    //difficulty represents what is in the difficulty select for when you click new game, currentDifficulty is the difficulty for current game
    const difficulty = useRef('Easy');
    const currentDifficulty = useRef('Easy');
    const [selectedCell, setSelectedCell] = useState(null);
    const [numMistakes, setNumMistakes] = useState(0);
    const [numHints, setNumHints] = useState(0);
    const numCellsSolved = useRef(0);
    const solved = useRef(false);
    //startColor correctColor and incorrectColor refer to the drawing of the numbers on the sudoku board
    //startColor: numbers in the starting board
    //correctColor: guesses that are correct when you finish/ click solve board
    //incorrectColor: for when you input a number that doesnt match with correct solution
    let colors = {startColor:"black", correctColor: "green", incorrectColor: "red", backgroundColor: "rgb(240, 240, 245)", selectColor: "#9af5f2"}

    useEffect(()=>newGame(), []);
    return(
        <>
            <h1>Sudoku</h1>
            <Canvas 
                board = {board} 
                updateBoard = { updateBoard} 
                boardColors = {boardColors} colors = {colors}
                selectedCell = {selectedCell}
                setSelectedCell = {setSelectedCell}
            />
            <Buttons
                newGame = {newGame}
                solveBoard = {solveBoard}
                solveCell = {solveCell}
                difficulty = {difficulty}
                selectedCell = {selectedCell}
                solved = {solved}
            />
            <Stats
                numHints = {numHints}
                numMistakes = {numMistakes}
                solved = {solved}
                currentDifficulty = {currentDifficulty}
            />
            {solved.current?<Confetti/>:null}
        </>
    )
}