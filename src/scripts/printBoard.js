export function printBoard(board){
    console.log('called printBoard, printing board:');
    for(let row of board){
        for(let ele of row){
            if(ele === null){
                process.stdout.write('.  ');
            }
            else{
                process.stdout.write(`${ele}  `);
            }
        }
        process.stdout.write('\n');
    }
}