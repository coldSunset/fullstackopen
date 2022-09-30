import { OccupationalHealthcareEntry, Diagnosis } from "../types";
import {styled} from '@material-ui/core';
import {Work} from '@material-ui/icons';

interface occupationalPropsType {
  entry: OccupationalHealthcareEntry;
  diagnosesFromState: Diagnosis[];
}
const OccupationalHealthEntryComponent = (
  occupationalProps: occupationalPropsType
) => {
  const { entry, diagnosesFromState } = occupationalProps;
  const diagnoses = diagnosesFromState; 
  console.log('entries: ', entry);
  console.log('diagnoses: ', diagnoses); 
  return (
    <OccupationalEntryDiv>
      <>
        
        {entry.date} <Work/> {entry.employerName}
       
      </>
      <p>{entry.description}</p>
      {entry.diagnosisCodes?.map((diagnosisCodes: string) => (
        <li key={diagnosisCodes}>
          {diagnosisCodes}{" "}
          {diagnoses?.find((d) => d.code === diagnosisCodes)?.name}
        </li>
      ))}
    <p>diagnosed by {entry.specialist}</p>
    </OccupationalEntryDiv>
  );
};

const OccupationalEntryDiv = styled('div')({
  padding: 8,
  borderRadius: 4,
  border: '2px solid black'
});

export default OccupationalHealthEntryComponent;
