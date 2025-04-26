import {useEffect, useState} from 'react';

export default function Button({newGame, solveBoard, solveCell, difficulty, selectedCell}){
    return(
        <>
            <button onClick = {newGame}>New Game</button>
            <button onClick = {solveBoard}>Show Solution</button>
            <button id = "solveCell" onClick = {solveCell} disabled = {selectedCell === null ? true : false}>Solve Cell</button>
            <button onClick = {solveCell}>test</button>
            <label>
                Difficulty:
                <select defaultValue="Easy" onChange = {(event) => difficulty.current = event.target.value}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </label>
        </>
    )
}