import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import useSessionStore from "../../../../stores/useSessionStore";
import { enviroment } from "../../../../enviroments/enviroment";
import { ApiCompraResponse, Compra, CompraService } from "../../../../services/CompraService";
import { ApiCartErrorResponse } from "../../../../services/CartService";
import Curso from "../../../../interfaces/Curso";
import { ApiCursoErrorResponse, ApiCursoResponse, CourseService } from "../../../../services/CourseService";



export function ShoppingHistory() {
  const history = useHistory()
  const { usuarioId } = useSessionStore(); 
  const [compras, setCompras] = useState<Compra[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const cursoBaseUrl = enviroment.cursoBaseUrl;


  useEffect(() => {
    async function fetchCompras() {
      if(!usuarioId) {
        setCompras([]); 
        setLoading(false)
        setError("Usuario no autenticado")
        return
      }
      const resp = await CompraService.GetComprasWithDate(usuarioId)
      if(resp.Code < 300 && resp.Code >= 200) {
          setCompras((resp as ApiCompraResponse<Compra[]>).Data)
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
      console.log("Compras: ", compras)
      const resp = await CourseService.getCursosPorIds(compras.map((compra) => (compra.cursoId)))
      if(resp.Code >= 200 && resp.Code < 300) {
        const { Data } = resp as ApiCursoResponse<Curso[]>
        setCursos(Data)
        setLoading(false)
      } else {
        alert('Hubo un error intentando conectar con ms-curso')
        console.error("Error al obtener los cursos:", error);
        setError((resp as ApiCursoErrorResponse).Message || "Error al obtener los cursos.");
        console.log(resp.Code)
        console.log((resp as ApiCursoErrorResponse).Message)
      }
    }
    fetchCursos();
  }, [compras])

  async function fetchCursos(cursoIds: number[]) {
    try {
      const { data } = await axios.post(`${cursoBaseUrl}`, {
        query: `
          query {
            cursosById(ids: [${cursoIds}]) {
              id
              titulo
              imagenUrl
              categorias
            }
          }
        `
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const cursosData = data.data.cursosById as Curso[];
      setCursos(cursosData);
    } catch (error: any) {
      console.error("Error al obtener los cursos:", error);
      setError(error?.response?.data?.message || "Error al obtener los cursos.");
    }
  }

   const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="container mx-auto p-4">Cargando...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="title text-2xl font-bold mb-4">Historial de Compras</h1>
      {cursos.length > 0 ? (
        <div className="scrollable-container bg-white rounded-lg shadow-lg p-4 mb-4 max-h-96 overflow-y-auto">
          {cursos.map((curso) => {
            const compra = compras.find(c => c.cursoId === curso.id);
            return (
              <div key={curso.id} className="flex justify-between items-center border-b py-2">
                <div className="flex items-center">
                  <img 
                    src={curso.imagenUrl} 
                    alt={curso.titulo} 
                    className="w-16 h-16 mr-4 rounded object-cover" 
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                  <div>
                    <p className="text-lg font-semibold">{curso.titulo}</p>
                    <p className="text-sm text-gray-500">Fecha de compra: {compra ? (new Date(parseInt(compra.fecha))).toLocaleDateString() : "N/A"}</p>
                  </div>
                </div>
                <span className="text-lg font-semibold">${curso.precio.toFixed(2)}</span>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <p>No tienes compras realizadas.</p>
        </div>
      )}
      <Button variant="primary" onClick={() => history.push('/dashboard/home')}>
        Volver a la página principal
      </Button>
    </div>
  );
}
