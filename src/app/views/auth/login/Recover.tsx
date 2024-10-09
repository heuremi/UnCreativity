import React, { useState } from 'react';
import './Recover.css';

export function Recover() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí puedes añadir la lógica para enviar la solicitud de recuperación
        alert(`Solicitud de recuperación enviada para ${email}`);
    };

    return (
        <div className="recover-container">
            <h1>Recuperar Contraseña</h1>
            <form onSubmit={handleSubmit} className="recover-form">
                <label htmlFor="email">Correo Electrónico</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Recuperar</button>
            </form>
        </div>
    );
}
