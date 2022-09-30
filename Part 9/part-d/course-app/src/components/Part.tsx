import { assert } from "console";
import React from "react";
import { coursePartsType } from "../types";

const Part = ({course}: {course: coursePartsType})=> {
  console.log("course: ", course);

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    ); 
  }
  const typeCheck = (course:coursePartsType) => {
    switch(course.type){
      case "normal":
        return (
         <i> {course.description}</i>
        )
      case "groupProject":
        return(
          <>project exercises {course.groupProjectCount}</>
        )
      case 'submission':
        return(
          <>
          <i>{course.description}</i> <br></br>
          <>{course.exerciseSubmissionLink}</>
        </>
        ) 
      case 'special':
        return(
          <>
          <i> {course.description}</i><br></br>
          requied skills: {course.requirements[0]}, {course.requirements[1]}
          </>
        )
        break; 

      default:
        return assertNever(course)
    }
  }
  return (
    <div>
  <><b>{course.name}</b> {course.exerciseCount}</>
    <div>
    {
      typeCheck(course) 
    }
   
    </div>
    </div>
  );
};

export default Part
