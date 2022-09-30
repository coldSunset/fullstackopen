import { NewPatientEntry, Gender, Entry, DiagnosisEntry, DischargeEntry, NewHospitalEntry, NewOccupationalHealthcareEntry, SickLeaveEntry, NewHealthCheckEntry, HealthCheckRating, NewJournalEntry } from "../types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error("Incorrect or missing name");
  }

  return name;
};

const parseDescription = (description: unknown): string => {
  if (!description || !isString(description)) {
    throw new Error("Incorrect or missing description");
  }

  return description; 
}

const parseSpecialist = (specialist: unknown): string => {
  if(!specialist || !isString(specialist)) {
    throw new Error("Incorrect or missing specialist name"); 
  }

  return specialist; 
}

const parseDateOfBirth = (dateOfBirth: unknown): string => {
  if (!dateOfBirth || !isString(dateOfBirth)) {
    throw new Error("Incorrect or missing date of birth");
  }
  return dateOfBirth;
};

const parseDate = (date: unknown): string => {
  if(!date || !isString(date)) {
    throw new Error("Incorrect or missing date"); 
  }
  return date; 
}

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error("Incorrect or missing occupation");
  }
  return occupation;
};

const parseEmployerName = (employerName: unknown): string => {
  if(!employerName || !isString(employerName)) {
    throw new Error("Incorrect or missing employer name");
  }
  return employerName; 
}

const parseSickLeave = (sickLeave: unknown): SickLeaveEntry => {
  if (!sickLeave || !isSickLeave(sickLeave)) {
    throw new Error("Incorrect or missing sick leave");
  }
  return sickLeave; 
}

const parseHealthCheckRating = (healthCheckRating: unknown): HealthCheckRating => {
  if(!healthCheckRating || !isHealthCheckRating(healthCheckRating)){
    throw new Error("Incorrect or missing Health check rating");
  }
  return healthCheckRating; 
}

const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param); 
  
}

const isSickLeave = (sickLeave: unknown): sickLeave is SickLeaveEntry => {
  return(
    (((sickLeave as SickLeaveEntry).startDate) !== undefined) &&
    (((sickLeave as SickLeaveEntry).endDate) !== undefined)
  )
}
export const isDischargeEntry = (discharge:unknown): discharge is DischargeEntry => {
  return (
          (((discharge as DischargeEntry).date) !== undefined) &&
          (((discharge as DischargeEntry).criteria) !== undefined)
         );
  
}

export const isStringArray = (value: unknown): value is Entry[] => {
  return Array.isArray(value);
};

const isStringArrayDiag = (value: unknown): value is Array<DiagnosisEntry["code"]> => {
  return Array.isArray(value) && value.every((val) => isString(val)); 
}

export const parseEntry = (entries: unknown): Entry[] => {
  if (!entries || !isStringArray(entries)) {
    throw new Error("Incorrect or missing entries");
  }
  return entries;
};

export const parseDischarge = (discharge: unknown): DischargeEntry => {
  if (!discharge || !isDischargeEntry(discharge)) {
    throw new Error("Incorrect or missing discharge entry")
  }
  return discharge; 
}

const parseDiagnosisCodes = (diagnosisCodes: unknown): Array<DiagnosisEntry["code"]> => {
  if (!diagnosisCodes || !isStringArrayDiag(diagnosisCodes)) {
    throw new Error("Incorrect or missing diagnosis codes")
  }
  return diagnosisCodes; 
}

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error("Incorrect or missing gender");
  }
  return gender;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error("Incorrect or missing ssn: " + ssn);
  }
  return ssn;
};

type Fields = {
  name: unknown;
  ssn: unknown;
  dateOfBirth: unknown;
  occupation: unknown;
  gender: unknown;
  entries: unknown;
};

const toNewPatientEntry = ({
  name,
  ssn,
  dateOfBirth,
  occupation,
  gender,
  entries,
}: Fields): NewPatientEntry => {
  const newPatient: NewPatientEntry = {
    name: parseName(name),
    ssn: parseSsn(ssn),
    dateOfBirth: parseDateOfBirth(dateOfBirth),
    occupation: parseOccupation(occupation),
    gender: parseGender(gender),
    entries: parseEntry(entries),
  };

  return newPatient;
};

interface BaseEntryFields {
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<DiagnosisEntry["code"]>|undefined;
}

export type EntryFields = {
  type:unknown;
  description: unknown;
  date: unknown;
  specialist: unknown;
  diagnosisCodes?: unknown;
  discharge?: unknown;
  employerName?: unknown;
  sickLeave?: unknown; 
  healthCheckRating?: unknown; 
}

const assertNever = (value: unknown): never => {
  throw new Error(
    `Invalid entry type: ${JSON.stringify(value)}`
  );
};




export const toNewJournalEntry = ({
  type,
  description,
  date,
  specialist,
  diagnosisCodes, 
  discharge, 
  employerName,
  sickLeave,
  healthCheckRating
}: EntryFields) : NewJournalEntry =>  { 
  let newBaseEntryField : BaseEntryFields = {
    description: parseDescription(description),
    date: parseDate(date),
    specialist: parseSpecialist(specialist),
  }
  if(diagnosisCodes){
    newBaseEntryField = {diagnosisCodes:parseDiagnosisCodes(diagnosisCodes), ...newBaseEntryField}
  }
  switch (type) {
    case "Hospital":
      let hospitalRemainderFields = {
        type: type,
        discharge: parseDischarge(discharge)
       };
      const newHospitalEntry: NewHospitalEntry = {...newBaseEntryField, ...hospitalRemainderFields}
      return newHospitalEntry; 
    case "OccupationalHealthcare":
      const occupationalRemainderFields = { 
        type: type, 
        employerName: parseEmployerName(employerName),
        sickLeave: parseSickLeave(sickLeave)
       };
      const newOccupationalHealthEntryField: NewOccupationalHealthcareEntry = {...newBaseEntryField, ...occupationalRemainderFields}
      return newOccupationalHealthEntryField;
    case "HealthCheck":
      const healthCheckRemainderFields = {
        type: type, 
        healthCheckRating: parseHealthCheckRating(healthCheckRating)
      };
      const newHealthCheckEntry: NewHealthCheckEntry = {...newBaseEntryField, ...healthCheckRemainderFields} 
      return newHealthCheckEntry;
    default:
      return assertNever(type);
  }
}

export default {toNewPatientEntry, toNewJournalEntry};
