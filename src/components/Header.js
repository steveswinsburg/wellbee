
import React from "react";
import { Navbar, Container, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import wellbeeLogo from "../assets/wellbee-logo.png";

const Header = () => {

    return (
        <Navbar bg="light" variant="light" className="mb-1">
          <Container>
            <Navbar.Brand as={Link} to="/">
              <Image src={wellbeeLogo} alt="Wellbee Logo" height="100" className="mb-1" alt="Wellbee Logo" />
            </Navbar.Brand>
          </Container>
        </Navbar>
      );

}

export default Header;
