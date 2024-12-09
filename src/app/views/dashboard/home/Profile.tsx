import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import './Profile.css'; 

export interface ProfileData {
    email: string;
    nombre: string;
    apellido: string;
    rut: string;
    telefono: string;
    admin_S: boolean;
    clave: string;
}

export function Profile() {
    const [profileData, setProfileData] = useState<ProfileData>({
        email: '',
        nombre: '',
        apellido: '',
        rut: '',
        telefono: '', 
        admin_S: false,
        clave: ''
    });

    useEffect(() => {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            try {
                const parsedProfile = JSON.parse(savedProfile);
                console.log('Perfil guardado:', parsedProfile);
                setProfileData(parsedProfile);
            } catch (error) {
                console.error("Error al analizar JSON desde localStorage:", error);
            }
        }
    }, []);

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
                updateCliente(datosActualizarCliente: {
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
        <Container className="profile-container-5">
            <Row className="justify-content-center">
                <Col md={10}>
                    <Card className="card-4" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        <Card.Body>
                            <h2 className="text-center perfil-1">Perfil de Usuario</h2>
                            <Form onSubmit={updateProfile}>
                                <Row className="boxtext-1">
                                    <Col>
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
                                    <Col>
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

                                <Row className="boxtext-1">
                                    <Col>
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
                                    <Col>
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

                                <Row className="boxtext-1">
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

                                <Row className="boxtext-1">
                                    <Col>
                                        <Button type="submit" className="w-100 btn btn-primary">
                                            Guardar cambios
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