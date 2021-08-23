import React from 'react' 

const Header = (props) =>{
  return(<h1>{props.course}</h1>)
}

const Content = (props) =>{
  //console.log(parts); 
  const Part = (props_p) =>
  {
    return(
   <p>{props_p.partno} {props_p.exercisesno}</p>
    )
  }
  return(<div>
          {props.parts.map(part => <p key={part.id}>{part.name} {part.exercises}</p>)}
        </div>)
}

const Total = (props) =>{
  console.log(props); 
  
  const parts = props.parts.map(part => part.exercises)
  return(<div>
    <p><strong>total of exercises = {parts.reduce((s,p)=>s+p)}</strong></p>
  </div>)
}

const Course = ({course}) => {
  return(
      <div>
      <Header course={course.name} />
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
      
  </div>
  )
}

const App = () => {
  const courses = [
      {
        name: 'Half Stack application development',
        id: 1,
        parts: [
          {
            name: 'Fundamentals of React',
            exercises: 10,
            id: 1
          },
          {
            name: 'Using props to pass data',
            exercises: 7,
            id: 2
          },
          {
            name: 'State of a component',
            exercises: 14,
            id: 3
          },
          {
            name: 'Redux',
            exercises: 11,
            id: 4
          }
        ]
      }, 
      {
        name: 'Node.js',
        id: 2,
        parts: [
          {
            name: 'Routing',
            exercises: 3,
            id: 1
          },
          {
            name: 'Middlewares',
            exercises: 7,
            id: 2
          }
        ]
      }
    ]

  //return <Course course={course} />
  return(
     <div> <Course course={courses[0]}/>
      <Course course={courses[1]}/>
      </div>
    )
}

export default App