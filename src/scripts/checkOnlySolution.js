import { strict as assert } from 'assert';
import {printBoard} from './printBoard.js';

export function checkOnlySolution(board){
    let boardCopy = [];
    for(let i = 0; i < board.length; ++i){
        boardCopy[i] = board[i].slice();
    }
    let solvedBoards = []
    let numSolutions = getNumSolutions(boardCopy, solvedBoards, true);
    //console.log(`found ${numSolutions} solutions`)
    if(numSolutions === 1){
        return solvedBoards[0];
    }
    else{
        return null;
    }
}

export function getNumSolutions(board, solvedBoards, stopEarly = false){
    let numSquaresSolved = 0;
    for(let i = 0; i < board.length; ++i){
        for(let j = 0; j < board[i].length; ++j){
            if(board[i][j] !== null){
                numSquaresSolved += 1;
            }
        }
    }
    let availableMovesBoard = new Array(9).fill(0).map(() =>{return new Array(9).fill(null)});
    for(let i = 0; i < availableMovesBoard.length; ++i){
        for(let j = 0; j < availableMovesBoard[i].length; ++j){
            availableMovesBoard[i][j] = getAvailableMoves(board, i, j);
        }
    }
    let boardCopy = [];
    for(let i = 0; i < board.length; ++i){
        boardCopy[i] = board[i].slice();
    }
    //let numSolutions = OGBackTrack(solvedBoard, availableMovesBoard, [numSquaresSolved], stopEarly, []);
    let numSolutions = backTrack(boardCopy, availableMovesBoard, [numSquaresSolved], solvedBoards, stopEarly);
    //if stopEarly, then it will return either 0,1,2
    return numSolutions;
}

function backTrack(board, availableMovesBoard, numSquaresSolved, solvedBoards, stopEarly = true){
    function iterateBoard(board, row, col, cb){
        let positions = new Set();
        for(let i = 0; i < board.length; ++i){
            if(cb(board, i, col)){
                positions.add([i, col].toString());
            }
        }
        for(let i = 0; i < board[row].length; ++i){
            if(cb(board, row, i)){
                positions.add([row, i].toString());
            }
        }
        const subRow = Math.floor(row / 3) * 3;
        const subCol = Math.floor(col / 3) * 3;
        for(let i = subRow; i < subRow + 3; ++i){
            for(let j = subCol; j < subCol + 3; ++j){
                if(cb(board, i, j)){
                    positions.add([i,j].toString());
                }
            }
        }
        return positions;
    }

    function removeEntry(availableMovesBoard, row, col, num){
        if(availableMovesBoard[row][col].has(num)){
            availableMovesBoard[row][col].delete(num);
            return true;
        }
        return false;
    }

    function addEntry(availableMovesBoard, row, col, positions, num){
        if(positions.has([row, col].toString())){
            availableMovesBoard[row][col].add(num);
        }
        return null;
    }
    if(numSquaresSolved[0] === 81){
        return 1;
    }
    let nextMovePosition = getNextMovePosition(availableMovesBoard, board);
    if(nextMovePosition === null){
        return 0;
    }
    numSquaresSolved[0] += 1;
    const[row, col] = nextMovePosition;
    const nextMoves = Array.from(availableMovesBoard[row][col]);
    let totalNumBoards = 0;
    let solvedBoard = null;
    for(let nextMove of nextMoves){
        board[row][col] = nextMove;
        let availableMovesBoardCopy = copyAvailableMovesBoard(availableMovesBoard);
        iterateBoard(availableMovesBoardCopy, row, col, (board, row, col) => removeEntry(board, row, col, nextMove));
        let localNumBoards = backTrack(board, availableMovesBoardCopy, numSquaresSolved, solvedBoards, stopEarly);
        if(localNumBoards >= 1){
            solvedBoard = [];
            for(let i = 0; i < board.length; ++i){
                solvedBoard[i] = board[i].slice();
            }
            solvedBoards.push(solvedBoard);
        }
        if(stopEarly && localNumBoards >= 2){
            assert(localNumBoards === 2);
            return localNumBoards;
        }
        totalNumBoards += localNumBoards;
        if(stopEarly && totalNumBoards >= 2){
            assert(totalNumBoards === 2);
            return totalNumBoards;
        }
        availableMovesBoard[row][col].delete(nextMove);
    }
    numSquaresSolved[0] -= 1;
    board[row][col] = null;
    return totalNumBoards;
}

function copyAvailableMovesBoard(availableMovesBoard){
    let copy = new Array(9).fill(0).map(() =>{return new Array(9).fill(null)});
    for(let i = 0; i < copy.length; ++i){
        for(let j = 0; j < copy[i].length; ++j){
            copy[i][j] = new Set(availableMovesBoard[i][j]);
        }
    }
    return copy;
}

function getAvailableMoves(board, row, col){
    if(board[row][col] !== null)
        return new Set();
    let possibleMoves = new Set([1,2,3,4,5,6,7,8,9]);
    for(let i = 0; i < board.length; ++i){
        if(possibleMoves.has(board[i][col])){
            possibleMoves.delete(board[i][col]);
        }
    }
    for(let i = 0; i < board[row].length; ++i){
        if(possibleMoves.has(board[row][i])){
            possibleMoves.delete(board[row][i]);
        }
    }
    const subRow = Math.floor(row / 3) * 3;
    const subCol = Math.floor(col / 3) * 3;
    for(let i = subRow; i < subRow + 3; ++i){
        for(let j = subCol; j < subCol + 3; ++j){
            if(possibleMoves.has(board[i][j])){
                possibleMoves.delete(board[i][j]);
            }
        }
    }
    return possibleMoves;
}

function getNextMovePosition(availableMovesBoard, board){
    let leastMoves = 10;
    let nextMovePosition = null;
    for(let i = 0; i < availableMovesBoard.length; ++i){
        for(let j = 0; j < availableMovesBoard[i].length; ++j){
            if(board[i][j] === null && availableMovesBoard[i][j].size !== 0){
                if(availableMovesBoard[i][j].size < leastMoves){
                    leastMoves = availableMovesBoard[i][j].size;
                    nextMovePosition = [i, j];
                }
            }
        }
    }
    if(leastMoves === 10){
        return null;
    }
    else{
        return nextMovePosition;
    }
}

//debug functions

function printAvailableMovesBoard(availableMovesBoard){
    process.stdout.write(`printing availableMovesBoard[0][0]: ${availableMovesBoard[0][0]}\n`);
    for(let row = 0; row < availableMovesBoard.length; ++row){
        for(let col = 0; col < availableMovesBoard[row].length; ++col){
            let ele = availableMovesBoard[row][col]
            let eleStr = "{";
            for(let item of ele){
                eleStr += item.toString() + " ";
            }
            if(eleStr.at(-1) === ' ')
                eleStr = eleStr.slice(0, -1);
            eleStr += "} ";
            process.stdout.write(eleStr);
        }
        process.stdout.write('\n');
    }
}
