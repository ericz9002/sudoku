import Canvas from './Canvas.js';
import {useRef} from 'react';

export default function Game(){
    function handleClick(){
        console.log('clicked a button');
    }

    const board = useRef(new Array(9).fill(null).map(() => new Array(9).fill(null)))
    return(
        <>
            <Canvas board = {board}/>
            <button onClick = {handleClick}>New Game</button>
        </>
    )
}