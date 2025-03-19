import React, { useEffect, useState } from "react";
import { Table, Alert } from "react-bootstrap";
import { fetchMedicationsForPatient } from "../../services/fhirService";
import { sortData } from "../../services/fhirUtils";

function Medications({ patientId }) {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "name", ascending: true });

  useEffect(() => {
    if (!patientId) {
      setError("No patient selected.");
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

    if (data.length === 0) {
      setError("No medications found for this patient.");
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

  const sortedMedications = sortData(medications, sortConfig.key, sortConfig.ascending);

  return (
    <>
      <h4>Medications</h4>
      {loading && <p>Loading medications...</p>}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && medications.length === 0 && <p>No medications available.</p>}
      {medications.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>Name</th>
              <th onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>Status</th>
              <th onClick={() => handleSort("type")} style={{ cursor: "pointer" }}>Type</th>
              <th onClick={() => handleSort("date")} style={{ cursor: "pointer" }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {sortedMedications.map((med) => (
              <tr key={med.id}>
                <td>{med.name}</td>
                <td>{med.status}</td>
                <td>{med.type}</td>
                <td>{med.date}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default Medications;