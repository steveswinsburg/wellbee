import React, { useEffect, useState } from "react";
import { Table, Alert } from "react-bootstrap";
import { fetchAllergiesForPatient } from "../../services/fhirService";
import { sortData } from "../../services/fhirUtils";

function Allergies({ patientId }) {
  const [allergies, setAllergies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "substance", ascending: true });

  useEffect(() => {
    if (!patientId) {
      setError("No patient selected.");
      return;
    }
    loadAllergies();
  }, [patientId]);

  const loadAllergies = async () => {
    setLoading(true);
    const { data, error } = await fetchAllergiesForPatient(patientId);

    if (error) {
      setError(error);
    }

    if (data.length === 0) {
      setError("No allergies found for this patient.");
    }

    setAllergies(data);
    setLoading(false);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      ascending: prev.key === key ? !prev.ascending : true,
    }));
  };

  const sortedAllergies = sortData(allergies, sortConfig.key, sortConfig.ascending);

  return (
    <>
      <h4>Allergies</h4>
      {loading && <p>Loading allergies...</p>}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && allergies.length === 0 && <p>No allergies available.</p>}
      {allergies.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th onClick={() => handleSort("substance")} style={{ cursor: "pointer" }}>Substance</th>
              <th onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>Status</th>
              <th onClick={() => handleSort("severity")} style={{ cursor: "pointer" }}>Severity</th>
            </tr>
          </thead>
          <tbody>
            {sortedAllergies.map((allergy) => (
              <tr key={allergy.id}>
                <td>{allergy.substance}</td>
                <td>{allergy.status}</td>
                <td>{allergy.severity}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default Allergies;