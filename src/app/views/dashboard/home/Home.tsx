import { Container, Form, FormControl, Navbar } from 'react-bootstrap';
import './Home.css';
import { useState } from 'react';

export function Home(){
    const [searchTerm, setSearchTerm] = useState<string>('');

    
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Form className="d-flex search-bar">
                        <FormControl
                            type="search"
                            placeholder="Buscar Cursos."
                            className="me-2"
                            aria-label="Search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </Form>
                </Container>
            </Navbar> 
            <h1 className="text-center mb-4">HOME</h1>
        </div>
    )


}