import { useState } from 'react';
import { Container, Row, Col, Card, Button, Dropdown, Modal, FormControl } from 'react-bootstrap';
import { Search, Filter, ChevronDown } from 'lucide-react';
import './Home.css';
import { useHistory } from 'react-router-dom';
import { Navbar } from '../../auth/components/Navbar'; // Asegúrate de que la ruta sea correcta

interface Course {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  instructor: string;
  language: string;
  rating: number;
  category: string;
}

export function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const history = useHistory();

  const courses: Course[] = [
    { id: 1, title: "Introduction to React", subtitle: "Learn React Basics", description: "A comprehensive introduction to React, covering components, state, and props.", instructor: "Jane Doe", language: "Typescript", rating: 4.5, category: "Web Development" },
    { id: 2, title: "Advanced JavaScript", subtitle: "Master JS Concepts", description: "Dive deep into JavaScript, exploring advanced topics like closures, prototypes, and async programming.", instructor: "John Smith", language: "Javascript", rating: 4.8, category: "Programming" },
    { id: 3, title: "UX Design Fundamentals", subtitle: "Create Intuitive Interfaces", description: "Learn the principles of user experience design and how to create user-friendly interfaces.", instructor: "Alice Johnson", language: "C++", rating: 4.2, category: "Design" },
    { id: 4, title: "Data Science Basics", subtitle: "Start Your Data Journey", description: "An introduction to data science, covering statistics, Python, and basic machine learning concepts.", instructor: "Bob Williams", language: "R", rating: 4.6, category: "Data Science" },
    { id: 5, title: "Mobile App Development", subtitle: "Build iOS and Android Apps", description: "Learn to develop mobile applications for both iOS and Android platforms using React Native.", instructor: "Charlie Brown", language: "Typescript", rating: 4.7, category: "Mobile Development" },
    { id: 6, title: "Python for Beginners", subtitle: "Python Programming 101", description: "Start your programming journey with Python, covering basic syntax, data structures, and simple algorithms.", instructor: "Eva Green", language: "Python", rating: 4.4, category: "Programming" },
  ];

  const categories = ["All", "Web Development", "Programming", "Design", "Data Science", "Mobile Development"];

  const filteredAndSortedCourses = courses
    .filter(course => {
      const matchesSearchTerm = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.subtitle.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;

      return matchesSearchTerm && matchesCategory;
    })
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
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
              {categories.map((category) => (
                <Dropdown.Item key={category} onClick={() => setSelectedCategory(category)}>
                  {category}
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
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Text>{course.subtitle}</Card.Text>
                  <Card.Text>Categoría: {course.category}</Card.Text>
                  <Card.Text>Profesor: {course.instructor}</Card.Text>
                  <Card.Text>Lenguaje: {course.language}</Card.Text>
                  <Card.Text>Calificación: {course.rating.toFixed(1)}</Card.Text>
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
              <Modal.Title>{selectedCourse.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p><strong>Categoría:</strong> {selectedCourse.category}</p>
              <p><strong>Descripción:</strong> {selectedCourse.description}</p>
              <p><strong>Profesor:</strong> {selectedCourse.instructor}</p>
              <p><strong>Lenguaje:</strong> {selectedCourse.language}</p>
              <p><strong>Calificación:</strong> {selectedCourse.rating.toFixed(1)} / 5</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cerrar
              </Button>
              <Button variant="primary" onClick={() => setShowLoginPrompt(true)}>
                Comprar
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
