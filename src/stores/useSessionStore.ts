import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';


interface UseState {
    usuarioId?: number;
    nombre?: string;
    email?: string;
    cart: number[];
    setUsuarioId: (usuarioId?: number) => void;
    setNombre: (nombre?: string) => void;
    setEmail: (email?: string) => void;
    setCart: (cart: number[]) => void;
}

const useSessionStore = create<UseState>()(
    devtools(
        persist(
            (set, get) => ({
                usuarioId: undefined,
                nombre: undefined,
                email: undefined,
                cart: [],
                setNombre: (nombre?: string) => set(() => ({nombre})),
                setEmail: (email?: string) => set(() => ({email})),
                setUsuarioId: (usuarioId?: number) => set(() => ({usuarioId})),
                setCart: (cart: number[]) => set(() => ({cart}))
            }), 
            {
                name: 'user-session',
                storage: createJSONStorage(() => localStorage),
            }
        )
    )
)
export default useSessionStore;