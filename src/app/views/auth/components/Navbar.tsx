import React, { useState, useEffect } from "react";
import { Button, Container, Nav, Navbar as NavbarBs, InputGroup, FormControl } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { Search } from 'lucide-react'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

interface NavbarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const handleLogout = () => {

    //Al cerrar sesion se elimina el usuario actual y su carrito
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('cart');

    window.location.reload();
};

export function Navbar({ searchTerm, setSearchTerm }: NavbarProps) {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {

        // Revisa si existe usuario con sesión iniciada para mostrar botón de iniciar/cerrar sesión
        const user = sessionStorage.getItem("user");
        user ? setIsLoggedIn(true) : setIsLoggedIn(false);
    }, []);

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
                        Editar Perfil
                    </Nav.Link>
                    </Nav>
                </div>
                <div className="px-3">
                    <Nav.Link to="/dashboard/cart" as={NavLink}>
                        <FontAwesomeIcon icon={faCartShopping} size={'2x'} />
                    </Nav.Link>
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
            {!isLoggedIn && (
                <NavLink to="/auth/login">
                    <Button>Iniciar sesión</Button>
                </NavLink>
            )}

            {/* Render logout button if the user is logged in */}
            {isLoggedIn && (
                <button onClick={handleLogout}>Cerrar sesión</button>
            )}
            </div>
        </div>
        </NavbarBs>
    );
}
