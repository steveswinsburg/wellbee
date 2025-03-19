import React from "react";
import { Card, Button } from "react-bootstrap";

function PatientHeader({ patient, onClose }) {
  if (!patient) {
    return <h4>No patient selected.</h4>;
  }

  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h4>
              {patient.name?.[0]?.family}, {patient.name?.[0]?.given?.join(" ") || ""}
            </h4>
            <p>
              <strong>ID:</strong> {patient.id} | <strong>Gender:</strong> {patient.gender || "Unknown"} |{" "}
              <strong>DOB:</strong> {patient.birthDate || "Unknown"}
            </p>
          </div>
          <Button variant="danger" onClick={onClose}>Close Patient</Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default PatientHeader;