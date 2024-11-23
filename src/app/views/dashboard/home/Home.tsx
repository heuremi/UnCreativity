import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Dropdown, Modal, FormControl } from 'react-bootstrap';
import { Filter, ChevronDown } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import { ApiCartErrorResponse, CartService } from '../../../../services/CartService';
import { Navbar } from '../../auth/components/Navbar';
import './Home.css';
import useSessionStore from '../../../../stores/useSessionStore';
import { AuthCourse } from '../../auth/components/AuthCourse';
import Curso from '../../../../interfaces/Curso';
import { ApiCursoErrorResponse, ApiCursoResponse, CourseService } from '../../../../services/CourseService';
import CursoCard from '../../../../components/CursoCard';
import { ApiCompraResponse, CompraService, GetComprasResponse } from '../../../../services/CompraService';


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
  const { usuarioId, setUsuarioId, setEmail, compras, setCompras} = useSessionStore();


  useEffect(() => {
    async function fetchCompras() {
      if(!usuarioId) {setCompras([]); return}
      const resp = await CompraService.GetCompras(usuarioId)
            if(resp.Code < 300 && resp.Code >= 200) {
                setCompras((resp as ApiCompraResponse<number[]>).Data)
            } else if (resp.Code === 404) { // vacio
                setCompras([])
            } else {
                setCompras([])
                alert('hubo un problema con el carrito')
                console.log((resp as ApiCartErrorResponse).Message)
            }            
        }
      fetchCompras()
  }, [])

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
              {filteredAndSortedCourses.map((course, _) => {
                return (
                  <CursoCard key={course.id} course={course} setSelectedCourse={setSelectedCourse} setShowModal={setShowModal} setShowLoginPrompt={setShowLoginPrompt}/>
                )
              })}
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
