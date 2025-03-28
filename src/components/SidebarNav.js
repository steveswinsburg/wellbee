import React from "react";
import { ListGroup, Image } from "react-bootstrap";
import { Capsule, ExclamationTriangle, ClipboardHeart, ShieldCheck, FileEarmarkText, PersonBadge, CalendarEvent } from "react-bootstrap-icons";
import wellbeeLogo from "../assets/wellbee-logo.png";

function SidebarNav({ activeSection, setActiveSection }) {
  return (
    <div className="d-flex flex-column align-items-center p-3" style={{ width: "250px", minHeight: "100vh", background: "#f8f9fa" }}>

    <Image src={wellbeeLogo} width="120" height="120" className="mb-3" alt="Wellbee Logo" />

      <ListGroup variant="flush" className="w-100">
        
        <ListGroup.Item 
          action 
          className="list-group-item-action" 
          active={activeSection === "Patient"} 
          onClick={() => setActiveSection("Patient")}
        >
          <PersonBadge /> Patient
        </ListGroup.Item>
        <ListGroup.Item 
          action 
          className="list-group-item-action" 
          active={activeSection === "Medications"} 
          onClick={() => setActiveSection("Medications")}
        >
          <Capsule /> Medications
        </ListGroup.Item>
        <ListGroup.Item 
          action 
          className="list-group-item-action" 
          active={activeSection === "Allergies"} 
          onClick={() => setActiveSection("Allergies")}
        >
          <ExclamationTriangle /> Allergies
        </ListGroup.Item>
        <ListGroup.Item 
          action 
          className="list-group-item-action" 
          active={activeSection === "Conditions"} 
          onClick={() => setActiveSection("Conditions")}
        >
          <ClipboardHeart /> Conditions
        </ListGroup.Item>
        <ListGroup.Item 
          action 
          className="list-group-item" 
          active={activeSection === "Immunizations"} 
          onClick={() => setActiveSection("Immunizations")}
        >
          <ShieldCheck /> Immunizations
        </ListGroup.Item>

        <ListGroup.Item 
          action 
          className="list-group-item" 
          active={activeSection === "Encounters"} 
          onClick={() => setActiveSection("Encounters")}
        >
          <CalendarEvent /> Encounters
        </ListGroup.Item>

        <ListGroup.Item 
          action 
          className="list-group-item-action" 
          active={activeSection === "Summary"} 
          onClick={() => setActiveSection("Summary")}
        >
          <FileEarmarkText /> Summary
        </ListGroup.Item>
        
      </ListGroup>
    </div>
  );
}

export default SidebarNav;