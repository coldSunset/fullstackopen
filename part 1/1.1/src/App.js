import React from 'react' 

const App = () =>{
  const course = "Half Stack Application development"
  const part1 = 'Fundamentals of React'
  const exercises1 = 10 
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  const Header = (props) =>{
        return(<h1>{props.course}</h1>)
  }

  const Content = (props) =>{
    const Part = (props_p) =>
    {
      return(
     <p>{props_p.partno} {props_p.exercisesno}</p>
      )
    }
    return(<div><p>
              <Part partno={props.part1} exercisesno={props.exercises1}/>
              <Part partno={props.part2} exercisesno={props.exercises2}/>
              <Part partno={props.part3} exercisesno={props.exercises3}/></p>
          </div>)
  }

  const Total = (props) =>{
    return(<div>
      <p>Number of exercises = {props.exercises1 + props.exercises2 + props.exercises3}</p>
    </div>)
  }

  return(
    <div>
      <Header course={course} />
      <Content part1={part1} exercises1={exercises1} part2={part2} exercises2={exercises2} part3={part3} exercises3={exercises3}/>
      <Total exercises1={exercises1} exercises2={exercises2} exercises3={exercises3}/>
  </div>
  )
}

export default App