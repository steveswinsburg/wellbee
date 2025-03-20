import React, { useEffect, useState } from "react";
import { Table, Alert, OverlayTrigger, Popover, Spinner } from "react-bootstrap";
import { fetchMedicationsForPatient } from "../../services/fhirService";
import { extractMedicationName, sortData } from "../../services/fhirUtils";

function Medications({ patientId }) {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "medicationCodeableConcept.text", ascending: true });

  useEffect(() => {
    if (!patientId) {
      setError("No patient in context.");
      return;
    }
    loadMedications();
  }, [patientId]);

  const loadMedications = async () => {
    setLoading(true);
    const { data, error } = await fetchMedicationsForPatient(patientId);

    if (error) {
      setError(error);
    }

    if (!data || data.length === 0) {
      setError("No medications found.");
    }

    setMedications(data);
    setLoading(false);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      ascending: prev.key === key ? !prev.ascending : true,
    }));
  };

  const sortedMedications = sortData(
    medications.map((med) => ({
      ...med,
      medicationName: extractMedicationName(med), // Extract name dynamically
    })),
    sortConfig.key,
    sortConfig.ascending
  );

  return (
    <>
      <h4>Medications</h4>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {medications.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th onClick={() => handleSort("medicationCodeableConcept.text")} style={{ cursor: "pointer" }}>
                Name
              </th>
              <th onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
                Status
              </th>
              <th onClick={() => handleSort("dateAsserted")} style={{ cursor: "pointer" }}>
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedMedications.map((med) => (
              <OverlayTrigger
                key={med.id}
                trigger="click"
                placement="right"
                overlay={
                  <Popover>
                    <Popover.Header as="h3">Medication Details</Popover.Header>
                    <Popover.Body>
                      <pre style={{ fontSize: "0.75em", whiteSpace: "pre-wrap" }}>
                        {JSON.stringify(med, null, 2)}
                      </pre>
                    </Popover.Body>
                  </Popover>
                }
              >
                <tr style={{ cursor: "pointer" }}>
                  <td>{med.medicationName || "Unknown"}</td>
                  <td>{med.status || "Unknown"}</td>
                  <td>{med.dateAsserted}</td>
                </tr>
              </OverlayTrigger>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default Medications;