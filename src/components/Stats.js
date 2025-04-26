export default function Stats({numHints, numMistakes, solved}){
    if(solved.current){
        return(
            <>
                <span>Solved board with {numMistakes} mistakes and using {numHints} hints</span>
            </>
        )
    }
    else{
        return(
            <>
                <span>Hints used: {numHints}</span>
                <span>Mistakes made: {numMistakes}</span>
            </>
        )        
    }
}