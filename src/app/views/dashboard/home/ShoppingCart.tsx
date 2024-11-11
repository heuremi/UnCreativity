import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ShoppingCart.css';

interface CartItem {
  id: number;
  titulo: string;
  descripcion: string;
  autor: string;
  imagenUrl: string;
  precio: number;
}

const ShoppingCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = sessionStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      sessionStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const clearCart = () => {
    sessionStorage.removeItem('cart'); 
    setCartItems([]); 
    window.location.reload();
  };

  const handleCheckout = () => {
    alert('Procediendo al pago...');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Carrito de Compras</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
        {cartItems.length === 0 ? (
          <p className="text-gray-500">El carrito está vacío</p>
        ) : (
          cartItems.map((item) => (
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
          ))
        )}
      </div>
      
      <div className="flex justify-between">
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
};

export default ShoppingCart;
