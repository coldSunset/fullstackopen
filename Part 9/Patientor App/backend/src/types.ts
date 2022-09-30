export interface DiagnosisEntry {
  code: string;
  name: string;
  latin?: string;
}

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<DiagnosisEntry["code"]>;
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}

export interface DischargeEntry {
  date: string;
  criteria: string;
}

export interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

export interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: DischargeEntry;
}

export interface SickLeaveEntry {
  startDate: string;
  endDate: string;
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: SickLeaveEntry;
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

export interface PatientEntry {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export type NewPatientEntry = Omit<PatientEntry, "id">;

export type NonSensitivePatientEntry = Omit<PatientEntry, "ssn" | "entries">;

export type NewHospitalEntry = Omit<HospitalEntry, "id">; 

export type NewOccupationalHealthcareEntry = Omit<OccupationalHealthcareEntry, "id"> ;

export type NewHealthCheckEntry = Omit<HealthCheckEntry, "id">; 

export type NewJournalEntry  = 
  |NewHospitalEntry
  |NewOccupationalHealthcareEntry
  |NewHealthCheckEntry;