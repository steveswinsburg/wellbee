import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SidebarNav from "./SidebarNav";
import PatientHeader from "./PatientHeader";
import Medications from "./sections/Medications";
import Allergies from "./sections/Allergies";
import Conditions from "./sections/Conditions";
import Immunizations from "./sections/Immunizations";
import Summary from "./sections/Summary";
import Patient from "./sections/Patient";
import Encounters from "./sections/Encounters";


function PatientDashboard() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState("");

  const [activeSection, setActiveSection] = useState("Patient");

  useEffect(() => {
    const storedPatient = localStorage.getItem("patientInContext");

    if (storedPatient) {
      try {
        setPatient(JSON.parse(storedPatient));
      } catch (err) {
        setError("Failed to load patient data.");
      }
    } else {
      setError("No patient selected.");
      setTimeout(() => navigate("/"), 2000);  // Redirect after 2s if no patient
    }

    setLoading(false);
  }, [navigate]);

  const closePatient = () => {
    localStorage.removeItem("patientInContext");
    navigate("/"); // Go back to patient picker
  };

  const renderSection = () => {
    if (activeSection === "Medications") return <Medications patientId={patient?.id} />;
    if (activeSection === "Allergies") return <Allergies patientId={patient?.id} />;
    if (activeSection === "Conditions") return <Conditions patientId={patient?.id} />;
    if (activeSection === "Immunizations") return <Immunizations patientId={patient?.id} />;
    if (activeSection === "Patient") return <Patient patientId={patient?.id} />;
    if (activeSection === "Summary") return <Summary patientId={patient?.id} />;
    if (activeSection === "Encounters") return <Encounters patientId={patient?.id} />;

    //return <h4>Select a section from the left.</h4>;
  };

  if (loading) {
    return (
      <Container fluid className="d-flex align-items-center justify-content-center" style={{ height: "100vh" }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-3">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row>
        <Col xs="auto" style={{ width: "250px" }}>
          <SidebarNav activeSection={activeSection} setActiveSection={setActiveSection} />
        </Col>
        <Col className="p-4">
          <PatientHeader patient={patient} onClose={closePatient} />
          <div className="mt-3">{renderSection()}</div>
        </Col>
      </Row>
    </Container>
  );
}

export default PatientDashboard;