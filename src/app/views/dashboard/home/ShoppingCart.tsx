import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './ShoppingCart.css';
import axios from 'axios';
import { ApiCursoErrorResponse, ApiCursoResponse, CourseService } from '../../../../services/CourseService';
import useSessionStore from '../../../../stores/useSessionStore';
import Curso from '../../../interfaces/Curso';
import { ApiCartErrorResponse, CartService } from '../../../../services/CartService';
import { ApiCompraResponse, CompraService, CreateResponse } from '../../../../services/CompraService';

export interface CartItem {
  id: number;
  titulo: string;
  descripcion: string;
  autor: string;
  imagenUrl: string;
  precio: number;
}

const ShoppingCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  var total = 0;
  const { usuarioId, cart, setCart } = useSessionStore()


  useEffect(() => {
    async function fetchCursosCarrito() {
      const resp = await CourseService.getCursosPorIds(cart)
      console.log(resp)
      if(resp.Code >= 200 && resp.Code < 300 ) {
        const { Data } = resp as ApiCursoResponse<Curso[]>
        setCartItems(Data)
      } else {
        alert("Error al conectar con ms-carrito")
        console.log(resp.Code)
        console.log((resp as ApiCursoErrorResponse).Message)
        setCartItems([])
      }
    }
    fetchCursosCarrito()
  }, [cart])

  /*
  useEffect(() => {
    if (cartItems.length > 0) {
      sessionStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);
  */

  const clearCart = async () => {
    if(!usuarioId) {setCart([]); return}
    const resp = await CartService.DeleteAllCourse(usuarioId)
    if(resp.Code >= 200 && resp.Code < 300) {
      setCart([])
      setCartItems([])
      window.location.reload();
    } else {
      alert("Error al conectarse con ms-carrito")
      console.log(resp.Code)
      console.log((resp as ApiCartErrorResponse).Message)
    }
  };

  const handleCheckout = () => {
    if(cartItems.length === 0) {
      alert('Carrito vacio')
      return;
    } else { 
      alert('Procediendo al pago...');
      hanldePagoPrueba(usuarioId as number, Math.round(total))
    }
  };

  const hanldePagoPrueba = async (idUsuario : number, monto : number) => { // (cristian: solo para probar el webpay
    const resp = await CompraService.CreateCompra(idUsuario, monto)
    console.log(resp)
    if(resp.Code >= 200 && resp.Code < 300) {
      const { urlWebpay } = (resp as ApiCompraResponse<CreateResponse>).Data
      window.location.replace(urlWebpay)
    } else {
      alert('Error al intentar redireccionar la compra')
      console.log(resp)
    }
  }

  if(!usuarioId) {
    return (
      <div>
        <p>Vista de prueba, cliente con id nulo no deberia de estar aca</p>
      </div>
    )
  } else {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Carrito de Compras</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-500">El carrito está vacío</p>
          ) : (
            cartItems.map((item) => {
              total += item.precio
              return (
                <div key={item.id} className="flex justify-between items-center border-b py-2">
                  <div className="flex">
                    <img src={item.imagenUrl} alt={item.titulo} className="w-16 h-16 mr-4" />
                    <div>
                      <p className="text-lg font-semibold">{item.titulo}</p>
                      <p className="text-sm text-gray-500">{item.descripcion}</p>
                      <p className="text-sm text-gray-500">Autor: {item.autor}</p>
                    </div>
                  </div>
                  <span className="text-lg font-semibold">${item.precio}</span>
                </div>
              )
              })
          )}
        </div>
        
        <div className="flex justify-between gap-2">
          <button
            onClick={clearCart}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Eliminar Carrito
          </button>
          <button
            onClick={handleCheckout}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Pagar
          </button>
        </div>

        {/* Botón para volver a la página de inicio */}
        <div className="mt-4">
          <Link to="/dashboard/home">
            <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
              Volver a la Página Principal
            </button>
          </Link>
        </div>
      </div>
    );
  } 
};

export default ShoppingCart;
