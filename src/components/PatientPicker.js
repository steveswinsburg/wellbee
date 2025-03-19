import React, { useEffect, useState } from "react";
import { Table, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { fetchPatients } from "../services/fhirService";
import { sortPatientsByLastName } from "../services/fhirUtils";

function PatientPicker() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    const { data, error } = await fetchPatients();
    
    setPatients(sortPatientsByLastName(data));
    setError(error);
    setLoading(false);
  };

  const setPatientInContext = (patient) => {
    localStorage.setItem("patientInContext", JSON.stringify(patient));
    navigate("/dashboard"); // Navigate to dashboard
  };

  return (
    <>
      <h4>Select a Patient</h4>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {patients.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Date of Birth</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} onClick={() => setPatientInContext(patient)} style={{ cursor: "pointer" }}>
                <td>{patient.id}</td>
                <td>
                  {patient.name?.[0]?.family}, {patient.name?.[0]?.given?.join(" ") || ""}
                </td>
                <td>{patient.gender || "Unknown"}</td>
                <td>{patient.birthDate || "Unknown"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default PatientPicker;