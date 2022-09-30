import React, { useState } from "react";
import axios from "axios";
import { Box, Button } from "@material-ui/core";
import { Entry, Patient } from "../types";
import { apiBaseUrl } from "../constants";
import { useParams } from "react-router-dom";
import HospitalEntryComponent from "./HospitalEntry";
import OccupationalHealthEntryComponent from "./OccupationalHealthEntry";
import HealthCheckEntryComponent from "./HealthCheckEntry";
import AddEntryModal from "../AddEntryModal";
import { EntryFormValues } from "../AddEntryModal/AddEntryForm";
import { useStateValue } from "../state";

const UserListPage = () => {
  const [patient, updatePatient] = useState<Patient>();
  const [entries, updateEntries] = useState<Entry[]>();
  const [error, setError] = React.useState<string>(); 
  const [{ diagnoses }] = useStateValue();
  const { id } = useParams<{ id: string }>();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);

  const openModal = (): void => setModalOpen(true);
  const closeModal = (): void => {
    setModalOpen(false);
  };

  const submitNewEntry = (values: EntryFormValues) => {
    console.log("submitting new entry placeholder", values); 
    if(id){
      (async () => {
      try {
          console.log("axios request sent");
          const { data: newEntryData } = await axios.post<Entry>(
          `${apiBaseUrl}/patients/${id}/entries`,
          values
        );
        console.log('axios returned value: ', newEntryData);
      
        
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          console.error(e?.response?.data || "Unrecognized axios error");
          setError(
            String(e?.response?.data?.error) || "Unrecognized axios error"
          );
        } else {
          console.error("Unknown error", e);
          setError("Unknown error");
        }
        
      }
    })().catch((error) => console.log("this is an error",error));
  }
  };
  console.log("UserListPage Id is:", id);

  React.useEffect(() => {
    const fetchPatientList = async () => {
      try {
        const { data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id as string}`
        );
        console.log("this is the patient", patientFromApi);
        console.log("this is the entries", patientFromApi.entries);
        updatePatient(patientFromApi);
        updateEntries(patientFromApi.entries);
      } catch (e) {
        console.error(e);
      }
    };

    void fetchPatientList();
  }, []);

  /**
   * Helper function for exhaustive type checking
   */
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  const EntryDetails: React.FC<{
    entry: Entry;
  }> = ({ entry }) => {
    const diagnosesFromState = Object.values(diagnoses);
    switch (entry.type) {
      case "Hospital":
        const hospitalProps = { entry, diagnosesFromState };
        return <HospitalEntryComponent {...hospitalProps} />;
      case "OccupationalHealthcare":
        const occupationalProps = { entry, diagnosesFromState };
        return <OccupationalHealthEntryComponent {...occupationalProps} />;
      case "HealthCheck":
        const healthCheckProps = { entry, diagnosesFromState };
        return <HealthCheckEntryComponent {...healthCheckProps} />;
      default:
        return assertNever(entry);
    }
  };
  
  return (
    <div className="App">
      <Box>
        <h1>{patient?.name}</h1>
        <div>ssh: {patient?.ssn}</div>
        <div>occupation: {patient?.occupation}</div>
        <h2>
          <span style={{ fontWeight: "bold" }}>entries</span>
        </h2>
        {entries?.map((entries: Entry) => (
          <div key={entries.id}>
            <p>
              <EntryDetails entry={entries} />
            </p>
          </div>
        ))}
      </Box>
      <AddEntryModal 
        modalOpen={modalOpen}
        onClose={closeModal}
        error={error}
        onSubmit={submitNewEntry}/>
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>
    </div>
  );
};

export default UserListPage;
