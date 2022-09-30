import patients from "../../data/patients";
import { v1 as uuid } from "uuid";
import {
  Entry,
  NewJournalEntry,
  NewPatientEntry,
  NonSensitivePatientEntry,
  PatientEntry,
} from "../types";

const getPatients = (): PatientEntry[] => {
  return patients;
};

const getPatient = (id: string): PatientEntry | undefined => {
  return patients.find((patient) => patient.id == id);
};

const getNonSensitivePatients = (): NonSensitivePatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (patient: NewPatientEntry): PatientEntry => {
  const newPatientEntry = {
    id: uuid(),
    ...patient,
  };
  patients.push(newPatientEntry);
  console.log(newPatientEntry);
  console.log(patients);
  return newPatientEntry;
};

const addEntry = (entry: NewJournalEntry, id: string): Entry => {
  const newEntry = {
    id: uuid(), 
    ...entry,
  };
  let findPatient = patients.find((patient) => patient.id == id); 
  if(findPatient){
    findPatient.entries.push(newEntry); 
  }
  else{
    throw new Error('Patient not found in database'); 
  }
  
  let updatedPatients = patients.filter((patient) => patient.id !== id);
  updatedPatients?.push(findPatient); 
  console.log(updatedPatients);
  return newEntry; 
}

export default { getPatients, getNonSensitivePatients, addPatient, getPatient, addEntry };
