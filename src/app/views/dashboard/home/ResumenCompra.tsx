import React, { useEffect, useState } from 'react';
import './ShoppingCart.css';
import { Button } from 'react-bootstrap';
import { AlertCircle, CheckCircle, CircleAlert } from 'lucide-react';
import { ApiCursoErrorResponse, ApiCursoResponse, CourseService } from '../../../../services/CourseService';
import Curso from '../../../../interfaces/Curso';
import useSessionStore from '../../../../stores/useSessionStore';
import { ApiCartErrorResponse, CartService } from '../../../../services/CartService';
import { useHistory, useLocation  } from 'react-router-dom';
import { ApiCompraResponse, CommitResponse, CompraService } from '../../../../services/CompraService';
import { ClipLoader } from 'react-spinners';

export default function ResumenCompraPago() {
    const history = useHistory()
    const [cursos, setCursos] = useState<Curso[]>([]);


    const { usuarioId, cart, setCart } = useSessionStore(); 
    const [success, setSuccess] = useState(false);
    const [commitResponse, setCommitResponse] = useState<CommitResponse>()
    const [loading, setLoading] = useState(true)

    const { search }  = useLocation ()
    const queryParams = new URLSearchParams(search)
    const token = queryParams.get('token') ?? '-1'

    useEffect(() => {
      async function fetchStatusToken() {
        const resp = await CompraService.GetStatusToken(token)
        console.log(resp)
        if(resp.Code >= 200 && resp.Code < 300) {
          const { Data } = resp as ApiCompraResponse
          setCommitResponse(Data)
          setSuccess(Data.response_code === 0 ? true : false)
        } else {
          console.log(resp)
          setCommitResponse(undefined)
          setSuccess(false)
        }
        setTimeout(() => {
          setLoading(false)
        }, 300)
      }
      fetchStatusToken()
    }, [token])
  
    useEffect(() => {
      async function fetchCursosCarrito() {
        const resp = await CourseService.getCursosPorIds(cart)
        console.log(resp)
        if(resp.Code >= 200 && resp.Code < 300 ) {
          const { Data } = resp as ApiCursoResponse<Curso[]>
          setCursos(Data)
        } else {
          alert("Error al conectar con ms-carrito")
          console.log(resp.Code)
          console.log((resp as ApiCursoErrorResponse).Message)
          setCursos([])
        }
      }
      fetchCursosCarrito()
    }, [cart])

    const clearCart = async () => {
      if(!usuarioId) {setCart([]); return}
      const resp = await CartService.DeleteAllCourse(usuarioId)
      if(resp.Code >= 200 && resp.Code < 300) {
        setCart([])
      } else {
        alert("Error al conectarse con ms-carrito")
        console.log(resp.Code)
        console.log((resp as ApiCartErrorResponse).Message)
      }
    };

    const onClickPaginaPrincipalButton = async () => {
      if(success) {
        clearCart()
      }
      history.push('/dashboard/home')
    }

    
    const totalCompra = cursos.reduce((total, curso) => total + curso.precio, 0)
      
    if(loading) {
      return (
        <div className='flex flex-col items-center justify-center gap-5'>
          <h1 className="text-2xl font-bold mb-4">Cargando...</h1>
          <ClipLoader size={90} color='black' />
        </div>
      )
    } else { 
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{success ? "Resumen de Compra" : "Oh no!"}</h1>
            <div className="flex items-center justify-center text-green-600 mt-4 m-2">
                {
                  success ? 
                    <div className='flex flex-1 flex-row'>
                      <CheckCircle className="mr-2 h-6 w-6" />
                      <span className="text-lg font-semibold">Pago realizado con éxito</span>
                    </div>  
                    :
                    <div className='flex flex-1 flex-row'>
                      <CircleAlert className="mr-2 h-6 w-6" color='red' />
                      <span className="text-lg font-semibold text-red-600">Hubo un error en el pago!</span>
                    </div>
                }
            </div>
      
            <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
            {cursos.length === 0 ? (
                <p className="text-gray-500">El carrito está vacío</p>
            ) : (
                <div className="scrollable-container"> {/* Make this container scrollable */}
                {cursos.map((curso) => (
                  <div key={curso.id} className="flex justify-between items-center border-b py-2">
                    <div className="flex items-center justify-center">
                      <img src={curso.imagenUrl} alt={curso.titulo} width={100} height={100} className="w-16 h-16 mr-4 justify-self-center" />
                      <div>
                        <p className="text-lg font-semibold">{curso.titulo}</p>
                        <p className="text-sm text-gray-500">{curso.descripcion}</p>
                        <p className="text-sm text-gray-500">Autor: {curso.autor}</p>
                      </div>
                    </div>
                    <span className="text-lg font-semibold">${curso.precio}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-between">
            <span className="text-lg font-semibold">Total: {success ? totalCompra.toFixed(2) : "No se ha realizado ningún cargo a tu tarjeta."}</span>
          </div>
          <div className="flex justify-center mt-4">
            <Button 
                variant="primary" 
                onClick={onClickPaginaPrincipalButton}>Volver a la pagina principal</Button>
          </div>
        </div>
    );
  }
};