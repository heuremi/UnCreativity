import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Dropdown, Modal, FormControl } from 'react-bootstrap';
import { Search, Filter, ChevronDown } from 'lucide-react';
import './Home.css';
import { useHistory } from 'react-router-dom';
import { Navbar } from '../../auth/components/Navbar';
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
  const localCategorias = ["All"];

  useEffect(() => {
    async function fetchCursos() {
      const data = await getCursos();
      setCursos(data);
    }
    fetchCursos();
  }, []);

  const filteredAndSortedCourses = cursos
    .filter(course => {
      const matchesSearchTerm = course.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.subtitulo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === "All" || course.categorias.includes(selectedCategory); //probando

      return matchesSearchTerm && matchesCategory;
    })
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.titulo.localeCompare(b.titulo)
        : b.titulo.localeCompare(a.titulo)
    );

  return (
    <div>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Container>
        <div className="d-flex align-items-center mb-3">
          <Dropdown className="me-2">
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
              <Filter size={20} /> {selectedCategory} <ChevronDown size={20} />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {localCategorias.map((categorias) => (
                <Dropdown.Item key={categorias} onClick={() => setSelectedCategory(categorias)}>
                  {categorias}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          
          <Button
            variant="outline-secondary"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            Sort {sortOrder === "asc" ? "A-Z" : "Z-A"}
          </Button>
        </div>

        {/* Listado de cursos */}
        <Row>
          {filteredAndSortedCourses.map((course) => (
            <Col key={course.id} xs={12} md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{course.titulo}</Card.Title>
                  <Card.Text>{course.subtitulo}</Card.Text>
                  <Card.Text>Categoría: {course.categorias.join(", ")}</Card.Text>
                  <Card.Text>Autor: {course.autor}</Card.Text>
                  <Card.Text>Idioma: {course.idioma}</Card.Text>
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
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Detalle de los cursos */}
        {selectedCourse && (
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{selectedCourse.titulo}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p><strong>Categoría:</strong> {selectedCourse.categorias}</p>
              <p><strong>Descripción:</strong> {selectedCourse.descripcion}</p>
              <p><strong>Autor:</strong> {selectedCourse.autor}</p>
              <p><strong>Idioma:</strong> {selectedCourse.idioma}</p>
              <p><strong>Calificación:</strong> {selectedCourse.calificacion.toFixed(1)} / 5</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cerrar
              </Button>
              <Button variant="primary" onClick={() => setShowLoginPrompt(true)}>
                Agregar al carrito
              </Button>
            </Modal.Footer>
          </Modal>
        )}

        {/* Modal de inicio de sesión/invitado */}
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
                placeholder="email@example.com"
                className="mt-2"
              />
              <Button variant="primary" className="mt-2" onClick={() => alert("Curso enviado al correo.")}>
                Enviar
              </Button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowLoginPrompt(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}
