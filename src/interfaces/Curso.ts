export default interface Curso {
    id: number;
    titulo: string;
    subtitulo: string;
    descripcion: string;
    calificacion: number;
    autor: string;
    idioma: string;
    categorias: string[];
    precio: number;
    imagenUrl: string;
  }