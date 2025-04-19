import {getNumSolutions} from "./checkOnlySolution.js"
import copyBoard from "./copyBoard.js"

export function generateSolvedBoard(){
    let board = new Array(9).fill(0).map(()=>{return new Array(9).fill(null)});
    backTrack(board,0,0);
    return board;  
}

//expects numStartingSquares to be >= 25
export function generateBoard(numStartingSquares, timeoutTime = 500){
    if(numStartingSquares < 25){
        throw new Error('starting board should have at least 25 squares')
    }
    let returnVal = null;
    while(returnVal === null){
        returnVal = generateBoardHelper(numStartingSquares, timeoutTime);
    }
    let [board, solvedBoard] = returnVal;
    return [board, solvedBoard];
}

function generateBoardHelper(numStartingSquares, timeoutTime){
    let startTime = new Date();
    let board = generateSolvedBoard();
    let solvedBoard = copyBoard(board);
    let filledPositions = new Set(Array.from(new Array(81).keys()));
    let ctr = 0;
    while(filledPositions.size > numStartingSquares){
        let filledPositionsArr = [...filledPositions];
        shuffleArray(filledPositionsArr);
        let position = filledPositionsArr[0];
        let row = Math.floor(position / 9);
        let col = position % 9;
        let prevVal = board[row][col];
        board[row][col] = null;
        if(getNumSolutions(board, [], true) !== 1){
            board[row][col] = prevVal;
        }
        else{
            filledPositions.delete(position);
        }
        let elapsedTime = new Date() - startTime;
        if(elapsedTime > timeoutTime){
            return null;
        }
    }
    return [board, solvedBoard];
}

function backTrack(board, row, col){
    let availableMoves = [...getAvailableMoves(board,row,col)];
    shuffleArray(availableMoves);
    let backTrackVal = false;
    for(let availableMove of availableMoves){
        board[row][col] = availableMove;
        if(col !== 8){
            backTrackVal = backTrack(board, row, col + 1);
        }
        else if(row !== 8 && col === 8){
            backTrackVal = backTrack(board, row + 1, 0);
        }
        else if(row === 8 && col === 8){
            return true;
        }
        if(backTrackVal === true){
            break;
        }
    }
    if(backTrackVal === false){
        board[row][col] = null;
    }
    return backTrackVal;

}

function getAvailableMoves(board, row, col){
    let availableMoves = new Set([1,2,3,4,5,6,7,8,9])
    for(let i = 0; i < board.length; ++i){
        if(availableMoves.has(board[i][col])){
            availableMoves.delete(board[i][col]);
        }
    }
    for(let i = 0; i < board[row].length; ++i){
        if(availableMoves.has(board[row][i])){
            availableMoves.delete(board[row][i]);
        }
    }
    let subRow = Math.floor(row / 3) * 3;
    let subCol = Math.floor(col / 3) * 3;
    for(let i = subRow; i < subRow+3; ++i){
        for(let j = subCol; j < subCol+3; ++j){
            if(availableMoves.has(board[i][j])){
                availableMoves.delete(board[i][j]);
            }
        }
    }
    return availableMoves;
}

//selects a random int [min, max)
function randInt(min, max){
    let intervalRange = max - min;
    return Math.floor(Math.random() * intervalRange) + min
}
function shuffleArray(array){
    for(let i = 0; i < array.length - 2; ++i){
        //pick random number j s.t i <= j <= n - 1
        const j = randInt(i, array.length);
        [array[j], array[i]] = [array[i], array[j]];
    }
}