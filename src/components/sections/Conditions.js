import React, { useEffect, useState } from "react";
import { Table, Alert } from "react-bootstrap";
import { fetchConditionsForPatient } from "../../services/fhirService";
import { sortData } from "../../services/fhirUtils";

function Conditions({ patientId }) {
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "condition", ascending: true });

  useEffect(() => {
    if (!patientId) return;
    loadConditions();
  }, [patientId]);

  const loadConditions = async () => {
    setLoading(true);
    const { data, error } = await fetchConditionsForPatient(patientId);
    
    if (error) {
    setError(error);
    }
  
    if (data.length === 0) {
    setError("No conditions found for this patient.");
    }

    setConditions(data);
    setError(error);
    setLoading(false);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      ascending: prev.key === key ? !prev.ascending : true,
    }));
  };

  const sortedConditions = sortData(conditions, sortConfig.key, sortConfig.ascending);

  return (
    <>
      <h4>Conditions</h4>
      {loading && <p>Loading...</p>}
      {error && <Alert variant="danger">{error}</Alert>}
      {conditions.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th onClick={() => handleSort("condition")} style={{ cursor: "pointer" }}>Condition</th>
              <th onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>Status</th>
              <th onClick={() => handleSort("onset")} style={{ cursor: "pointer" }}>Onset Date</th>
            </tr>
          </thead>
          <tbody>
            {sortedConditions.map((condition) => (
              <tr key={condition.id}>
                <td>{condition.condition}</td>
                <td>{condition.status}</td>
                <td>{condition.onset}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default Conditions;