export const fetchPatients = async () => {
    try {
        const fhirBaseUrl = localStorage.getItem("fhirBaseUrl");
        if (!fhirBaseUrl) throw new Error("FHIR server is not configured.");

        const response = await fetch(`${fhirBaseUrl}/Patient`);
        if (!response.ok) throw new Error("Failed to fetch patients.");
        
        const data = await response.json();
        const patients = (data.entry || []).map(entry => entry.resource);

        //console.log(patients);

        return { data: patients, error: null };
    } catch (err) {
        return { data: [], error: err.message };
    }
};

/**
 * Fetches Medications (MedicationRequest + MedicationStatement) for a given patient.
 */
export const fetchMedicationsForPatient = async (patientId) => {
    try {
        const fhirBaseUrl = localStorage.getItem("fhirBaseUrl");
        if (!fhirBaseUrl) throw new Error("FHIR server is not configured.");

        const medicationRequestResponse = await fetch(`${fhirBaseUrl}/MedicationRequest?patient=${patientId}`);
        const medicationStatementResponse = await fetch(`${fhirBaseUrl}/MedicationStatement?patient=${patientId}`);

        if (!medicationRequestResponse.ok || !medicationStatementResponse.ok) {
        throw new Error("Failed to fetch medications.");
        }

        const medicationRequestData = await medicationRequestResponse.json();
        const medicationStatementData = await medicationStatementResponse.json();

        const combinedMedications = [
        ...(medicationRequestData.entry || []).map(entry => entry.resource),
        ...(medicationStatementData.entry || []).map(entry => entry.resource)
        ];

        return { data: combinedMedications, error: null };
    } catch (err) {
        return { data: [], error: err.message };
    }
};

/**
 * Fetches Allergies (AllergyIntolerance) for a given patient.
 */
export const fetchAllergiesForPatient = async (patientId) => {
    try {
        const fhirBaseUrl = localStorage.getItem("fhirBaseUrl");
        if (!fhirBaseUrl) throw new Error("FHIR server is not configured.");

        const response = await fetch(`${fhirBaseUrl}/AllergyIntolerance?patient=${patientId}`);
        if (!response.ok) throw new Error("Failed to fetch allergies.");
        
        const data = await response.json();
        const allergies = (data.entry || []).map(entry => entry.resource);

        return { data: allergies, error: null };
    } catch (err) {
        return { data: [], error: err.message };
    }
};

/**
 * Fetches Conditions (Condition) for a given patient.
 */
export const fetchConditionsForPatient = async (patientId) => {
    try {
        const fhirBaseUrl = localStorage.getItem("fhirBaseUrl");
        if (!fhirBaseUrl) throw new Error("FHIR server is not configured.");

        const response = await fetch(`${fhirBaseUrl}/Condition?patient=${patientId}`);
        if (!response.ok) throw new Error("Failed to fetch conditions.");
        
        const data = await response.json();
        const conditions = (data.entry || []).map(entry => entry.resource);

        return { data: conditions, error: null };
    } catch (err) {
        return { data: [], error: err.message };
    }
};

/**
 * Fetches Immunizations (Immunization) for a given patient.
 */
export const fetchImmunizationsForPatient = async (patientId) => {
    try {
        const fhirBaseUrl = localStorage.getItem("fhirBaseUrl");
        if (!fhirBaseUrl) throw new Error("FHIR server is not configured.");

        const response = await fetch(`${fhirBaseUrl}/Immunization?patient=${patientId}`);
        if (!response.ok) throw new Error("Failed to fetch immunizations.");
        
        const data = await response.json();
        const immunizations = (data.entry || []).map(entry => entry.resource);

        return { data: immunizations, error: null };
    } catch (err) {
        return { data: [], error: err.message };
    }
};

/**
 * Fetches full FHIR resource by ID.
 */
export const fetchFhirResourceById = async (resourceType, resourceId) => {
    try {
        const fhirBaseUrl = localStorage.getItem("fhirBaseUrl");
        if (!fhirBaseUrl) throw new Error("FHIR server is not configured.");

        const response = await fetch(`${fhirBaseUrl}/${resourceType}/${resourceId}`);
        if (!response.ok) throw new Error(`Failed to fetch ${resourceType}/${resourceId}.`);
        
        const data = await response.json();
        return { data, error: null };
    } catch (err) {
        return { data: null, error: err.message };
    }
};

/**
 * Fetches summary for a given patient.
 */
export const fetchPatientSummary = async (patientId) => {
    try {
        const fhirBaseUrl = localStorage.getItem("fhirBaseUrl");
        if (!fhirBaseUrl) throw new Error("FHIR server is not configured.");

        const response = await fetch(`${fhirBaseUrl}/Patient/${patientId}/$summary`);
        if (!response.ok) throw new Error("Failed to fetch patient summary.");
        
        const data = await response.json();
        return { data, error: null };
    } catch (err) {
        return { data: null, error: err.message };
    }
};

/**
 * Fetches full patient details for a given patient ID.
 */
export const fetchPatient = async (patientId) => {
    try {
        const fhirBaseUrl = localStorage.getItem("fhirBaseUrl");
        if (!fhirBaseUrl) throw new Error("FHIR server is not configured.");

        const response = await fetch(`${fhirBaseUrl}/Patient/${patientId}`);
        if (!response.ok) throw new Error("Failed to fetch patient.");
        
        const data = await response.json();
        return { data, error: null };
    } catch (err) {
        return { data: null, error: err.message };
    }
};

export const fetchEncountersForPatient = async (patientId) => {
    try {
      const fhirBaseUrl = localStorage.getItem("fhirBaseUrl");
      if (!fhirBaseUrl) throw new Error("FHIR server is not configured.");
  
      const response = await fetch(`${fhirBaseUrl}/Encounter?patient=${patientId}`);
      if (!response.ok) throw new Error("Failed to fetch encounters.");
      
      const data = await response.json();
      const encounters = (data.entry || []).map(entry => entry.resource);
  
      return { data: encounters, error: null };
    } catch (err) {
      return { data: [], error: err.message };
    }
  };