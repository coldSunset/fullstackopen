import { HealthCheckEntry, Diagnosis, HealthCheckRating } from "../types";
import {styled} from '@material-ui/core';
import {CheckBox, Favorite} from '@material-ui/icons';

interface healthCheckPropsType {
  entry: HealthCheckEntry;
  diagnosesFromState: Diagnosis[];
}

const HealthCheckEntryComponent = (healthCheckProps: healthCheckPropsType) => {
  const { entry, diagnosesFromState } = healthCheckProps; 
  const diagnoses = diagnosesFromState;
  console.log('entries: ', entry);
  console.log('diagnoses: ', diagnoses); 

  const getRatingColour = (healthCheckRating: HealthCheckRating) => {
    console.log("health check rating; ",healthCheckRating );
    switch (healthCheckRating) {
      case 0:
        return "darkgreen";
      case 1:
        return "yellow";
      case 2:
        return "orange";
      case 3:
        return "red";
      default:
        return "black";
    }
  };
  return (
    <HealthCheckEntryDiv>
      <>
        
        {entry.date} <CheckBox/> 
       
      </>
      <p>{entry.description}</p>
      <Favorite style={{fill: `${getRatingColour(entry.healthCheckRating)}`}}/>
      {entry.diagnosisCodes?.map((diagnosisCodes: string) => (
        <li key={diagnosisCodes}>
          {diagnosisCodes}{" "}
          {diagnoses?.find((d) => d.code === diagnosisCodes)?.name}
        </li>
      ))}
    <p>diagnosed by {entry.specialist}</p>
    </HealthCheckEntryDiv>
  );
};

const HealthCheckEntryDiv = styled('div')({
  padding: 8,
  borderRadius: 4,
  border: '2px solid black'
});

export default HealthCheckEntryComponent;
