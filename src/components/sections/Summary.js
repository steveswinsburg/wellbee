import React, { useEffect, useState } from "react";
import { Alert, Card } from "react-bootstrap";
import { fetchPatientSummary } from "../../services/fhirService";

function Summary({ patientId }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!patientId) {
      setError("No patient selected.");
      return;
    }
    loadSummary();
  }, [patientId]);

  const loadSummary = async () => {
    setLoading(true);
    const { data, error } = await fetchPatientSummary(patientId);

    if (error) {
      setError(error);
    }

    if (!data) {
      setError("No summary available for this patient.");
    }

    setSummary(data);
    setLoading(false);
  };

  return (
    <>
      <h4>Patient Summary</h4>
      {loading && <p>Loading summary...</p>}
      {error && <Alert variant="danger">{error}</Alert>}
      {summary && (
        <Card className="p-3">
          <h5>Basic Information</h5>
          <p><strong>Name:</strong> {summary.name?.[0]?.text || "Unknown"}</p>
          <p><strong>Gender:</strong> {summary.gender || "Unknown"}</p>
          <p><strong>DOB:</strong> {summary.birthDate || "Unknown"}</p>

          <h5>Clinical Summary</h5>
          <p><strong>Conditions:</strong> {summary.conditions || "N/A"}</p>
          <p><strong>Allergies:</strong> {summary.allergies || "N/A"}</p>
          <p><strong>Medications:</strong> {summary.medications || "N/A"}</p>

          <h5>Encounters</h5>
          {summary.encounters?.length > 0 ? (
            <ul>
              {summary.encounters.map((enc, index) => (
                <li key={index}>
                  {enc.class?.display || "Unknown"} - {enc.period?.start || "N/A"}
                </li>
              ))}
            </ul>
          ) : (
            <p>No past encounters</p>
          )}
        </Card>
      )}
    </>
  );
}

export default Summary;