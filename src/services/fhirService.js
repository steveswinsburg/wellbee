export const fetchPatients = async (fhirBaseUrl) => {
    try {
      const response = await fetch(`${fhirBaseUrl}/Patient`);
      if (!response.ok) throw new Error("Failed to fetch patients.");
      const data = await response.json();
  
      if (!data.entry) {
        return { patients: [], error: "No patients found." };
      }
  
      const extractedPatients = data.entry.map((entry) => ({
        id: entry.resource.id,
        givenNames: entry.resource.name?.[0]?.given || [], // Keep as array
        familyName: entry.resource.name?.[0]?.family || "", // Keep as string
        gender: entry.resource.gender || "Unknown",
        birthDate: entry.resource.birthDate || "Unknown",
      }));
  
      return { patients: extractedPatients, error: null };
    } catch (err) {
      return { patients: [], error: err.message };
    }
  };

/**
 * Fetches medications for a given patient from both MedicationRequest and MedicationStatement.
 */
export const fetchMedicationsForPatient = async (patientId) => {
    try {
      const fhirBaseUrl = localStorage.getItem("fhirBaseUrl");
      if (!fhirBaseUrl) throw new Error("FHIR server is not configured.");
  
      // Fetch MedicationRequest
      const medicationRequestResponse = await fetch(`${fhirBaseUrl}/MedicationRequest?patient=${patientId}`);
      if (!medicationRequestResponse.ok) throw new Error("Failed to fetch MedicationRequest.");
      const medicationRequestData = await medicationRequestResponse.json();
  
      // Fetch MedicationStatement
      const medicationStatementResponse = await fetch(`${fhirBaseUrl}/MedicationStatement?patient=${patientId}`);
      if (!medicationStatementResponse.ok) throw new Error("Failed to fetch MedicationStatement.");
      const medicationStatementData = await medicationStatementResponse.json();

      console.log("MedicationRequest Data:", medicationRequestData);
      console.log("MedicationStatement Data:", medicationStatementData);
  
      // Extract Medications from MedicationRequest
      const medicationRequests = medicationRequestData.entry
        ? medicationRequestData.entry.map((entry) => ({
            id: entry.resource.id,
            type: "Request",
            name: entry.resource.medicationCodeableConcept?.text || "Unknown",
            status: entry.resource.status || "Unknown",
            date: entry.resource.authoredOn || "N/A",
          }))
        : [];
  
      // Extract Medications from MedicationStatement
      const medicationStatements = medicationStatementData.entry
        ? medicationStatementData.entry.map((entry) => ({
            id: entry.resource.id,
            type: "Statement",
            name: entry.resource.medicationCodeableConcept?.text || "Unknown",
            status: entry.resource.status || "Unknown",
            date: entry.resource.effectiveDateTime || "N/A",
          }))
        : [];
  
      // Merge both lists
      const combinedMedications = [...medicationRequests, ...medicationStatements];

      console.log("Processed Medications:", combinedMedications);
  
      return { data: combinedMedications, error: null };
    } catch (err) {
      return { data: [], error: err.message };
    }
};

/**
 * Fetches allergies for a given patient.
 */
export const fetchAllergiesForPatient = async (patientId) => {
    try {
      const fhirBaseUrl = localStorage.getItem("fhirBaseUrl");
      if (!fhirBaseUrl) throw new Error("FHIR server is not configured.");
  
      const response = await fetch(`${fhirBaseUrl}/AllergyIntolerance?patient=${patientId}`);
      if (!response.ok) throw new Error("Failed to fetch allergies.");
      const data = await response.json();
  
      if (!data.entry) {
        return { data: [], error: "No allergies found." };
      }
  
      const extractedAllergies = data.entry.map((entry) => ({
        id: entry.resource.id,
        substance: entry.resource.code?.text || "Unknown",
        status: entry.resource.clinicalStatus?.coding?.[0]?.code || "Unknown",
        severity: entry.resource.reaction?.[0]?.severity || "Unknown",
      }));
  
      return { data: extractedAllergies, error: null };
    } catch (err) {
      return { data: [], error: err.message };
    }
  };
  
  /**
   * Fetches conditions for a given patient.
   */
  export const fetchConditionsForPatient = async (patientId) => {
    try {
      const fhirBaseUrl = localStorage.getItem("fhirBaseUrl");
      if (!fhirBaseUrl) throw new Error("FHIR server is not configured.");
  
      const response = await fetch(`${fhirBaseUrl}/Condition?patient=${patientId}`);
      if (!response.ok) throw new Error("Failed to fetch conditions.");
      const data = await response.json();
  
      if (!data.entry) {
        return { data: [], error: "No conditions found." };
      }
  
      const extractedConditions = data.entry.map((entry) => ({
        id: entry.resource.id,
        condition: entry.resource.code?.text || "Unknown",
        status: entry.resource.clinicalStatus?.coding?.[0]?.code || "Unknown",
        onset: entry.resource.onsetDateTime || "Unknown",
      }));
  
      return { data: extractedConditions, error: null };
    } catch (err) {
      return { data: [], error: err.message };
    }
  };

/**
 * Fetches immunizations for a given patient.
 */
export const fetchImmunizationsForPatient = async (patientId) => {
    try {
      const fhirBaseUrl = localStorage.getItem("fhirBaseUrl");
      if (!fhirBaseUrl) throw new Error("FHIR server is not configured.");
  
      const response = await fetch(`${fhirBaseUrl}/Immunization?patient=${patientId}`);
      if (!response.ok) throw new Error("Failed to fetch immunizations.");
      const data = await response.json();
  
      if (!data.entry) {
        return { data: [], error: "No immunizations found." };
      }
  
      const extractedImmunizations = data.entry.map((entry) => ({
        id: entry.resource.id,
        vaccine: entry.resource.vaccineCode?.text || "Unknown",
        date: entry.resource.occurrenceDateTime || "Unknown",
        status: entry.resource.status || "Unknown",
        site: entry.resource.site?.text || "Unknown",
      }));
  
      return { data: extractedImmunizations, error: null };
    } catch (err) {
      return { data: [], error: err.message };
    }
  };