import React,{useState} from "react";

//unicafe exercise
/*
const Display = ({statistic}) => <div>{statistic}</div>

//a proper place to define a component
const Statistics = (props) => {
  const good=props.good,neutral=props.neutral,bad=props.bad
  const total = good+neutral+bad
  if((total) ===0){
  return(
    <table><tbody><tr><td>No feedback given</td></tr></tbody>
    </table>
)}
  else {return(
    <table><tbody>
      <tr><td>all</td><td>{props.good+ props.bad + props.neutral}</td></tr> 
      <tr><td>average</td><td>{(good*1+bad*(-1)+neutral*0)/(total)}</td></tr>
      <tr><td>postive</td><td>{(good*100)/(total)}%</td></tr>
    </tbody></table>
  )}
}

const StatisticLine = (props) =>{

  return(
    <table><tbody><tr><td>{props.text}</td><td>{props.value}</td></tr></tbody>
    </table>
  )
}

const Button = ({func, param, text}) => {
  const func_handler = () =>{
          func(param+1)
  }
  return(
    <button onClick = {func_handler}>
      {text}
    </button>
  )
}

const App= () => {
  //save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [avg, setAvg] = useState(0)
  const [perPos, setperPos] = useState(0) 


  return(
    <div>
     <h1><strong>give feedback</strong></h1>
     <Button func={setGood} param={good} text="good"/>
     <Button func={setNeutral} param={neutral} text="neutral"/>
     <Button func={setBad} param={bad} text="bad"/>
     <h1><strong>statistics</strong></h1>
       <StatisticLine text="good" value={good}/>
       <StatisticLine text="neutral" value={neutral}/>
       <StatisticLine text="bad" value={bad}/>
       <Statistics good={good} bad={bad} neutral={neutral}/>
    </div>
  )
}
export default App;
*/ 
//unicafe exercise end 


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]



  const [selected, setSelected] = useState(0)
  const [voteCount, setVoteCount] = useState([0,0,0,0,0,0,0])
  const [maxVote, setMaxVote] = useState([0,0])
  

  const castVote = () => {
    const voteCount_copy = {...voteCount}
    const maxVote_copy = {...maxVote}
    voteCount_copy[selected] += 1
    if(voteCount_copy[selected] > maxVote[0])
    {
      setMaxVote([voteCount_copy[selected],selected])
    }

    return(
      setVoteCount(voteCount_copy)
    )
  }

  const genRand = () => {
    console.log(selected)
    return(
      setSelected(Math.floor(Math.random()*7))
    )
  }
  return(
    <div>
      <h1>Anecdote of the day</h1>
      <div>{anecdotes[selected]}</div>
      <div>has {voteCount[selected]} votes</div>
      <button onClick={castVote}>vote</button>
      <button onClick={genRand} >next anecdote</button>
      <h1> Anecdote with the most votes</h1>
      <div>{anecdotes[maxVote[1]]}</div>
      <div>has {maxVote[0]}</div>
    </div>
  )
}



export default App 
