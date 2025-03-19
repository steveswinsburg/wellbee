import React, { useEffect, useState } from "react";
import { Table, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { fetchPatients } from "../services/fhirService";
import { formatFullName, getInitials, sortPatientsByLastName } from "../services/fhirUtils";

function PatientPicker({ fhirBaseUrl }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadPatients();
  }, [fhirBaseUrl]);

  const loadPatients = async () => {
    setLoading(true);
    const { patients, error } = await fetchPatients(fhirBaseUrl);
    setPatients(sortPatientsByLastName(patients));
    setError(error);
    setLoading(false);
  };

  const handlePatientSelect = (patient) => {
    localStorage.setItem("selectedPatient", JSON.stringify(patient));
    navigate("/dashboard"); // Navigate to dashboard
  };

  return (
    <>
      <h4>Patient Picker</h4>
      {loading && <p>Loading patients...</p>}
      {error && <Alert variant="danger">{error}</Alert>}
      {patients.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Date of Birth</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} onClick={() => handlePatientSelect(patient)} style={{ cursor: "pointer" }}>
                <td>{formatFullName(patient.givenNames, patient.familyName)}</td>
                <td>{patient.gender}</td>
                <td>{patient.birthDate}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default PatientPicker;