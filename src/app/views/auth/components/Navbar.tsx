import { Button, Container, Nav, Navbar as NavbarBs, InputGroup, FormControl } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { Search } from 'lucide-react'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

interface NavbarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

export function Navbar({ searchTerm, setSearchTerm }: NavbarProps) {
    return (
        <NavbarBs sticky="top" className="bg-white shadow-sm mb-3">
            <div className="flex flex-1 flex-col items-start justify-center gap-2">
                <div className="flex flex-1 w-full justify-between items-center">
                    <div>
                        <Nav className="px-3">
                            <Nav.Link to="/dashboard/home" as={NavLink}>
                                Inicio
                            </Nav.Link>
                            <Nav.Link to="/dashboard/profile" as={NavLink}>
                                Perfil
                            </Nav.Link>
                        </Nav>
                    </div>
                    <div className="px-3">
                        <FontAwesomeIcon icon={faCartShopping} size={'2x'} />
                    </div>
                </div>
                 
                <div className="w-5/6 px-0 self-center">
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
                </div>
                <div className="self-center">
                    <NavLink to="/auth/login">
                        <Button
                            style={{ width: "3rem", height: "3rem", position: "relative" }}
                            variant="outline-primary"
                            className="rounded-circle"
                        >
                        </Button>
                    </NavLink>
                </div>
            </div>
        </NavbarBs>
    );
}

/* <NavbarBs sticky="top" className="bg-white shadow-sm mb-3">
            <div className="flex flex-1 flex-col items-center justify-center gap-1">
                <div>
                    <Nav className="me-auto">
                        <Nav.Link to="/dashboard/home" as={NavLink}>
                            Inicio
                        </Nav.Link>
                        <Nav.Link to="/dashboard/profile" as={NavLink}>
                            Perfil
                        </Nav.Link>
                    </Nav>
                </div>
                
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
                <FontAwesomeIcon icon={faCartShopping} size={'3x'} />
            </div>
        </NavbarBs>*/