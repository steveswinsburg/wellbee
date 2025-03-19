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
    return patients.sort((a, b) => (a.familyName || "").localeCompare(b.familyName || "", undefined, { sensitivity: "base" }));
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