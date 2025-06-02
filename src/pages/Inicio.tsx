// src/pages/Home.tsx
import React, { useEffect } from 'react';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const loginText = document.getElementById('login-text');
        const registerText = document.getElementById('register-text');
        if (loginText) loginText.classList.add('animate-slide-in-left');
        if (registerText) registerText.classList.add('animate-slide-in-right');
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 px-4">
            <div className="text-center space-y-6">
                <img src={logo} alt="Logo" className="h-24 w-auto mx-auto mb-8" />

                <h1 id="login-text" className="text-4xl md:text-5xl font-bold text-blue-700 opacity-0"
                    style={{ animation: 'slideInLeft 1s ease-out forwards' }}>
                    Bienvenido
                </h1>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                    {isAuthenticated ? (
                        <Link to="/dashboard">
                            <Button
                                label="Ir al Dashboard"
                                className="p-button-success w-full sm:w-auto text-lg px-6 py-3"
                            />
                        </Link>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button
                                    label="Iniciar Sesión"
                                    className="p-button-primary w-full sm:w-auto text-lg px-6 py-3"
                                />
                            </Link>
                            <Link to="/register">
                                <Button
                                    label="Registrarse"
                                    className="p-button-secondary w-full sm:w-auto text-lg px-6 py-3"
                                />
                            </Link>
                        </>
                    )}
                </div>

                <p className="text-gray-600 text-sm mt-6">
                    Bienvenido al Sistema de Gestión Bibliotecaria
                </p>
            </div>
        </div>
    );
};

export default Home;
