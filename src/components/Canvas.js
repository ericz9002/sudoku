import {useState, useEffect, useRef} from 'react';

export default function Canvas({board, updateBoard}){
    function drawGrid(canvas, context, rows, cols){
        if(rows <= 1 || cols <= 1){
            return
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = "black";
        const width = canvas.width;
        const height = canvas.height;
        const yDelta = height / rows;
        const xDelta = width / cols;
        let rowsMap = {}
        for(let row = 0; row <= rows; row++){
            let y = Math.round(row * yDelta)
            rowsMap[row] = y;
            context.beginPath();
            context.moveTo(0, y)
            context.lineTo(width, y);
            context.stroke();
        }
        let colsMap = {}
        for(let col = 0; col <= cols; col++){
            let x = Math.round(col * xDelta)
            colsMap[col] = x;
            context.beginPath();
            context.moveTo(x, 0)
            context.lineTo(x, height);
            context.stroke();
        }
        context.fillText('.', 150, 150);
        return [rowsMap, colsMap]
    }

    function drawBoard(canvas, context, board){
        console.log('inside drawBoard, canvas is ', canvas);
        for(let i = 0; i < board.length; ++i){
            for(let j = 0; j < board[i].length; ++j){
                if(board[i][j] !== null){
                    drawNum(canvas, context, i, j, board.length, board[i].length, board[i][j]);
                }
            }
        }
    }
    
    function drawNum(canvas, context, row, col, numRows, numCols, number){
        const width = canvas.width;
        const height = canvas.height;
        const yDelta = height/ numRows;
        const xDelta = width / numCols;
        const rowsMap = rowsColsMap.current.rowsMap;
        const colsMap = rowsColsMap.current.colsMap;
        const x = colsMap[col] + Math.round(xDelta / 2);
        const y = rowsMap[row] + Math.round(yDelta / 2);   
        if(board[row][col] !== null){
            const currentColor = context.getImageData(x+5, y+5, 1, 1);
            const color = `rgba(${currentColor.data})`;
            colorCell(canvas, context, x, y, color);
            
        }
        context.fillStyle = "black";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = `${Math.round(yDelta / 2)}px Arial`;
        context.fillText(`${number}`, x, y);
        board[row][col] = number;
    }

    function colorCell(canvas, context, x, y, color){
        const xMax = canvas.width;
        const yMax = canvas.height;
        const rowsMap = rowsColsMap.current.rowsMap;
        const colsMap = rowsColsMap.current.colsMap;
        let yLowerBound = 0;
        let yUpperBound = rowsMap[1];
        let selectPosition = [null, null];
        for(let row = 1; row < Object.keys(rowsMap).length; row++){
            yUpperBound = rowsMap[row];
            if(y >= yLowerBound && y < yUpperBound){
                selectPosition[0] = row - 1;
                break;
            }
            yLowerBound = yUpperBound;
        }
        let xLowerBound = 0;
        let xUpperBound = colsMap[1];
        for(let col = 1; col < Object.keys(colsMap).length; col++){
            xUpperBound = colsMap[col];
            if(x >= xLowerBound && x < xUpperBound){
                selectPosition[1] = col - 1;
                break;
            }
            xLowerBound = xUpperBound;
        }
        context.fillStyle = color;
        context.fillRect(xLowerBound + 1, yLowerBound + 1, xUpperBound - xLowerBound - 2, yUpperBound - yLowerBound - 2);
        return selectPosition;
    }

    function selectCell(canvas, context, x, y){
        const selectPosition = colorCell(canvas, context, x, y, "#9af5f2");
        if(board[selectPosition[0]][selectPosition[1]] !== null){
            drawNum(canvas, context, selectPosition[0], selectPosition[1], 9, 9, board[selectPosition[0]][selectPosition[1]]);
        }
        selectedCell.current = selectPosition;
    }

    function unSelectCell(canvas, context, x, y){
        colorCell(canvas, context, x, y, "white");
        const prevRow = selectedCell.current[0];
        const prevCol = selectedCell.current[1];
        if(board[prevRow][prevCol] !== null){
            console.log('here');
            drawNum(canvas, context, prevRow, prevCol, 9, 9, board[prevRow][prevCol]);
        }
        selectedCell.current = null;
    }

    function handleClick(event){
        const canvas = event.target;
        const context = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect()
        const x = canvas.clientX = event.clientX - rect.left;
        const y = canvas.clientY = event.clientY - rect.top;
        if (selectedCell.current !== null){
            const rowsMap = rowsColsMap.current.rowsMap;
            const colsMap = rowsColsMap.current.colsMap;
            const prevCellX = colsMap[selectedCell.current[1]] + 1;
            const prevCellY = rowsMap[selectedCell.current[0]] + 1;
            //check if the click is in the same cell as the previously selected cell
            if(x >= colsMap[selectedCell.current[1]] && x < colsMap[selectedCell.current[1] + 1] && y >= rowsMap[selectedCell.current[0]] && y < rowsMap[selectedCell.current[0] + 1]){
                unSelectCell(canvas, context, prevCellX, prevCellY);
            }
            else{    
                unSelectCell(canvas, context, prevCellX, prevCellY);
                selectCell(canvas, context, x, y);
            }  
        }
        else{
            selectCell(canvas, context, x, y);
        }
    }

    function handleKeyDown(event){
        const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        if(event.key in validKeys && selectedCell.current !== null){
            const canvas = inputRef.current;
            const context = canvas.getContext('2d');
            const [row, col] = selectedCell.current;
            updateBoard(row, col, event.key);
        }
    }
    function handleBlur(event){
        if(selectedCell.current !== null){
            const rowsMap = rowsColsMap.current.rowsMap;
            const colsMap = rowsColsMap.current.colsMap;
            const canvas = inputRef.current;
            const context = canvas.getContext('2d');
            const prevCellX = colsMap[selectedCell.current[1]] + 1;
            const prevCellY = rowsMap[selectedCell.current[0]] + 1;
            unSelectCell(canvas, context, prevCellX, prevCellY);
            selectedCell.current = null;
        }
    }

    const rowsColsMap = useRef([]);
    const inputRef = useRef();
    const selectedCell = useRef(null);
    useEffect(()=>{
        const canvas = inputRef.current;
        const context = canvas.getContext('2d');
        
        const [rowsMap, colsMap] = drawGrid(canvas, context, 9, 9);
        rowsColsMap.current = {"rowsMap":rowsMap, "colsMap":colsMap};
        console.log('upon render, board is ', board);
    }, [])
    useEffect(() =>{
        const canvas = inputRef.current;
        const context = canvas.getContext('2d');
        console.log('canvas is ' , canvas);
        drawGrid(canvas, context, 9, 9);
        drawBoard(canvas, context, board);
    }, [board])


    return(
        <canvas tabIndex="0" height="300" width="300" ref={inputRef} onClick = {(event) => {handleClick(event)}} 
        onKeyDown = {(event)=>{handleKeyDown(event)}} onBlur = {(event) => {handleBlur(event)}}></canvas>
    )
}