//new types
interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

interface CoursePartBaseDescription extends CoursePartBase {
  description: string;
}

interface CourseNormalPart extends CoursePartBaseDescription {
  type: "normal";
  description: string;
}
interface CourseProjectPart extends CoursePartBase {
  type: "groupProject";
  groupProjectCount: number;
}

interface CourseSubmissionPart extends CoursePartBaseDescription {
  type: "submission";
  exerciseSubmissionLink: string;
}

interface CourseSpecicalPart extends CoursePartBase {
  type: "special";
  description: string;
  requirements: string[]; 
}

export type coursePartsType =
  | CourseNormalPart
  | CourseProjectPart
  | CourseSubmissionPart
  | CourseSpecicalPart;
