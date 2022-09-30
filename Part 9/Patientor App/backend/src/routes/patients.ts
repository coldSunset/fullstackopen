import express from "express";
import patientService from "../services/patientService";
import utils from "../services/utils";
const router = express.Router();

router.get("/", (_req, res) => {
  //res.send(patientService.getPatients());
  res.send(patientService.getNonSensitivePatients());
});

router.get("/:id", (_req, res) => {
  res.send(patientService.getPatient(_req.params.id));
});

router.post("/", (_req, res) => {
  try {
    const newPatientEntry = utils.toNewPatientEntry(_req.body);

    const addedPatient = patientService.addPatient(newPatientEntry);
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

router.post("/:id/entries", (_req, res) => {
  try {
   const newJournalEntry = utils.toNewJournalEntry(_req.body);
   const addedEntry = patientService.addEntry(newJournalEntry, _req.params.id);
   res.json(addedEntry);  
  } catch (error: unknown) {
    let errorMessage = "Something went wrong. "; 
    if(error instanceof Error) {
      errorMessage  += " Error: " + error.message; 
    }
    res.status(400).send(errorMessage); 
  }
}); 

export default router;
