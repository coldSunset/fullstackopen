import React, {useState} from "react";

//exercise 1
/* const History = (props) => {
  if(props.allClicks.length ===0){
    return(
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }
  return(
    <div> 
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  const [left, setLeft] = useState(0); 
  const [right, setRight] = useState(0); 
	const [allClicks, setAll] = useState([]); 

  const handleLeftClick = () =>{
    setAll(allClicks.concat('L')); 
    setLeft(left+1); 
  } 

  const handleRightClick = () => 
  {
    debugger
    setAll(allClicks.concat('R')); 
    setRight(right+1); 
  }

	return(
	<div>
    {left}
    <Button handleClick={handleLeftClick} text='left'/>
    <Button handleClick={handleRightClick} text='right'/>
    {right}
    <History allClicks={allClicks}/>
  </div>
)
} */
// end exercise 1

//start of exercise 2

const Display = props => <div>{props.value}</div>

const Button = (props) =>(
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)
const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = (newValue) =>{
    setValue(newValue)
  }

  return(
    <div>
      <Display value={value} /> 
      <Button handleClick={() => setToValue(1000)} text="thousand"/>
      <Button handleClick={() => setToValue(0)} text="reset"/>
      <Button handleClick={() => setToValue(value + 1)} text="increment"/>
    </div>
  )
}
//end exercise 2

export default App;
