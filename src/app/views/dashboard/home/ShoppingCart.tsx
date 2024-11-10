import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importa Link para la navegación
import './ShoppingCart.css';

interface CartItem {
  id: number;
  name: string;
  price: number;
}

const ShoppingCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: 'Producto 1', price: 10 },
    { id: 2, name: 'Producto 2', price: 20 },
    { id: 3, name: 'Producto 3', price: 30 }
  ]);

  const clearCart = () => {
    setCartItems([]);
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
              <span className="text-lg">{item.name}</span>
              <span className="text-lg font-semibold">${item.price}</span>
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
