import React, { useEffect, useState } from "react";
import { Table, Alert, OverlayTrigger, Popover, Spinner } from "react-bootstrap";
import { fetchAllergiesForPatient } from "../../services/fhirService";
import { sortData } from "../../services/fhirUtils";

function Allergies({ patientId }) {
  const [allergies, setAllergies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "code.text", ascending: true });

  useEffect(() => {
    if (!patientId) {
      setError("No patient in context.");
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

    if (!data || data.length === 0) {
      setError("No allergies found.");
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
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {allergies.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th onClick={() => handleSort("code.text")} style={{ cursor: "pointer" }}>
                Substance
              </th>
              <th onClick={() => handleSort("reaction[0].manifestation[0].text")} style={{ cursor: "pointer" }}>
                Reaction
              </th>
              <th onClick={() => handleSort("reaction[0].severity")} style={{ cursor: "pointer" }}>
                Severity
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAllergies.map((allergy) => (
              <OverlayTrigger
                key={allergy.id}
                trigger="click"
                placement="right"
                overlay={
                  <Popover>
                    <Popover.Header as="h3">Allergy Details</Popover.Header>
                    <Popover.Body>
                      <pre style={{ fontSize: "0.75em", whiteSpace: "pre-wrap" }}>
                        {JSON.stringify(allergy, null, 2)}
                      </pre>
                    </Popover.Body>
                  </Popover>
                }
              >
                <tr style={{ cursor: "pointer" }}>
                  <td>{allergy.code?.text || "Unknown"}</td>
                  <td>{allergy.reaction?.[0]?.manifestation?.[0]?.text || "Unknown"}</td>
                  <td>{allergy.reaction?.[0]?.severity || "Unknown"}</td>
                </tr>
              </OverlayTrigger>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default Allergies;