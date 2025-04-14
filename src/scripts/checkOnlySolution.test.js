import { describe, test, expect} from 'vitest';
import {getNumSolutions, checkOnlySolution} from "./checkOnlySolution.js";


//multiple solutions board test cases from http://sudopedia.enjoysudoku.com/Invalid_Test_Cases.html#Insufficient_Givens


//easy 1 solution board
let board1 = [[5,3,null,null,7,null,null,null,null],[6,null,null,1,9,5,null,null,null],[null,9,8,null,null,null,null,6,null],[8,null,null,null,6,null,null,null,3],[4,null,null,8,null,3,null,null,1],[7,null,null,null,2,null,null,null,6],[null,6,null,null,null,null,2,8,null],[null,null,null,4,1,9,null,null,5],[null,null,null,null,8,null,null,7,9]];
let board1Copy = [[5,3,null,null,7,null,null,null,null],[6,null,null,1,9,5,null,null,null],[null,9,8,null,null,null,null,6,null],[8,null,null,null,6,null,null,null,3],[4,null,null,8,null,3,null,null,1],[7,null,null,null,2,null,null,null,6],[null,6,null,null,null,null,2,8,null],[null,null,null,4,1,9,null,null,5],[null,null,null,null,8,null,null,7,9]];
//hard 1 solution board
let board2 = [[null,null,null,null,null,null,null,null,null],[null,9,null,null,1,null,null,3,null],[null,null,6,null,2,null,7,null,null],[null,null,null,3,null,4,null,null,null],[2,1,null,null,null,null,null,9,8],[null,null,null,null,null,null,null,null,null],[null,null,2,5,null,6,4,null,null],[null,8,null,null,null,null,null,1,null],[null,null,null,null,null,null,null,null,null]];
//2 solution board
let twoBoard = [[null, 3, 9, null, null, null, 1, 2, null],[null, null, null, 9, null, 7, null, null, null],[8, null, null, 4, null, 1, null, null, 6],[null, 4, 2, null, null, null, 7, 9, null],[null, null, null, null, null, null, null, null, null],[null, 9, 1, null, null, null, 5, 4, null],[5, null, null, 1, null, 9, null, null, 3],[null, null, null, 8, null, 5, null, null, null],[null, 1, 4, null, null, null, 8, 7, null]];
let twoBoardCopy = [[null, 3, 9, null, null, null, 1, 2, null],[null, null, null, 9, null, 7, null, null, null],[8, null, null, 4, null, 1, null, null, 6],[null, 4, 2, null, null, null, 7, 9, null],[null, null, null, null, null, null, null, null, null],[null, 9, 1, null, null, null, 5, 4, null],[5, null, null, 1, null, 9, null, null, 3],[null, null, null, 8, null, 5, null, null, null],[null, 1, 4, null, null, null, 8, 7, null]];
let threeBoard = [[null, null, 3, null, null, null, null, null, 6],[null, null, null, 9, 8, null, null, 2, null],[9, 4, 2, 6, null, null, 7, null, null],[4, 5, null, null, null, 6, null, null, null],[null, null, null, null, null, null, null, null, null],[1, null, 9, null, 5, null, 4, 7, null],[null, null, null, null, 2, 5, null, 4, null],[6, null, null, null, 7, 8, 5, null, null],[null, null, null, null, null, null, null, null, null]];
let fourBoard = [[null, null, null, null, 9, null, null, null, null],[6, null, null, 4, null, 7, null, null, 8],[null, 4, null, 8, 1, 2, null, 3, null],[7, null, null, null, null, null, null, null, 5],[null, null, 4, null, null, null, 9, null, null],[5, null, null, 3, 7, 1, null, null, 4],[null, 5, null, null, 6, null, null, 4, null],[2, null, 1, 7, null, 8, 5, null, 9],[null, null, null, null, null, null, null, null, null]];
let tenBoard = [[5, 9, null, null, null, null, null, 4, 8],[6, null, 8, null, null, null, 3, null, 7],[null, null, null, 2, null, 1, null, null, null],[null, null, null, null, 4, null, null, null, null],[null, 7, 5, 3, null, 6, 9, 8, null],[null, null, null, null, 9, null, null, null, null],[null, null, null, 8, null, 3, null, null, null],[2, null, 6, null, null, null, 7, null, 9],[3, 4, null, null, null, null, null, 6, 5]];
let hundredTwentyFiveBoard = [[null, null, null, 3, 1, 6, 5, null, null],[8, null, null, 5, null, null, 1, null, null],[null, 1, null, 8, 9, 7, 2, 4, null],[9, null, 1, null, 8, 5, null, 2, null],[null, null, null, 9, null, 1, null, null, null],[null, 4, null, 2, 6, 3, null, null, 1],[null, 5, null, null, null, null, null, 1, null],[1, null, null, 4, null, 9, null, null, 2],[null, null, 6, 1, null, 8, null, null, null]];
let zeroBoard =  [[null, null, 9, null, 2, 8, 7, null, null],[8, null, 6, null, null, 4, null, null, 5],[null, null, 3, null, null, null, null, null, 4],[6, null, null, null, null, null, null, null, null],[null, 2, null, 7, 1, 3, 4, 5, null],[null, null, null, null, null, null, null, null, 2],[3, null, null, null, null, null, 5, null, null],[9, null, null, 4, null, null, 8, null, 7],[null, null, 1, 2, 5, null, 3, null, null]];

