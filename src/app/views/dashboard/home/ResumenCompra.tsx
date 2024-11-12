import React, { useEffect, useState } from 'react';
import './ShoppingCart.css';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

interface Curso {
    id: number;
    titulo: string;
    descripcion: string;
    autor: string;
    imagenUrl: string;
    precio: number;
}

export default function ResumenCompraPago() {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const history = useHistory(); 

    useEffect(() => {
        const storedCart = sessionStorage.getItem('cart');
        if (storedCart) {
          setCursos(JSON.parse(storedCart)); 
        }
    }, []);

    const totalCompra = cursos.reduce((total, curso) => total + curso.precio, 0)
  
    setTimeout(() => {
        sessionStorage.removeItem('cart');
    }, 3000);
    
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Resumen de Compra</h1>
            <div className="flex items-center justify-center text-green-600 mt-4">
                <CheckCircle className="mr-2 h-6 w-6" />
                <span className="text-lg font-semibold">Pago realizado con éxito</span>
            </div>
      
            <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
            {cursos.length === 0 ? (
                <p className="text-gray-500">El carrito está vacío</p>
            ) : (
                <div className="scrollable-container"> {/* Make this container scrollable */}
                {cursos.map((curso) => (
                  <div key={curso.id} className="flex justify-between items-center border-b py-2">
                    <div className="flex">
                      <img src={curso.imagenUrl} alt={curso.titulo} width={100} height={100} className="w-16 h-16 mr-4" />
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
            <span className="text-lg font-semibold">Total: ${totalCompra.toFixed(2)}</span>
          </div>
          <div className="flex justify-center mt-4">
            <Button 
                variant="primary" 
                onClick={() => history.push('/dashboard/home')}>Volver a la pagina principal</Button>
          </div>
        </div>
    );
};