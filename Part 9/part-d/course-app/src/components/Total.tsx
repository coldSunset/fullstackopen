import { coursePartsType } from "../types";

const Total = ({ courseParts }: { courseParts: Array<coursePartsType> }) => {
  return (
    <p>
      Number of exercises{" "}
      {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </p>
  );
};

export default Total;
