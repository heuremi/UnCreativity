import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
//import './Profile.css';

export interface ProfileData {
    fullName: string;
    email: string;
    name: string;
    lastName: string;
    rut: string;
    phoneNumber: string;
}

export function Profile() {
    const [profileData, setProfileData] = useState<ProfileData>({
        fullName: '',
        email: '',
        name: '',
        lastName: '',
        rut: '',
        phoneNumber: ''
    });

    useEffect(() => {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            setProfileData(JSON.parse(savedProfile));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfileData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Profile Data:', profileData);
        localStorage.setItem('userProfile', JSON.stringify(profileData));
    };

    return (
        <Container className= "mt-5">
            <Row className="justify-content-center">
                <Col md={12}>
                    <Card className="p-6">
                        <Card.Body>
                            <h2 className="text-center mb-4">Perfil de Usuario</h2>
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label><strong>Nombre</strong></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={profileData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label><strong>Apellidos</strong></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="lastName"
                                                value={profileData.lastName}
                                                onChange={handleChange}
                                                required
            
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label><strong>Correo Electrónico</strong></Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={profileData.email}
                                                onChange={handleChange}
                                                readOnly // Esto hace que el campo sea de solo lectura
                                                style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }} // Estilo visual
                                                required
                                                
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label><strong>Rut</strong></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="rut"
                                                value={profileData.rut}
                                                onChange={handleChange}
                                                required
                                                
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label><strong>Teléfono</strong></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="phoneNumber"
                                                value={profileData.phoneNumber}
                                                onChange={handleChange}
                                                required
                                            
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Button type="submit" className="w-100 btn btn-primary">
                                            Guardar Perfil
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
