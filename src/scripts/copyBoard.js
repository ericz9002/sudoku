//expects 2d array of ints/null and returns copy of it
export default function copyBoard(board){
    let board2 = [];
    for(let i = 0; i < board.length; ++i){
        board2[i] = board[i].slice();
    }
    return board2;
}