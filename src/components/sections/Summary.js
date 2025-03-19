import React, { useEffect, useState } from "react";
import { Alert, Card, Spinner } from "react-bootstrap";
import { fetchPatientSummary } from "../../services/fhirService";
import { parseSummaryBundle } from "../../services/fhirUtils";

function Summary({ patientId }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!patientId) {
      setError("No patient in context.");
      return;
    }
    loadSummary();
  }, [patientId]);

  const loadSummary = async () => {
    setLoading(true);
    const { data, error } = await fetchPatientSummary(patientId);

    if (error) {
        setError(error);
        setLoading(false);
        return;
    } 

    const { summary, error: parseError } = parseSummaryBundle(data);
    if (parseError) {
      setError(parseError);
      setLoading(false);
      return;
    } 

    if (!summary) {
      setError("No summary available for this patient.");
    }

    setSummary(summary);
    setLoading(false);
  };

  return (
    <>
      <h4>Patient Summary</h4>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {summary && (
        <>
          {/* Patient Info */}
          <Card className="mb-3">
            <Card.Body>
              <h5>Patient Details</h5>
              <p><strong>Name:</strong> {summary.patient?.name?.[0]?.family}, {summary.patient?.name?.[0]?.given?.join(" ") || ""}</p>
              <p><strong>Gender:</strong> {summary.patient?.gender || "Unknown"}</p>
              <p><strong>Date of Birth:</strong> {summary.patient?.birthDate || "Unknown"}</p>
            </Card.Body>
          </Card>

          {/* Medications */}
          <Card className="mb-3">
            <Card.Body>
              <h5>Medications</h5>
              <ul>
                {summary.medications.length > 0 ? summary.medications.map((m, idx) => <li key={idx}>{m}</li>) : <p>No medications recorded.</p>}
              </ul>
            </Card.Body>
          </Card>

          {/* Allergies */}
          <Card className="mb-3">
            <Card.Body>
              <h5>Allergies</h5>
              <ul>
                {summary.allergies.length > 0 ? summary.allergies.map((a, idx) => <li key={idx}>{a}</li>) : <p>No allergies recorded.</p>}
              </ul>
            </Card.Body>
          </Card>

          {/* Problems (Conditions) */}
          <Card className="mb-3">
            <Card.Body>
              <h5>Problems & Conditions</h5>
              <ul>
                {summary.conditions.length > 0 ? summary.conditions.map((c, idx) => <li key={idx}>{c}</li>) : <p>No conditions recorded.</p>}
              </ul>
            </Card.Body>
          </Card>

          {/* Immunizations */}
          <Card className="mb-3">
            <Card.Body>
              <h5>Immunizations</h5>
              <ul>
                {summary.immunizations.length > 0 ? summary.immunizations.map((i, idx) => <li key={idx}>{i}</li>) : <p>No immunizations recorded.</p>}
              </ul>
            </Card.Body>
          </Card>
        </>
      )}
    </>
  );
}

export default Summary;