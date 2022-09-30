import React from "react";
import { coursePartsType } from "../types";
import Part from "./Part";

const Content = (
  { courseParts } : {courseParts: coursePartsType[]}
) => {
  return (
    <div>
      {
        courseParts.map((course,i) =>
     <> 
      <Part key={i} course={course}/>
      <br></br>
    </>
    )}
     
    </div>
  );
};

export default Content;
