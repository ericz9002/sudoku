import { describe, test, expect} from 'vitest'
import {generateSolvedBoard, generateBoard} from "./generateBoard.js"
import {checkOnlySolution} from "./checkOnlySolution.js"

function validateSolvedBoard(board){
    if(board.length !== 9)
        return false;
    for(let i = 0; i < board.length; ++i){
        if(board[i].length != 9)
            return false;
    }
    //check rows
    for(let i = 0; i < board.length; ++i){
        let completeSet = new Set([1,2,3,4,5,6,7,8,9])
        for(let j = 0; j < board.length; ++j){
            if(completeSet.has(board[i][j])){
                completeSet.delete(board[i][j]);
            }
            else{
                return false;
            }
        }
    }
    //check cols
    for(let i = 0; i < board.length; ++i){
        let completeSet = new Set([1,2,3,4,5,6,7,8,9])
        for(let j = 0; j < board[i].length; ++j){
            if(completeSet.has(board[j][i])){
                completeSet.delete(board[j][i]);
            }
            else{
                return false;
            }
        }
    }
    //check subBoards
    for(let subBoard = 0; subBoard < 9; ++subBoard){
        let i = Math.floor(subBoard / 3) * 3;
        let i_cap = i + 3;
        let j = (subBoard % 3) * 3;
        let j_cap = j + 3;
        let completeSet = new Set([1,2,3,4,5,6,7,8,9]);
        for(i; i < i_cap; ++i){
            for(j; j < j_cap; ++j){
                if(completeSet.has(board[i][j])){
                    completeSet.delete(board[i][j]);
                }
                else{
                    return false;
                }
            }
        }
    }
    return true;
}
function validateBoard(board){
    function validateEntry(board, row, col){
        if(board[row][col] === null){
            return true;
        }
        let availableNums = new Set([1,2,3,4,5,6,7,8,9]);
        for(let i = 0; i < board[row].length; ++i){
            if(board[row][i] !== null){
                if(availableNums.has(board[row][i])){
                    availableNums.delete(board[row][i]);
                }
                else{
                    return false;
                }
            }
        }
        availableNums = new Set([1,2,3,4,5,6,7,8,9]);
        for(let i = 0; i < board.length; ++i){
            if(board[i][col] !== null){
                if(availableNums.has(board[i][col])){
                    availableNums.delete(board[i][col]);
                }
                else{
                    return false;
                }
            }
        }
        availableNums = new Set([1,2,3,4,5,6,7,8,9]);
        let subRow = Math.floor(row / 3) * 3;
        let subCol = Math.floor(col / 3) * 3;
        for(let i = subRow; i < subRow + 3; ++i){
            for(let j = subCol; j < subCol + 3; ++j){
                if(board[i][j] !== null){
                    if(availableNums.has(board[i][j])){
                        availableNums.delete(board[i][j])
                    }
                    else{
                        return false;
                    }
                }
            }
        }
        return true;
    }

    if(board.length !== 9){
        return false;
    }
    for(let i = 0; i < board.length; ++i){
        if(board[i].length !== 9){
            return false;
        }
    }
    for(let i = 0; i < board.length; ++i){
        for(let j = 0; j < board[i].length; ++j){
            if(validateEntry(board, i, j) === false){
                return false;
            }
        }
    }
    return true;
}

function countCells(board){
    let count = 0;
    for(let i = 0; i < board.length; ++i){
        for(let j = 0; j < board[i].length; ++j){
            if(board[i][j] !== null){
                count += 1;
            }
        }
    }
    return count;
}

describe('test generateSolvedBoard', ()=>{
    test('generate and validate a solved board', ()=>{
        let solvedBoard = generateSolvedBoard();
        expect(validateSolvedBoard(solvedBoard)).toBe(true);
    })

    test('generate 10 solved boards and expect at least 5 to be unique', ()=>{
        let uniqueBoards = new Set();
        for(let i = 0; i < 10; ++i){
            let solvedBoard = generateSolvedBoard();
            uniqueBoards.add(solvedBoard.toString());            
        }
        expect(uniqueBoards.size).toBeGreaterThanOrEqual(5);
    })

    test('generate and validate 100', ()=>{
        let solvedBoards = [];
        for(let i = 0; i < 100; ++i){
            solvedBoards.push(generateSolvedBoard());
        }
        for(let i = 0; i < solvedBoards.length; ++i){
            expect(validateSolvedBoard(solvedBoards[i])).toBe(true);
        }
    })
})

describe('test generateBoard', ()=>{
    test('generateBoard(24) should throw error', ()=>{
        expect(()=>generateBoard(24).toThrowError('starting board should have at least 25 squares'));
    })

    test('test easy board generateBoard(40)', ()=>{
        let [board, solvedBoard] = generateBoard(40);
        expect(countCells(board)).toEqual(40);
        expect(validateBoard(board)).toEqual(true);
        expect(checkOnlySolution(board)).toEqual(solvedBoard);
    })

    test('test hard board generateBoard(25)', ()=>{
        let [board, solvedBoard] = generateBoard(25);
        expect(countCells(board)).toEqual(25);
        expect(validateBoard(board)).toEqual(true);
        expect(checkOnlySolution(board)).toEqual(solvedBoard);
    })

    test('at least 5/10 generated boards are unique for generateBoard(30)', ()=>{
        let uniqueBoards = new Set();
        for(let i = 0; i < 10; ++i){
            let board = generateBoard(30)[0];
            uniqueBoards.add(board.toString());
        }
        expect(uniqueBoards.size).toBeGreaterThanOrEqual(5);
    })
})