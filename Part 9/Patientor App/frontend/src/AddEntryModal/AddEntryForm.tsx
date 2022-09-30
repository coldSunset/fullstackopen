import { Button, Grid } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { SelectField } from "./FormField";
import {  EntrySelect, HealthCheckEntry, HealthCheckRating, HospitalEntry, OccupationalHealthcareEntry } from "../types";
import { DiagnosisSelection, TextField } from "../AddPatientModal/FormField";
import { useStateValue } from "../state";
import { useState } from "react";


export type EntryFormValues = Omit<HospitalEntry, "id">|Omit<OccupationalHealthcareEntry, "id">|Omit<HealthCheckEntry, "id">;

interface Props {
    onSubmit: (values: EntryFormValues) => void; 
    onCancel: () => void; 
}

type EntryOptions = {
    value: EntrySelect;
    label: string;
};

const entryOptions: EntryOptions[] = [
    {value: EntrySelect.HospitalEntry, label: "Hospital"},
    {value: EntrySelect.OccupationalHealthcareEntry, label: "Occupational Healthcare Entry"},
    {value: EntrySelect.HealthCheckEntry, label: "Healthcare"},
];

type RatingOptions = {
  value: HealthCheckRating;
  label: string; 
};

const ratingOptions: RatingOptions[] = [
  {value:HealthCheckRating.Healthy, label: 'Healthy' },
  {value: HealthCheckRating.LowRisk, label: "Low Risk"},
  {value: HealthCheckRating.HighRisk, label: "High Risk"},
  {value: HealthCheckRating.CriticalRisk, label: " Critical Risk"},
];

const hospitalIntialValues : Omit<HospitalEntry, "id"> = {
  date: "12/12/2022",
  type: "Hospital",
  specialist: "",
  diagnosisCodes: [] ,
  description: "",
  discharge: {
    date: '',
    criteria: ''
  }
};

const occupationalInitialValues : Omit<OccupationalHealthcareEntry, "id"> = {
  date: "11/11/2011",
  type: "OccupationalHealthcare",
  specialist: "",
  diagnosisCodes: [] ,
  description: "",
  employerName:"",
  sickLeave: {
    startDate:'',
    endDate:''
  }
};

const healthCheckInitialValues : Omit<HealthCheckEntry, "id"> = {
  date: "11/11/2011",
  type: "HealthCheck",
  specialist: "",
  diagnosisCodes: [] ,
  description: "",
  healthCheckRating:0,
};
export const AddEntryForm = ({onSubmit,onCancel}: Props) => {
    const [{ diagnoses }] = useStateValue();
    console.log("diagnoses",diagnoses);
    const [initialValues, setInitialValues] = useState<Omit<HospitalEntry, "id">|Omit<OccupationalHealthcareEntry, "id">|Omit<HealthCheckEntry, "id">>(hospitalIntialValues);
  
    const chooseType = (type: string) => {
      switch (type){
      case "Hospital":
        return hospitalIntialValues;
      case "OccupationalHealthcare":
        return occupationalInitialValues;
      case "HealthCheck":
        return healthCheckInitialValues;
      }
      return hospitalIntialValues;
    };

    return(
        <Formik
          initialValues={initialValues}
           onSubmit={onSubmit}
           validate={(values) => {
             const requiredError = "Field is required";
             const errors : {[field: string]: string} = {}; 
            if (!values.date) {
              errors.date = requiredError;
            }
            if (!values.type) {
              errors.type = requiredError; 
            }
            if (!values.specialist) {
              errors.specialist = requiredError;
            }
            if (!values.diagnosisCodes) {
              errors.diagnosisCodes = requiredError; 
            }
            return errors; 
           }}
           >
              {( { isValid, dirty, setFieldValue, setFieldTouched, values  } ) => {
                console.log("values", values.type);
                 setInitialValues(chooseType(values.type));
             return (
               <Form className="form ui">
                  <Field 
                    label="Date"
                    placeholder="Date"
                    name="date"
                    component={TextField}/>
                    <Field 
                    label="Specialist"
                    placeholder="Specialist"
                    name="specialist"
                    component={TextField}/>
                    {values.type === "OccupationalHealthcare" && <Field 
                    label="Employer Name"
                    placeholder="EmployerName"
                    name="employerName"
                    component={TextField}/>}
                    {diagnoses && <DiagnosisSelection 
                                setFieldValue={setFieldValue}
                                setFieldTouched={setFieldTouched}
                                diagnoses={Object.values(diagnoses)}/>}
                    <Field
                    label="Description"
                    placeholder="Description"
                    name="description"
                    component={TextField}/>
                    {values.type === "OccupationalHealthcare" &&<Field
                    label="Sick-leave Start Date"
                    placeholder="start date"
                    name="sickLeave.startDate"
                    component={TextField}/>}
                    {values.type === "OccupationalHealthcare" &&<Field
                    label="Sick-leave End Date"
                    placeholder="end date"
                    name="sickLeave.endDate"
                    component={TextField}/>}
                    {values.type === "Hospital" &&<Field
                    label="Discharge date"
                    placeholder="Discharge date"
                    name="discharge.date"
                    component={TextField}/>}
                    {values.type === "Hospital" &&<Field
                    label="Discharge criteria"
                    placeholder="Discharge criteria"
                    name="discharge.criteria"
                    component={TextField}/>}
                    {values.type === "HealthCheck"&&<SelectField label="Health Rating" name="healthCheckRating" options={ratingOptions} />}
                    <SelectField label="Type" name="type" options={entryOptions} />
                  <Grid>
                      <Grid >
                      <Button
                        color="secondary"
                        variant="contained"
                        style={{ float: "left" }}
                        type="button"
                        onClick={onCancel}
                        >
                        Cancel
                        </Button>
                      </Grid>
                          <Grid >
                          <Button
                            style={{
                                float: "right",
                            }}
                            type="submit"
                            variant="contained"
                            disabled={!dirty || !isValid}
                            >
                            Add
                            </Button>
                          </Grid>
                  </Grid>
               </Form>
                ); 
              }} 
        </Formik>
    );
}; 

export default AddEntryForm; 