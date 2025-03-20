import React, { useEffect, useState } from "react";
import { Table, Alert, Spinner, OverlayTrigger, Popover } from "react-bootstrap";
import { fetchEncountersForPatient } from "../../services/fhirService";
import { sortData } from "../../services/fhirUtils";

function Encounters({ patientId }) {
  const [encounters, setEncounters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "period.start", ascending: false });

  useEffect(() => {
    if (!patientId) {
      setError("No patient in context.");
      return;
    }
    loadEncounters();
  }, [patientId]);

  const loadEncounters = async () => {
    setLoading(true);
    const { data, error } = await fetchEncountersForPatient(patientId);

    if (error) {
      setError(error);
    }

    if (!data || data.length === 0) {
      setError("No encounters found.");
    }

    setEncounters(data);
    setLoading(false);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      ascending: prev.key === key ? !prev.ascending : true,
    }));
  };

  const sortedEncounters = sortData(encounters, sortConfig.key, sortConfig.ascending);

  return (
    <>
      <h4>Encounters</h4>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {encounters.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th onClick={() => handleSort("period.start")} style={{ cursor: "pointer" }}>
                Start Date
              </th>
              <th onClick={() => handleSort("class.display")} style={{ cursor: "pointer" }}>
                Type
              </th>
              <th onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedEncounters.map((enc) => {
              const popover = (
                <Popover id={`popover-encounter-${enc.id}`}>
                  <Popover.Header as="h3">Encounter Details</Popover.Header>
                  <Popover.Body>
                    <pre style={{ fontSize: "0.75em", whiteSpace: "pre-wrap" }}>
                      {JSON.stringify(enc, null, 2)}
                    </pre>
                  </Popover.Body>
                </Popover>
              );

              return (
                <OverlayTrigger
                  key={enc.id}
                  trigger="click"
                  placement="right"
                  overlay={popover}
                  rootClose
                >
                  <tr style={{ cursor: "pointer" }}>
                    <td>{enc.period?.start || "Unknown"}</td>
                    <td>{enc.class?.display || "Unknown"}</td>
                    <td>{enc.status || "Unknown"}</td>
                  </tr>
                </OverlayTrigger>
              );
            })}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default Encounters;