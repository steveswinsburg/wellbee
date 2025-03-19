import React from "react";
import { ListGroup, Image } from "react-bootstrap";
import { Capsule, ExclamationTriangle, ClipboardHeart, ShieldCheck } from "react-bootstrap-icons";
import wellbeeLogo from "../assets/wellbee-logo.png";

function SidebarNav({ activeSection, setActiveSection }) {
  return (
    <div className="d-flex flex-column align-items-center p-3" style={{ minHeight: "100vh" }}>
      {/* Logo Section */}
      <Image src={wellbeeLogo} width="80" height="80" className="mb-3" alt="Logo" />

      {/* Sidebar Menu */}
      <ListGroup variant="flush" className="w-100">
        <ListGroup.Item 
          action active={activeSection === "Medications"} 
          onClick={() => setActiveSection("Medications")}
        >
          <Capsule /> Medications
        </ListGroup.Item>
        <ListGroup.Item 
          action active={activeSection === "Allergies"} 
          onClick={() => setActiveSection("Allergies")}
        >
          <ExclamationTriangle /> Allergies
        </ListGroup.Item>
        <ListGroup.Item 
          action active={activeSection === "Conditions"} 
          onClick={() => setActiveSection("Conditions")}
        >
          <ClipboardHeart /> Conditions
        </ListGroup.Item>
        <ListGroup.Item 
          action active={activeSection === "Immunizations"} 
          onClick={() => setActiveSection("Immunizations")}
        >
          <ShieldCheck /> Immunizations
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}

export default SidebarNav;