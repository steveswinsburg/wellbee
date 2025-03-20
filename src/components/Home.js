import React, { useState } from "react";
import { Container, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Gear } from "react-bootstrap-icons";
import NavbarHeader from "./NavbarHeader";
import PatientPicker from "./PatientPicker";

function Home() {
  const [fhirBaseUrl] = useState(localStorage.getItem("fhirBaseUrl") || "");

  return (
    <Container className="mt-5">
      
      <NavbarHeader>
        <Link to="/config">
          <Gear size={28} />
        </Link>
      </NavbarHeader>

      {!fhirBaseUrl ? (
        <Alert variant="warning">
          Welcome to Wellbee! Click the cog to get started.
        </Alert>
      ) : (
        <PatientPicker />
      )}
    </Container>
  );
}

export default Home;