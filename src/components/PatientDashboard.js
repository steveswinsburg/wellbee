import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SidebarNav from "./SidebarNav";
import PatientHeader from "./PatientHeader";
import Medications from "./sections/Medications";
import Allergies from "./sections/Allergies";
import Conditions from "./sections/Conditions";
import Immunizations from "./sections/Immunizations"; // New Section

function PatientDashboard() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [activeSection, setActiveSection] = useState("Medications");

  useEffect(() => {
    const storedPatient = localStorage.getItem("selectedPatient");
    if (storedPatient) {
      setPatient(JSON.parse(storedPatient));
    } else {
      navigate("/"); // No patient selected, go back to home
    }
  }, [navigate]);

  const closePatient = () => {
    localStorage.removeItem("selectedPatient");
    navigate("/"); // Go back to patient picker
  };

  const renderSection = () => {
    if (activeSection === "Medications") return <Medications patientId={patient?.id} />;
    if (activeSection === "Allergies") return <Allergies patientId={patient?.id} />;
    if (activeSection === "Conditions") return <Conditions patientId={patient?.id} />;
    if (activeSection === "Immunizations") return <Immunizations patientId={patient?.id} />; // Added Immunizations
    return <h4>Select a section from the left.</h4>;
  };

  return (
    <Container fluid>
      <Row>
        <Col xs={2}>
          <SidebarNav activeSection={activeSection} setActiveSection={setActiveSection} />
        </Col>
        <Col xs={10}>
          <PatientHeader patient={patient} onClose={closePatient} />
          <div className="mt-3">{renderSection()}</div>
        </Col>
      </Row>
    </Container>
  );
}

export default PatientDashboard;