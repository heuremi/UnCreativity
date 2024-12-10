import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import './Profile.css'; 
import { ProfileData } from '../../../../interfaces/ProfileData';
import { useHistory } from 'react-router-dom';
import useSessionStore from '../../../../stores/useSessionStore';

async function obtenerPerfil(id: string): Promise<ProfileData | null> {
    const query = `
    {
        clientes {
            id
            email
            nombre
            apellido
            telefono
            clave
        }
    }
    `;

    try {
        const response = await axios.post('http://localhost:3002/graphql/usuario', { query });
        const clientes: ProfileData[] = response.data.data.clientes;
        const cliente = clientes.find((cliente: ProfileData) => cliente.id.toString() === id);

        if (cliente) {
            return cliente;
        } else {
            console.error(`Cliente con ID ${id} no encontrado`);
            return null;
        }

    } catch (error: any) {
        if (error.response) {
            console.error('Error del servidor:', error.response.data);
        } else {
            console.error('Error en la solicitud:', error.message);
        }
        alert('Hubo un error al obtener el perfil');
        return null;
    }
}

export function Profile() {
    const [profileData, setProfileData] = useState<ProfileData>({
        id : '',
        email: '',
        nombre: '',
        apellido: '',
        rut: '',
        telefono: '', 
        admin_S: false,
        clave: ''
    });
    const { usuarioId } = useSessionStore();
    const id = usuarioId ? usuarioId.toString() : '';
    const history = useHistory();

    useEffect(() => {
        if (id) {
            obtenerPerfil(id).then(cliente => {
                if (cliente) {
                    setProfileData(cliente);
                }
            });
        } else {
            console.log('ID no encontrado en localStorage');
        }
    }, [id]); 

    const handleBackClick = () => {
        history.push('/dashboard/home');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const updateProfile = async () => {
        const query = `
            mutation {
                updateCliente(updateCliente: {
                    id: "${profileData.id}",
                    email: "${profileData.email}",
                    nombre: "${profileData.nombre}",
                    apellido: "${profileData.apellido}",
                    telefono: "${profileData.telefono}",
                    clave: "${profileData.clave}"
                }) {
                    email
                }
            }
        `;

        try {
            const response = await axios.post('http://localhost:3002/graphql/usuario', { query });
            if (response.data && response.data.data) {
                console.log('Respuesta de actualización:', response.data);
                alert('Perfil actualizado con éxito');
                history.goBack();
            } else {
                console.error("Respuesta de la API no contiene datos válidos:", response.data);
                alert('Hubo un error al actualizar el perfil');
            }
        } catch (error: any) {
            if (error.response) {
                console.error('Error del servidor:', error.response.data);
            } else {
                console.error('Error en la solicitud:', error.message);
            }
            alert('Hubo un error al actualizar el perfil');
        }
    };

    return (
        <Container className="profile-container">
            <Row className="justify-content-center">
                <Col xs={12} md={10} lg={8}>
                    <Card className="card-profile shadow-lg rounded">
                        <Card.Body>
                            <h2 className="text-center text-primary mb-4">Editar Perfil</h2>
                            <Form onSubmit={updateProfile}>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label><strong>Nombre</strong></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="nombre"
                                                value={profileData.nombre}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label><strong>Apellido</strong></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="apellido"
                                                value={profileData.apellido}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
    
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label><strong>Contraseña</strong></Form.Label>
                                            <Form.Control
                                                type="password" 
                                                name="clave" 
                                                value={profileData.clave}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label><strong>Teléfono</strong></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="telefono"
                                                value={profileData.telefono}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
    
                                <Row className="mb-4">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label><strong>Email</strong></Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={profileData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
    
                                <Row className="mb-2">
                                    <Col>
                                        <Button type="submit" className="btn btn-primary w-100">
                                            Guardar cambios
                                        </Button>
                                        <Button onClick={handleBackClick} className="btn btn-primary w-100">
                                            Volver atrás
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>  
                </Col>
            </Row>
        </Container>
    );
}
