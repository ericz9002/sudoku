export default function Stats({numHints, numMistakes, solved, currentDifficulty}){
    if(solved.current){
        const vowels = ['a','e','i','o','u'];
        let victoryMsg;
        if(vowels.includes(currentDifficulty.current[0].toLowerCase())){
            victoryMsg = `Congratulations! You solved an ${currentDifficulty.current} board with ${numMistakes} mistakes and ${numHints} hints`;
        }
        else{
            victoryMsg = `Congratulations! You solved a ${currentDifficulty.current} board with ${numMistakes} mistakes and ${numHints} hints`;
        }
        return(
            <>
                <p id="victoryMsg">{victoryMsg}</p>
            </>
        )
    }
    else{
        return(
            <>
                <div id="stats">
                    <p>Hints used: {numHints}</p>
                    <p>Mistakes made: {numMistakes}</p>
                </div>
            </>
        )        
    }
}