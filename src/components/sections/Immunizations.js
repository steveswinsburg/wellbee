import React, { useEffect, useState } from "react";
import { Table, Alert } from "react-bootstrap";
import { fetchImmunizationsForPatient } from "../../services/fhirService";
import { sortData } from "../../services/fhirUtils";

function Immunizations({ patientId }) {
  const [immunizations, setImmunizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "date", ascending: true });

  useEffect(() => {
    if (!patientId) return;
    loadImmunizations();
  }, [patientId]);

  const loadImmunizations = async () => {
    setLoading(true);
    const { data, error } = await fetchImmunizationsForPatient(patientId);
    if (error) {
        setError(error);
        }
      
        if (data.length === 0) {
        setError("No immunizations found for this patient.");
        }
    
        setImmunizations(data);
    setLoading(false);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      ascending: prev.key === key ? !prev.ascending : true,
    }));
  };

  const sortedImmunizations = sortData(immunizations, sortConfig.key, sortConfig.ascending);

  return (
    <>
      <h4>Immunizations</h4>
      {loading && <p>Loading...</p>}
      {error && <Alert variant="danger">{error}</Alert>}
      {immunizations.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th onClick={() => handleSort("vaccine")} style={{ cursor: "pointer" }}>Vaccine</th>
              <th onClick={() => handleSort("date")} style={{ cursor: "pointer" }}>Date</th>
              <th onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>Status</th>
              <th onClick={() => handleSort("site")} style={{ cursor: "pointer" }}>Site</th>
            </tr>
          </thead>
          <tbody>
            {sortedImmunizations.map((imm) => (
              <tr key={imm.id}>
                <td>{imm.vaccine}</td>
                <td>{imm.date}</td>
                <td>{imm.status}</td>
                <td>{imm.site}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default Immunizations;