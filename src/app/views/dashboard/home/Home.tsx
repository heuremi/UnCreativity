import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Dropdown, Modal, FormControl } from 'react-bootstrap';
import { Filter, ChevronDown } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import { ApiCartErrorResponse, CartService } from '../../../../services/CartService';
import { Navbar } from '../../auth/components/Navbar';
import './Home.css';
import useSessionStore from '../../../../stores/useSessionStore';
import { AuthCourse } from '../../auth/components/AuthCourse';
import Curso from '../../../interfaces/Curso';
import { ApiCursoErrorResponse, ApiCursoResponse, CourseService } from '../../../../services/CourseService';



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
  const { usuarioId, nombre, email, setUsuarioId, setEmail, cart, setCart } = useSessionStore();


  useEffect(() => {
    async function fetchCursos() {
      const resp = await CourseService.getCursos()
      if(resp.Code >= 200 && resp.Code < 300) {
        const { Data } = resp as ApiCursoResponse<Curso[]>
        setCursos(Data)
        const categoriasUnicas = new Set<string>();
        Data.forEach(curso => {
          curso.categorias.forEach(categoria => {
            categoriasUnicas.add(categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase())
          })
        })
        setCategorias(['All', ...Array.from(categoriasUnicas)])
      } else {
        alert('Hubo un error intentando conectar con ms-curso')
        console.log(resp.Code)
        console.log((resp as ApiCursoErrorResponse).Message)
      }
    }
    fetchCursos();
  }, [])


  const handleAddToCart = async (course: Curso) => {
    if (usuarioId) {
      const resp = await CartService.AddCourse(usuarioId, course.id)
      if( resp.Code >= 200 && resp.Code < 300) {
        setCart([...cart, course.id])
        //alert('Curso agregado al carrito');
      } else {
        const err = resp as ApiCartErrorResponse
        alert(err.Message)
      } 
    } else {
      setShowLoginPrompt(true);
    }
  };

  const handleGuestLogin = async () => {
    const guestEmail = userEmail || 'correo@example.com';
    const id = (await AuthCourse.registerUserInvited()).data.createCliente.id; 
    setEmail(guestEmail)
    setUsuarioId(id)
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
                    <Card.Body className='w-full'> {course.imagenUrl && (
                      <img
                      src={course.imagenUrl}
                      alt="Course Image"
                      className="card-img-top sm:max-h-[155px] md:max-h-[155px] lg:max-h-[225px] object-cover"
                      //style={{ maxHeight: '225px', objectFit: 'cover' }}
                      /> )}
                      <Card.Title>{course.titulo}</Card.Title>
                      <Card.Text>{course.subtitulo}</Card.Text>
                      <Card.Text>Categorías: {course.categorias.join(', ')}</Card.Text>
                      <Card.Text>Autor: {course.autor}</Card.Text>
                      <Card.Text>Lenguaje: {course.idioma}</Card.Text>
                      <Card.Text>Calificación: {course.calificacion.toFixed(1)}</Card.Text>
                      <div className='flex flex-col gap-1'>
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
                      </div>
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
