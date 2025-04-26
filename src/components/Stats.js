export default function Stats({numHints, numMistakes, solved, difficulty}){
    if(solved.current){
        const vowels = ['a','e','i','o','u'];
        let victoryMsg;
        if(vowels.includes(difficulty.current[0].toLowerCase())){
            victoryMsg = `Congratulations! You solved an ${difficulty.current} board with ${numMistakes} mistakes and ${numHints} hints`;
        }
        else{
            victoryMsg = `Congratulations! You solved a ${difficulty.current} board with ${numMistakes} mistakes and ${numHints} hints`;
        }
        return(
            <>
                <p>{victoryMsg}</p>
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