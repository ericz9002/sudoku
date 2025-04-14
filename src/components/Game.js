import Canvas from './Canvas.js';
import {useRef, useState} from 'react';

export default function Game(){
    function handleClick(){
        board.current = new Array(9).fill(null).map(() => new Array(9).fill(1));
    }

    const [timesRestarted, setTimesRestarted] = useState(0);
    const board = useRef(new Array(9).fill(null).map(() => new Array(9).fill(null)))
    return(
        <>
            <Canvas board = {board}/>
            <button onClick = {handleClick}>New Game</button>
        </>
    )
}