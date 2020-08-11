import { Button, Image, Nav, NavDropdown, Navbar } from "react-bootstrap";
import React from "react";

export default function MyNavbar(): JSX.Element {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">
        <Image src={""}></Image>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav>
          <Nav.Link href="#">THE ECOSYSTEM</Nav.Link>

          <NavDropdown title="SOLUTIONS" id="basic-nav-dropdown">
            <NavDropdown.Item href="#">FOR SCHOOLS</NavDropdown.Item>
            <NavDropdown.Item href="#">FOR AGENTS</NavDropdown.Item>
            <NavDropdown.Item href="#">PRICING</NavDropdown.Item>
          </NavDropdown>

          <Nav.Link href="#">ABOUT</Nav.Link>
          <Nav.Link href="#">CONTACT US</Nav.Link>
        </Nav>
        <Button>LOGIN</Button>
        <Button variant="btn-dark">START NOW FOR FREE!</Button>
      </Navbar.Collapse>
    </Navbar>
  );
}
