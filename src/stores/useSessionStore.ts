import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';


interface UseState {
    usuarioId?: number;
    nombre?: string;
    email?: string;
    cart: number[];
    compras: number[];
    setUsuarioId: (usuarioId?: number) => void;
    setNombre: (nombre?: string) => void;
    setEmail: (email?: string) => void;
    setCart: (cart: number[]) => void;
    setCompras: ((compras: number[]) => void);
}

const useSessionStore = create<UseState>()(
    devtools(
        persist(
            (set, get) => ({
                usuarioId: undefined,
                nombre: undefined,
                email: undefined,
                cart: [],
                compras: [],
                setNombre: (nombre?: string) => set(() => ({nombre})),
                setEmail: (email?: string) => set(() => ({email})),
                setUsuarioId: (usuarioId?: number) => set(() => ({usuarioId})),
                setCart: (cart: number[]) => set(() => ({cart})),
                setCompras: (compras: number[]) => set(() => ({compras})),
            }), 
            {
                name: 'user-session',
                storage: createJSONStorage(() => localStorage),
            }
        )
    )
)
export default useSessionStore;