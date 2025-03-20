/**
 * Formats a FHIR name object into "First Last" format.
 */
export const formatFullName = (givenNames, familyName) => {
    return `${givenNames.join(" ")} ${familyName}`.trim() || "Unknown";
};

/**
 * Formats a FHIR name as "Last, First Middle"
 */
export const formatLastNameFirst = (givenNames, familyName) => {
    return familyName ? `${familyName}, ${givenNames.join(" ")}`.trim() : "Unknown";
};

/**
 * Gets initials from a FHIR name.
 */
export const getInitials = (givenNames, familyName) => {
    const givenInitials = givenNames.map((name) => name.charAt(0)).join(".");
    const lastInitial = familyName ? familyName.charAt(0) : "";
    return `${givenInitials}${lastInitial ? "." + lastInitial : ""}`.toUpperCase();
};

/**
 * Sorts an array of patients by last name (case-insensitive).
 * @param {Array} patients - List of patients to sort.
 * @returns {Array} Sorted patients.
 */
export const sortPatientsByLastName = (patients) => {
    if (!Array.isArray(patients)) return []; 
  
    return patients.sort((a, b) => {
      const lastNameA = a.name?.[0]?.family?.toLowerCase() || "";
      const lastNameB = b.name?.[0]?.family?.toLowerCase() || "";
      return lastNameA.localeCompare(lastNameB);
    });
  };

/**
 * Generic sorting function for table data.
 * @param {Array} data - The array of objects to sort.
 * @param {string} key - The key to sort by.
 * @param {boolean} ascending - If true, sort ascending; else descending.
 * @returns {Array} Sorted array.
 */
export const sortData = (data, key, ascending) => {
    return [...data].sort((a, b) => {
      const valA = (a[key] || "").toString().toLowerCase();
      const valB = (b[key] || "").toString().toLowerCase();
  
      if (valA < valB) return ascending ? -1 : 1;
      if (valA > valB) return ascending ? 1 : -1;
      return 0;
    });
};

export const parseSummaryBundle = (bundle) => {
    if (!bundle || bundle.resourceType !== "Bundle" || !Array.isArray(bundle.entry)) {
      return { error: "Invalid summary format", summary: null };
    }
  
    let patient = null;
    let medications = [];
    let allergies = [];
    let conditions = [];
    let immunizations = [];
  
    // Find the Composition resource
    const composition = bundle.entry.find((e) => e.resource.resourceType === "Composition")?.resource;
    if (!composition) {
      return { error: "No Composition found in summary", summary: null };
    }
  
    // Extract patient reference
    const patientRef = composition.subject?.reference;
    if (patientRef) {
      patient = bundle.entry.find((e) => e.fullUrl.includes(patientRef))?.resource || null;
    }
  
    // Extract sections from Composition
    composition.section.forEach((section) => {
      const title = section.title;
      const text = section.text?.div?.replace(/<[^>]+>/g, "").trim() || "No details available";
  
      if (title.includes("Medication")) {
        medications.push(text);
      } else if (title.includes("Allergies")) {
        allergies.push(text);
      } else if (title.includes("Problems") || title.includes("Conditions")) {
        conditions.push(text);
      } else if (title.includes("Immunizations")) {
        immunizations.push(text);
      }
    });
  
    return {
      summary: {
        patient,
        medications,
        allergies,
        conditions,
        immunizations,
      },
      error: null,
    };
};

export const extractMedicationName = (medicationResource) => {
    if (!medicationResource) return "Unknown";
  
    // Case 1: If medication is a CodeableConcept, get text
    if (medicationResource.medicationCodeableConcept?.text) {
      return medicationResource.medicationCodeableConcept.text;
    }

    // Case 2: If medication is a CodeableConcept, get coding display
    if (medicationResource.medicationCodeableConcept?.coding?.length > 0) {
        const codingDisplay = medicationResource.medicationCodeableConcept.coding.find(
          (coding) => coding.display
        )?.display;
        if (codingDisplay) return codingDisplay;
    }
  
    // Case 3: If medication is in a contained Medication resource
    if (medicationResource.medicationReference?.reference?.startsWith("#")) {
      const containedMedication = medicationResource.contained?.find(
        (med) => `#${med.id}` === medicationResource.medicationReference.reference
      );
      if (containedMedication?.code?.text) {
        return containedMedication.code.text;
      }
    }
  
    return "Unknown";
};

export const extractAllergyName = (allergyResource) => {
    if (!allergyResource) return "Unknown";
  
    // Case 1: If allergy has a direct text name
    if (allergyResource.code?.text) {
      return allergyResource.code.text;
    }
  
    // Case 2: If allergy has coding[].display
    if (allergyResource.code?.coding?.length > 0) {
      const codingDisplay = allergyResource.code.coding.find(
        (coding) => coding.display
      )?.display;
      if (codingDisplay) return codingDisplay;
    }
  
    return "Unknown";
  };



 export const extractAllergyManifestation = (allergyResource) => {
    if (!allergyResource || !allergyResource.reaction) return ["Unknown"];
  
    return allergyResource.reaction.flatMap(reaction => {
      const severity = reaction.severity ? `(${reaction.severity})` : ""; 
      return reaction.manifestation?.flatMap(manifest =>
        manifest.text
          ? `${manifest.text} ${severity}`.trim()
          : manifest.coding?.map(coding => `${coding.display} ${severity}`.trim()).filter(Boolean)
      ) || ["Unknown"];
    });
  };