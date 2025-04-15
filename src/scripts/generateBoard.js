import {checkOnlySolution, getNumSolutions} from "./checkOnlySolution.js"
import {copyBoard} from "./copyBoard.js"
import {printBoard} from "./printBoard.js"

export function generateSolvedBoard(){
    let board = new Array(9).fill(0).map(()=>{return new Array(9).fill(null)});
    backTrack(board,0,0);
    return board;  
}

//expects numStartingSquares to be >= 20
export function generateBoard(numStartingSquares){
    //todo
}

function backTrack(board, row, col){
    let debug = false;
    if(debug){
        console.log(`row ${row}, col ${col}`)
        printBoard(board)
    }
    let availableMoves = [...getAvailableMoves(board,row,col)];
    shuffleArray(availableMoves);
    if(debug)
        console.log(`availableMoves is ${availableMoves}`)
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
            if(debug)
                console.log('returning true, last recursive call');
            return true;
        }
        if(backTrackVal === true){
            break;
        }
    }
    if(backTrackVal === false){
        board[row][col] = null;
    }
    if(debug)
        console.log(`returning ${backTrackVal}`);
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

for(let i = 0; i < 100; ++i){
    let time1 = new Date();
    let b = generateSolvedBoard();
    let time2 = new Date();
    //console.log(`${i}: solved board in ${(time2 - time1)/1000} seconds`);
    //printBoard(b);
}
