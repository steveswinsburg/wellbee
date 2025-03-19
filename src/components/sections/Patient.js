import React, { useEffect, useState } from "react";
import { Alert, Card, Spinner } from "react-bootstrap";
import { fetchPatient } from "../../services/fhirService";

function Patient({ patientId }) {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!patientId) {
      setError("No patient in context.");
      return;
    }
    loadPatientDetails();
  }, [patientId]);

  const loadPatientDetails = async () => {
    setLoading(true);
    const { data, error } = await fetchPatient(patientId);

    if (error) {
      setError(error);
    }

    if (!data) {
      setError("No patient found.");
    }

    setPatient(data);
    setLoading(false);
  };

  return (
    <>
      <h4>Patient</h4>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {patient && (
        <Card className="p-3">
          <h5>Basic Information</h5>
          <p><strong>Name:</strong> {patient.name?.[0]?.text || "Unknown"}</p>
          <p><strong>Gender:</strong> {patient.gender || "Unknown"}</p>
          <p><strong>DOB:</strong> {patient.birthDate || "Unknown"}</p>
          <p><strong>Marital Status:</strong> {patient.maritalStatus?.text || "Unknown"}</p>

          <h5>Contact Information</h5>
          <p><strong>Phone:</strong> {patient.telecom?.find(t => t.system === "phone")?.value || "N/A"}</p>
          <p><strong>Email:</strong> {patient.telecom?.find(t => t.system === "email")?.value || "N/A"}</p>

          <h5>Address</h5>
          {patient.address?.length > 0 ? (
            <p>
              {patient.address[0].line?.join(", ")}, {patient.address[0].city}, {patient.address[0].state} {patient.address[0].postalCode}
            </p>
          ) : (
            <p>No address available</p>
          )}

          <h5>Identifiers</h5>
          {patient.identifier?.length > 0 ? (
            <ul>
              {patient.identifier.map((id, index) => (
                <li key={index}>{id.system}: {id.value}</li>
              ))}
            </ul>
          ) : (
            <p>No identifiers</p>
          )}
        </Card>
      )}
    </>
  );
}

export default Patient;