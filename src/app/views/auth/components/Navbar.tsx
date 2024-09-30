import { Button, Container, Nav, Navbar as NavbarBs } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export function Navbar() {
    return (
        <NavbarBs sticky="top" className="bg-white shadow-sm mb-3">
            <Container>
                <Nav className="me-auto">
                    <Nav.Link to="/dashboard/home" as={NavLink}>
                        Inicio
                    </Nav.Link>
                    <Nav.Link to="/dashboard/profile" as={NavLink}>
                        Perfil
                    </Nav.Link> 
                </Nav>
                <NavLink to="/auth/login">
                    <Button
                        style={{ width: "3rem", height: "3rem", position: "relative" }}
                        variant="outline-primary"
                        className="rounded-circle"
                    >
                    </Button>
                </NavLink>
            </Container>
        </NavbarBs>
    );
}