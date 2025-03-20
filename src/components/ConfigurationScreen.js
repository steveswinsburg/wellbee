import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NavbarHeader from "./NavbarHeader";

const DEFAULT_FHIR_URL = "https://aucore.aidbox.beda.software/fhir/";

function ConfigurationScreen() {
  const navigate = useNavigate();
  const [fhirBaseUrl, setFhirBaseUrl] = useState(localStorage.getItem("fhirBaseUrl") || DEFAULT_FHIR_URL);

  const handleSave = () => {

    // save base URL
    let cleanedUrl = fhirBaseUrl.trim().replace(/\/+$/, "");
    localStorage.setItem("fhirBaseUrl", cleanedUrl);
    navigate(-1); // Go back
  };

  return (
    <Container className="mt-3">
      <NavbarHeader title="Configuration">
        <Button variant="link" onClick={() => navigate(-1)}>Back</Button>
      </NavbarHeader>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>FHIR Server Base URL</Form.Label>
          <Form.Control
            type="url"
            value={fhirBaseUrl}
            onChange={(e) => setFhirBaseUrl(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleSave}>Save</Button>
      </Form>
    </Container>
  );
}

export default ConfigurationScreen;