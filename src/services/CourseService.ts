import axios from "axios";
import { enviroment } from "../enviroments/enviroment";
import Curso from "../interfaces/Curso";



export interface ApiCursoErrorResponse {
    Code: number, 
    Message?: string
}

export interface ApiCursoResponse<T = any | undefined> {
    Code: number,
    Status: string,
    Data: T,
}


export class CourseService {

    private static cursoUrl = enviroment.cursoBaseUrl

    public static async getCursos(): Promise<ApiCursoErrorResponse | ApiCursoResponse<Curso[]>> {
        const query = `
            query {
                cursos {
                    id
                    titulo
                    subtitulo
                    descripcion
                    autor
                    idioma
                    calificacion
                    categorias
                    precio
                    imagenUrl
                }
            }
        `;
        try {
            const resp = await axios.post(
                `${this.cursoUrl}/graphql`, { query }
            )
            return {
                Code: resp.status,
                Status: resp.statusText,
                Data: resp.data.data.cursos
            }
        } catch (error: any) {
            return {
                Code: error?.code,
                Message: error?.message
            }
        }
    }

    public static async getCursosPorIds(ids : number[]): Promise<ApiCursoErrorResponse | ApiCursoResponse<Curso[]>> {
        const query = `
            query {
                cursosById(ids:[${ids}]) {
                    id
                    titulo
                    subtitulo
                    descripcion
                    autor
                    idioma
                    calificacion
                    categorias
                    precio
                    imagenUrl
                }
            }
        `;
        try {
            const resp = await axios.post(
                `${this.cursoUrl}/graphql`, { query }
            )
            console.log(resp)
            return {
                Code: resp.status,
                Status: resp.statusText,
                Data: resp.data.data.cursosById
            }
        } catch (error: any) {
            return {
                Code: error?.code,
                Message: error?.message
            }
        }
    }

   
}


/*
async function getCursos() : Promise<Curso[]> {
  const query = `
    query {
      cursos {
        id
        titulo
        subtitulo
        descripcion
        autor
        idioma
        calificacion
        categorias
        precio
        imagenUrl
      }
    }
  `;

  try {
    const response = await axios.post('http://localhost:3001/graphql', { query });
    return response.data.data.cursos;
  } catch (error) {
    console.error('Error al obtener los cursos:', error);
    return [];
  }
}
*/


  /*
  useEffect(() => {
    async function fetchCursos() {
      const data = await getCursos(); 
      setCursos(data);

      // Cambio, aqui se guardan las categorías únicas existentes
      const categoriasUnicas = new Set<string>();
      data.forEach(curso => {
        curso.categorias.forEach(categoria => {
          categoriasUnicas.add(categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase());
        });
      });

      setCategorias(['All', ...Array.from(categoriasUnicas)]);
    }
    fetchCursos();
  }, []);
  */