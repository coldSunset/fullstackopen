import { Diagnosis, HospitalEntry } from "../types";
import {styled} from '@material-ui/core';
import {LocalHospital} from '@material-ui/icons';
interface HospitalPropsType {
  entry: HospitalEntry;
  diagnosesFromState: Diagnosis[];
}
const HospitalEntryComponent = (hospitalProps: HospitalPropsType) => {
  const { entry, diagnosesFromState } = hospitalProps;
  const diagnoses = diagnosesFromState; 
  console.log("entry", entry);
  console.log("diagnoses", diagnoses);
  return (
    <>
    <HospitalEntryDiv>
      <>
        
        {entry.date} <LocalHospital/>
       
      </>
      <p>{entry.description}</p>
      {entry.diagnosisCodes?.map((diagnosisCodes: string) => (
        <li key={diagnosisCodes}>
          {diagnosisCodes}{" "}
          {diagnoses?.find((d) => d.code === diagnosisCodes)?.name}
        </li>
      ))}
    <p>diagnosed by {entry.specialist}</p>
    </HospitalEntryDiv>
    </>
    
  );
};

const HospitalEntryDiv = styled('div')({
  padding: 8,
  borderRadius: 4,
  border: '2px solid black'
});

export default HospitalEntryComponent;