let solvedBoard1 = [[5,3,4,6,7,8,9,1,2],[6,7,2,1,9,5,3,4,8],[1,9,8,3,4,2,5,6,7],[8,5,9,7,6,1,4,2,3],[4,2,6,8,5,3,7,9,1],[7,1,3,9,2,4,8,5,6],[9,6,1,5,3,7,2,8,4],[2,8,7,4,1,9,6,3,5],[3,4,5,2,8,6,1,7,9]];
let solvedBoard2 = [[7,2,1,8,5,3,9,4,6],[4,9,5,6,1,7,8,3,2],[8,3,6,4,2,9,7,5,1],[9,6,7,3,8,4,1,2,5],[2,1,4,7,6,5,3,9,8],[3,5,8,2,9,1,6,7,4],[1,7,2,5,3,6,4,8,9],[6,8,3,9,4,2,5,1,7],[5,4,9,1,7,8,2,6,3]];

describe('testGetNumSolutions', ()=>{
    test('easy one solution board', ()=>{
        expect(getNumSolutions(board1, [])).toEqual(1);
    })

    test('make sure board is unchanged', ()=>{
        getNumSolutions(board1, []);
        expect(board1).toEqual(board1Copy);
    })


    test('hard one solution board', ()=>{
        expect(getNumSolutions(board2, [])).toEqual(1);
    })

    test('two solution board', ()=>{
        expect(getNumSolutions(twoBoard, [])).toEqual(2);
    })

    test('three solution board', ()=>{
        expect(getNumSolutions(threeBoard, [])).toEqual(3);
    })

    test('four solution board', ()=>{
        expect(getNumSolutions(fourBoard, [])).toEqual(4);
    })

    test('ten solution board', ()=>{
        expect(getNumSolutions(tenBoard, [])).toEqual(10);
    })

    test('125 solution board', ()=>{
        expect(getNumSolutions(hundredTwentyFiveBoard, [])).toEqual(125);
    })

    test('zero board', ()=>{
        expect(getNumSolutions(zeroBoard, [])).toEqual(0);
    })
})

describe('testCheckOnlySolution' , ()=>{
    test('easy one solution board', ()=>{
        expect(checkOnlySolution(board1)).toEqual(solvedBoard1);
    })

    test('make sure easy one solution board is unchanged', ()=>{
        checkOnlySolution(board1);
        expect(board1).toEqual(board1Copy);
    })

    test('hard one solution board', ()=>{
        expect(checkOnlySolution(board2)).toEqual(solvedBoard2);
    })

    test('two solution board', ()=>{
        expect(checkOnlySolution(twoBoard)).toEqual(null);
    })

    test('make sure two solution board is unchanged', ()=>{
        checkOnlySolution(twoBoard);
        expect(twoBoardCopy).toEqual(twoBoard)
    })

    test('three solution board', ()=>{
        expect(checkOnlySolution(threeBoard)).toEqual(null);
    })

    test('four solution board', ()=>{
        expect(checkOnlySolution(fourBoard)).toEqual(null);
    })

    test('ten solution board', ()=>{
        expect(checkOnlySolution(tenBoard)).toEqual(null);
    })

    test('125 solution board', ()=>{
        expect(checkOnlySolution(hundredTwentyFiveBoard)).toEqual(null);
    })
})