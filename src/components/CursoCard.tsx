import { Button, Card, Col } from "react-bootstrap";
import AddCartButton from "./AddCartButton";
import Curso from "../interfaces/Curso";
import { SetStateAction, useState } from "react";
import useSessionStore from "../stores/useSessionStore";
import { ApiCartErrorResponse, CartService } from "../services/CartService";
import { Rating } from '@mui/material'


export default function CursoCard({course, setSelectedCourse, setShowModal, setShowLoginPrompt } : 
    {course: Curso, setSelectedCourse: (value: SetStateAction<Curso | null>) => void, setShowModal: (value: SetStateAction<boolean>) => void, setShowLoginPrompt: (value: boolean) => void}) {

    const { usuarioId, setCart, cart, compras, setCompras } = useSessionStore()

    const handleAddToCart = async (courseId: number): Promise<Boolean> => {
        if (usuarioId) {
            const resp = await CartService.AddCourse(usuarioId, courseId)
            if( resp.Code >= 200 && resp.Code < 300) {
                setCart([...cart, courseId])
                return true;
                //alert('Curso agregado al carrito');
            } else {
                const err = resp as ApiCartErrorResponse
                alert(err.Message)
                return false;
            } 
        } else {
              setShowLoginPrompt(true);
              return false;
        }
    };

    const handleDeleteToCart = async (courseId: number): Promise<boolean> => {
        if (usuarioId) {
            const resp = await CartService.DeleteCourse(usuarioId, courseId)
            if (resp.Code >= 200 && resp.Code < 300) {
                setCart([...cart.filter((cursoId) => cursoId !== courseId)]);
                return true;
            } else {
                const err = resp as ApiCartErrorResponse
                alert(err.Message)
                return false;
            }
        } else {
            setShowLoginPrompt(true)
            return false;
        }
    }


    const [inCart, setInCart] = useState(
        useSessionStore.getState().cart.includes(Number(course.id))
    );
    
    const handleOnClickButton = async () => {
        if(!inCart) {
            const success = await handleAddToCart(course.id)
            setInCart(success ? true : false)
        } else {
            const success = await handleDeleteToCart(course.id)
            setInCart(success ? false : true)
        }
    }

    if(compras && compras.includes(course.id)) {
      return <></>
    } else {
      return (
          <Col lg={4} md={6} sm={6} className="justify-self-center items-center justify-center">
            <Card className={`mb-4 justify-self-center w-full border-3 transition-all duration-500 ease-in-out ${inCart ? 'border-blue-500' : 'border-gray-300'}`}>
              <Card.Body className='w-full'> {course.imagenUrl && (
                <img
                src={course.imagenUrl}
                alt="Course Image"
                className="card-img-top card-img-bottom sm:max-h-[155px] md:max-h-[155px] lg:max-h-[225px] object-cover"
                //style={{ maxHeight: '225px', objectFit: 'cover' }}
                /> )}
                <Card.Title>{course.titulo}</Card.Title>
                <Card.Text>{course.subtitulo}</Card.Text>
                <Card.Text>Categorías: {course.categorias.join(', ')}</Card.Text>
                <Card.Text>Autor: {course.autor}</Card.Text>
                <Card.Text>Lenguaje: {course.idioma}</Card.Text>
                <Card.Text>
                  <Card.Text>Clasificación: </Card.Text>
                  <Rating name="Calificación" defaultValue={course.calificacion} readOnly precision={0.5}/>
                </Card.Text>
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
                  <AddCartButton courseId={course.id} handleAddToCart={(handleOnClickButton)} inCart={inCart} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        )
    }
};
