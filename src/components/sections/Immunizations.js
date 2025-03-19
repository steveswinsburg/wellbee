import React, { useEffect, useState } from "react";
import { Table, Alert, OverlayTrigger, Popover } from "react-bootstrap";
import { fetchImmunizationsForPatient } from "../../services/fhirService";
import { sortData } from "../../services/fhirUtils";

function Immunizations({ patientId }) {
  const [immunizations, setImmunizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "vaccineCode.text", ascending: true });

  useEffect(() => {
    if (!patientId) {
      setError("No patient in context.");
      return;
    }
    loadImmunizations();
  }, [patientId]);

  const loadImmunizations = async () => {
    setLoading(true);
    const { data, error } = await fetchImmunizationsForPatient(patientId);

    if (error) {
      setError(error);
    }

    if (!data || data.length === 0) {
      setError("No immunizations found.");
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
      {loading && <p>Loading immunizations...</p>}
      {error && <Alert variant="danger">{error}</Alert>}
      {immunizations.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th onClick={() => handleSort("vaccineCode.text")} style={{ cursor: "pointer" }}>
                Vaccine
              </th>
              <th onClick={() => handleSort("occurrenceDateTime")} style={{ cursor: "pointer" }}>
                Date
              </th>
              <th onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedImmunizations.map((imm) => (
              <OverlayTrigger
                key={imm.id}
                trigger="click"
                placement="right"
                overlay={
                  <Popover>
                    <Popover.Header as="h3">Immunization Details</Popover.Header>
                    <Popover.Body>
                      <pre style={{ fontSize: "0.75em", whiteSpace: "pre-wrap" }}>
                        {JSON.stringify(imm, null, 2)}
                      </pre>
                    </Popover.Body>
                  </Popover>
                }
              >
                <tr style={{ cursor: "pointer" }}>
                  <td>{imm.vaccineCode?.text || "Unknown"}</td>
                  <td>{imm.occurrenceDateTime || "Unknown"}</td>
                  <td>{imm.status || "Unknown"}</td>
                </tr>
              </OverlayTrigger>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default Immunizations;