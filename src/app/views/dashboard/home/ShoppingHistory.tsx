import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import useSessionStore from "../../../../stores/useSessionStore";
import { enviroment } from "../../../../enviroments/enviroment";

interface Compra {
  cursoId: string;
  fecha: string;
}

interface Curso {
  id: string;
  titulo: string;
  autor: string;
  precio: number;
  fecha: string;
  imagenUrl: string;
  descripcion: string;
}

interface GetComprasResponse {
  compras: Compra[];
}

export function ShoppingHistory() {
  const history = useHistory()
  const { usuarioId } = useSessionStore(); 
  const [compras, setCompras] = useState<Compra[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = enviroment.baseUrl;
  const cursoBaseUrl = enviroment.cursoBaseUrl;

  useEffect(() => {
    if (usuarioId) {
      fetchCompras(usuarioId);
    } else {
      setLoading(false);
      setError("Usuario no autenticado.");
    }
  }, [usuarioId]);

  async function fetchCompras(usuarioId: number) {
    const query = `
      {
          compras(filtro: {
              clienteId: ${usuarioId}
          }) {
              cursoId
              fecha
          }
      }
    `;

    try {
      const { data } = await axios.post(`${baseUrl}/compra/`, { query }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const resp = data.data as GetComprasResponse;
      setCompras(resp.compras);

      if (resp.compras.length > 0) {
        const cursoIds = resp.compras.map((compra) => parseInt(compra.cursoId));
        await fetchCursos(cursoIds);
      } else {
        setCursos([]);
      }
    } catch (error: any) {
      console.error("Error al obtener las compras:", error);
      setError(error?.response?.data?.message || "Error al obtener las compras.");
    } finally {
      setLoading(false);
    }
  }

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
                    <p className="text-sm text-gray-500">Fecha de compra: {compra ? formatDate(compra.fecha) : "N/A"}</p>
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
