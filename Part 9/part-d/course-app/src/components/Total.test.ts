interface coursePartsType {
  name: string;
  exerciseCount: number;
}

const courseParts: Array<coursePartsType> = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
  },
];

console.log(courseParts.reduce((carry, part) => carry + part.exerciseCount, 0));

export {};
