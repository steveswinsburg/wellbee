import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { formatFullName } from "../services/fhirUtils";

function PatientHeader({ patient, onClose }) {
  if (!patient) return null;

  return (
    <Container className="p-3 border-bottom">
      <Row>
        <Col>
          <h3>{formatFullName(patient.givenNames, patient.familyName)}</h3>
          <p>Gender: {patient.gender} | DOB: {patient.birthDate}</p>
        </Col>
        <Col className="text-end">
          <Button variant="danger" onClick={onClose}>Close Patient</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default PatientHeader;