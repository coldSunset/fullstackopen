
import { EntryFields, isDischargeEntry, isStringArray, parseDischarge, parseEntry, toNewJournalEntry } from "../src/services/utils";

const mockNewHospitalData : EntryFields= {
    date: "2015-01-02",
    type: "Hospital",
    specialist: "MD House",
    diagnosisCodes: ["S62.5"],
    description:
      "Healing time appr. 2 weeks. patient doesn't remember how he got the injury.",
    discharge: {
      date: "2015-01-16",
      criteria: "Thumb has healed.",
    }
  }

  const dischargeMod : EntryFields = {
    date: "2015-01-02",
    type: "Hospital",
    specialist: "MD House",
    diagnosisCodes: ["S62.5"],
    description:
      "Healing time appr. 2 weeks. patient doesn't remember how he got the injury.",
    discharge: {
      criteria: "Thumb has healed.",
    }
  }

describe('typeguard tests for parsing new Hospital Entry data', () => {

  test('validate new Hospital Entry Data throws no error', () => {
    expect(toNewJournalEntry(mockNewHospitalData)).toEqual(mockNewHospitalData);
  });

  test('validating incorrect Hospital Entry data throws error', () => {
    const {date, ...dateRemoved} = mockNewHospitalData; 
    expect(()=> {
      toNewJournalEntry(dateRemoved as EntryFields)
    }).toThrowError();
  });

  test('validating Hospital Entry with missing type throws error', () => {
    const {type, ...typeRemoved } = mockNewHospitalData; 
    expect(() => {
      toNewJournalEntry(typeRemoved as EntryFields);
    }).toThrowError();
  })

  test('missing field in discharge data', () => {
    expect(() => {
      toNewJournalEntry(dischargeMod as EntryFields);
    }).toThrowError(); 
  })

})

const incorrectDischarge = {
  criteria: "Thumb has healed."
}; 

describe('test Discharge entry typeguards',() => {

  test('parsing incorrect discharge entry should throw error', () => {
    expect(() => {
      parseDischarge(incorrectDischarge)
    }).toThrowError(); 
  })

  test('test isDischarge with incorrect entry should return false', () => {
    expect(isDischargeEntry(incorrectDischarge)).toBeFalsy();
  })

})

const mockOccupationalHealthCare = {
  id: "fcd59fa6-c4b4-4fec-ac4d-df4fe1f85f62",
  date: "2019-08-05",
  type: "OccupationalHealthcare",
  specialist: "MD House",
  employerName: "HyPD",
  diagnosisCodes: ["Z57.1", "Z74.3", "M51.2"],
  description:
    "Patient mistakenly found himself in a nuclear plant waste site without protection gear. Very minor radiation poisoning. ",
  sickLeave: {
    startDate: "2019-08-05",
    endDate: "2019-08-28",
  },
}

describe('Occupational Healthcare Entry tests', () => {
  test('incorrect or missing Employee name ', () => {
    const {employerName, ...employerNameRemoved} =  mockOccupationalHealthCare;
    expect(()=> {
      toNewJournalEntry(employerNameRemoved)
    }).toThrowError(); 
  })

  test('Sick leave entry is missing', () => {
    const {sickLeave, ...sickleaveRemoved} = mockOccupationalHealthCare; 
    expect(() => {
      toNewJournalEntry(sickleaveRemoved)
    }).toThrowError(); 
  })
  test('Sick leave entry is incorrect', () => {
    const {sickLeave, ...sickleaveRemoved} = mockOccupationalHealthCare; 
    const incorrectField = {startDate: 20190005 ,endDate: "2019-08-28"}; 
    const incorrectSickLeave = {incorrectField, ...sickleaveRemoved}
    expect(() => {
      toNewJournalEntry(incorrectSickLeave)
    }).toThrowError(); 
  })
})

const mockNewHealthCheckData = {
    date: "2018-10-05",
    specialist: "MD House",
    type: "HealthCheck",
    description:
      "Yearly control visit. Due to high cholesterol levels recommended to eat more vegetables.",
    healthCheckRating: 1,
  }

describe('Health Check Entry tests', () => {
  test('validate new Hospital Entry Data throws no error', () => {
    expect(toNewJournalEntry(mockNewHealthCheckData)).toEqual(mockNewHealthCheckData);
  });
})

const testEntries = 
 [
    {
      id: "d811e46d-70b3-4d90-b090-4535c7cf8kb1",
      date: "2015-01-02",
      type: "Hospital",
      specialist: "Sirius Black",
      diagnosisCodes: ["S14.11","S66.6"],
      description:
        "Healing time appr. 2 weeks. patient doesn't remember how he got the injury.",
      discharge: {
        date: "2015-01-16",
        criteria: "Scar not healed."
               }
    }
  ]


describe('Test Entry type guard', () => {
  test('Test isStringArray guard doesnt throw error', () => {
    expect(() => {
      isStringArray(testEntries)
    }).not.toThrowError(); 
  })

  test('Test isStringArray returns true', () => {
    expect(isStringArray(testEntries)).toEqual(true);
  })

  test('Test parseEntry guard', () => {
    expect(() => {
      parseEntry(testEntries)
    }).not.toThrowError(); 
  })

})