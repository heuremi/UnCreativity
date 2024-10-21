import { Button, Container, Nav, Navbar as NavbarBs, InputGroup, FormControl } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { Search } from 'lucide-react'; 

interface NavbarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

export function Navbar({ searchTerm, setSearchTerm }: NavbarProps) {
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
                
                <InputGroup className="ms-3">
                    <InputGroup.Text>
                        <Search size={20} />
                    </InputGroup.Text>
                    <FormControl
                        placeholder="Buscar cursos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </InputGroup>

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
