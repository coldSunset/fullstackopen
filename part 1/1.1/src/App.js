import React from 'react' 

const App = () =>{
  const course = {
  name: "Half Stack Application development",
  parts : [
   {
    name:'Fundamentals of React',
  exercises : 10
  }, 
   {
    name: 'Using props to pass data',
  exercises : 7
  },
  {
    name: 'State of a component',
  exercises : 14
  }
]
  }

  const Header = (props) =>{
        return(<h1>{props.course}</h1>)
  }

  const Content = (props) =>{
    console.log(props); 
    const Part = (props_p) =>
    {
      return(
     <p>{props_p.partno} {props_p.exercisesno}</p>
      )
    }
    return(<div>
              <Part partno={props.parts[0].name} exercisesno={props.parts[0].exercises}/>
              <Part partno={props.parts[1].name} exercisesno={props.parts[1].exercises}/>
              <Part partno={props.parts[2].name} exercisesno={props.parts[2].exercises}/>
          </div>)
  }

  const Total = (props) =>{
    console.log(props); 
    return(<div>
      <p>Number of exercises = {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}</p>
    </div>)
  }

  return(
    <div>
      <Header course={course.name} />
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
  </div>
  )
}

export default App