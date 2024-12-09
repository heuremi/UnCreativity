import React, { useState, useEffect } from "react";
import { Button, Container, Nav, Navbar as NavbarBs, InputGroup, FormControl } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { Search } from 'lucide-react'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faMessage } from "@fortawesome/free-solid-svg-icons"; 
import useSessionStore from "../../../../stores/useSessionStore";
import { ApiCartErrorResponse, ApiCartResponse, CartService } from "../../../../services/CartService";

interface NavbarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

export function Navbar({ searchTerm, setSearchTerm }: NavbarProps) {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const {usuarioId, setUsuarioId, cart, setCart} = useSessionStore();
    const [isChatVisible, setIsChatVisible] = useState<boolean>(false); // Nuevo estado

    useEffect(() => {
        const getIdsCursosCarrito = async () => {
            if(!usuarioId) {setCart([]);return}

            const resp = await CartService.GetCourses(usuarioId) 
            if(resp.Code < 300 && resp.Code >= 200) {
                setCart((resp as ApiCartResponse<number[]>).Data)
            } else if (resp.Code === 404) { // vacio
                setCart([])
            } else {
                setCart([])
                alert('hubo un problema con el carrito')
                console.log((resp as ApiCartErrorResponse).Message)
            }            
        }
        getIdsCursosCarrito()
    }, [])

    useEffect(() => {
        usuarioId ? setIsLoggedIn(true) : setIsLoggedIn(false);
    }, [usuarioId]);

    const handleLogout = () => {
        setUsuarioId(undefined)
        setCart([])
        window.location.reload()
    }

    const toggleChat = () => {
        setIsChatVisible(!isChatVisible);
    }

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
                <div className="flex items-center">
                    <div className={"px-3 pt-0 no-underline aspect-square overflow-hidden rounded-full justify-center items-center " + (cart.length === 0 ? "" : "hover:bg-slate-100 duration-200")}>
                        <Nav.Link className="hover:no-underline" to="/dashboard/cart" disabled={cart.length === 0 ? true : false} as={NavLink}>
                            { cart.length === 0 ? <></> :
                                <div className={`w-6 h-6 bg-red-500 border-white border-2
                                    rounded-full overflow-hidden 
                                    text-center justify-self-end relative top-3 left-2
                                    no-underline justify-center items-center content-center
                                    transform transition-transform duration-700 ease-in-out
                                    animate-bounce`}
                                >
                                    <p className="hover:no-underline text-xs text-white self-center">
                                        {cart.length}
                                    </p>
                                </div>
                            }
                            <div className={cart.length === 0 ? "text-center justify-self-end relative top-6 no-underline justify-center items-center content-center opacity-50" : ""}>
                                <FontAwesomeIcon icon={faCartShopping} size={'2x'} />
                            </div>
                        </Nav.Link>
                    </div>
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

            {isLoggedIn && (
                <button onClick={handleLogout}>Cerrar sesión</button>
            )}
            </div>
        </div>
        <div className="fixed bottom-4 right-4 rounded-full bg-blue-500 p-4 shadow-lg" onClick={toggleChat}>
            <FontAwesomeIcon icon={faMessage} size={'2x'} color="white" />
        </div>
        {isChatVisible && (
            <div className="fixed bottom-28 right-4 w-80 h-96 rounded-lg">
                <iframe
                    src="https://cdn.botpress.cloud/webchat/v2.2/shareable.html?configUrl=https://files.bpcontent.cloud/2024/12/09/21/20241209211920-S1VWBLNV.json"
                    height="100%"
                    allow="microphone; clipboard-read; clipboard-write"
                ></iframe>
            </div>
        )}
        </NavbarBs>
    );
}
