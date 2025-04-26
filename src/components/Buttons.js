import {useEffect, useState} from 'react';

export default function Button({newGame, solveBoard, solveCell, difficulty, selectedCell, solved}){
    return(
        <>
            <button onClick = {newGame}>New Game</button>
            <button onClick = {solveBoard} disabled = {solved.current}>Show Solution</button>
            <button id = "solveCell" onClick = {solveCell} disabled = {selectedCell === null ? true : false}>Solve Cell</button>
            <label>
                Difficulty:
                <select defaultValue="Easy" onChange = {(event) => difficulty.current = event.target.value}>
                    <option value="Very Easy">Very Easy</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </label>
        </>
    )
}