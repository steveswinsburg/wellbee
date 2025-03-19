import React, { useEffect, useState } from "react";
import { Table, Alert, OverlayTrigger, Popover, Spinner } from "react-bootstrap";
import { fetchConditionsForPatient } from "../../services/fhirService";
import { sortData } from "../../services/fhirUtils";

function Conditions({ patientId }) {
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "code.text", ascending: true });

  useEffect(() => {
    if (!patientId) {
      setError("No patient in context.");
      return;
    }
    loadConditions();
  }, [patientId]);

  const loadConditions = async () => {
    setLoading(true);
    const { data, error } = await fetchConditionsForPatient(patientId);

    if (error) {
      setError(error);
    }

    if (!data || data.length === 0) {
      setError("No conditions found.");
    }

    setConditions(data);
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
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {conditions.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th onClick={() => handleSort("code.text")} style={{ cursor: "pointer" }}>
                Condition
              </th>
              <th onClick={() => handleSort("clinicalStatus.text")} style={{ cursor: "pointer" }}>
                Status
              </th>
              <th onClick={() => handleSort("onsetDateTime")} style={{ cursor: "pointer" }}>
                Onset Date
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedConditions.map((cond) => (
              <OverlayTrigger
                key={cond.id}
                trigger="click"
                placement="right"
                overlay={
                  <Popover>
                    <Popover.Header as="h3">Condition Details</Popover.Header>
                    <Popover.Body>
                      <pre style={{ fontSize: "0.75em", whiteSpace: "pre-wrap" }}>
                        {JSON.stringify(cond, null, 2)}
                      </pre>
                    </Popover.Body>
                  </Popover>
                }
              >
                <tr style={{ cursor: "pointer" }}>
                  <td>{cond.code?.text || "Unknown"}</td>
                  <td>{cond.clinicalStatus?.text || "Unknown"}</td>
                  <td>{cond.onsetDateTime || "Unknown"}</td>
                </tr>
              </OverlayTrigger>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default Conditions;