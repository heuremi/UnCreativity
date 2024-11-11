import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Dropdown, Modal, FormControl } from 'react-bootstrap';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import { ApiCartResponse, CartService } from '../../../../services/CartService';
import { Navbar } from '../../auth/components/Navbar';
import './Home.css';
import axios from 'axios';

interface Curso {
  id: number;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  calificacion: number;
  autor: string;
  idioma: string;
  categorias: string[];
  precio: number;
  imagenUrl: string;
}

async function getCursos() : Promise<Curso[]> {
  const query = `
    query {
      cursos {
        id
        titulo
        subtitulo
        descripcion
        autor
        idioma
        calificacion
        categorias
        precio
        imagenUrl
      }
    }
  `;

  try {
    const response = await axios.post('http://localhost:3001/graphql', { query });
    return response.data.data.cursos;
  } catch (error) {
    console.error('Error al obtener los cursos:', error);
    return [];
  }
}

export function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Curso | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const history = useHistory();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [localCategorias, setCategorias] = useState<string[]>(["All"]);
  const [userEmail, setUserEmail] = useState<string | null>(null); 

  // Si el usuario está logueado toma su id
  const user = JSON.parse(sessionStorage.getItem('user') || '{}'); 

  useEffect(() => {
    async function prueba(){
      const response = await CartService.GetCourses(17) as ApiCartResponse<number[]>
      console.log(response.Data)
    }
    prueba()
  }, []);

  useEffect(() => {
    async function fetchCursos() {
      const data = await getCursos(); 
      setCursos(data);

      // Cambio, aqui se guardan las categorías únicas existentes
      const categoriasUnicas = new Set<string>();
      data.forEach(curso => {
        curso.categorias.forEach(categoria => {
          categoriasUnicas.add(categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase());
        });
      });

      setCategorias(['All', ...Array.from(categoriasUnicas)]);
    }
    fetchCursos();
  }, []);

  const handleAddToCart = (course: Curso) => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (user?.id || user?.id === -10) {
      let cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
      cart.push(course);
      sessionStorage.setItem('cart', JSON.stringify(cart));

      alert('Curso agregado al carrito');
    } else {
      setShowLoginPrompt(true);
    }
  };

  const handleGuestLogin = () => {
    // Guarda los usuarios 'invitados' con id = -10
    const guestEmail = userEmail || 'correo@example.com';
    const guestUser = {
      id: -10,
      email: guestEmail,
      loggedIn: true
    };

    sessionStorage.setItem('user', JSON.stringify(guestUser));
    setShowLoginPrompt(false);
  };

  const filteredAndSortedCourses = cursos
    .filter(course => {
      const matchesSearchTerm = 
        (course.titulo && course.titulo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (course.subtitulo && course.subtitulo.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === "All" || course.categorias.includes(selectedCategory); //probando

      return matchesSearchTerm && matchesCategory;
    })
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.titulo.localeCompare(b.titulo)
        : b.titulo.localeCompare(a.titulo)
    );

    return (
      <div className='w-100'>
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className='w-100 flex-1 flex-col justify-center items-center content-center'>
          <div className="d-flex align-items-center mb-3 justify-self-start">
            <Dropdown className="me-2" drop='down'>
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" className="d-flex align-items-center px-3 py-2">
                <Filter size={20} /> {selectedCategory} <ChevronDown size={20} />
              </Dropdown.Toggle>
  
              <Dropdown.Menu flip={false}>
                {localCategorias.map((categorias) => (
                  <Dropdown.Item key={categorias} onClick={() => setSelectedCategory(categorias)}>
                    {categorias}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
  
            <Button
              variant="outline-secondary"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            </Button>
          </div>
  
          {/* List of courses */}
          <div>
            <Row className='justify-stretch items-center'>
              {filteredAndSortedCourses.map((course) => (
                <Col key={course.id} lg={4} md={6} sm={6} className="justify-self-center items-center justify-center">
                  <Card className='mb-4 justify-self-center w-full'>
                    <Card.Body className='w-full'>
                      <Card.Title>{course.titulo}</Card.Title>
                      <Card.Text>{course.subtitulo}</Card.Text>
                      <Card.Text>Categorías: {course.categorias.join(', ')}</Card.Text>
                      <Card.Text>Autor: {course.autor}</Card.Text>
                      <Card.Text>Lenguaje: {course.idioma}</Card.Text>
                      <Card.Text>Calificación: {course.calificacion.toFixed(1)}</Card.Text>
                      <Button
                        variant="primary"
                        onClick={() => {
                          setSelectedCourse(course);
                          setShowModal(true);
                        }}
                      >
                        Ver Detalles
                      </Button>
                      <Button
                        variant="success"
                        onClick={() => handleAddToCart(course)} 
                      >
                        Agregar al Carrito
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
  
          {/* Course detail modal */}
          {selectedCourse && (
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>{selectedCourse.titulo}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p><strong>Categorías:</strong> {selectedCourse.categorias.join(', ')}</p>
                <p><strong>Descripción:</strong> {selectedCourse.descripcion}</p>
                <p><strong>Autor:</strong> {selectedCourse.autor}</p>
                <p><strong>Lenguaje:</strong> {selectedCourse.idioma}</p>
                <p><strong>Calificación:</strong> {selectedCourse.calificacion.toFixed(1)} / 5</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cerrar
                </Button>
              </Modal.Footer>
            </Modal>
          )}
  
          {/* Login prompt modal */}
          <Modal show={showLoginPrompt} onHide={() => setShowLoginPrompt(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Iniciar Sesión o Continuar como Invitado</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>¿Quieres iniciar sesión o continuar como invitado?</p>
              <Button variant="secondary" onClick={() => history.push('/auth/login')}>
                Iniciar Sesión
              </Button>
              <div className="mt-3">
                <strong>O ingresa tu correo como invitado:</strong>
                <FormControl
                  type="email"
                  placeholder="ingresa un correo válido"
                  className="mt-2"
                  onChange={(e) => setUserEmail(e.target.value)}  // Update the email in state
                />
                <Button variant="primary" className="mt-2" onClick={handleGuestLogin}>
                  Continuar como invitado
                </Button>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowLoginPrompt(false)}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
}
