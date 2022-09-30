import { InputLabel, MenuItem, Select } from "@material-ui/core";
import { Field, FieldProps } from "formik";
import { EntrySelect, HealthCheckRating } from "../types";

type EntryOption = {
    value: EntrySelect;
    label: string;
};

type RatingOption = {
  value: HealthCheckRating;
  label: string; 
}; 

type SelectFieldProps = {
    name: string;
    label: string;
    options: EntryOption[]|RatingOption[];
  };
  
  const FormikSelect = ({ field, ...props }: FieldProps) => <Select {...field} {...props} />;
  
  export const SelectField = ({ name, label, options }: SelectFieldProps) => (
    <>
      <InputLabel>{label}</InputLabel>
      <Field
        fullWidth
        style={{ marginBottom: "0.5em" }}
        label={label}
        component={FormikSelect}
        name={name}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label || option.value}
          </MenuItem>
        ))}
      </Field>
    </>
  );