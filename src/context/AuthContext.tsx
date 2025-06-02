import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

interface User {
    id: number;
    email: string;
    roles: string[];
}

interface AuthContextType {
    isAuthenticated: boolean;
    roles: string[];
    user: User | null; // Añadir user
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
    const [roles, setRoles] = useState<string[]>(authService.getRoles());
    const [user, setUser] = useState<User | null>(authService.getUser()); // Añadir estado para user

    const login = () => {
        setIsAuthenticated(true);
        setRoles(authService.getRoles());
        setUser(authService.getUser()); // Actualizar user al iniciar sesión
    };

    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
        setRoles([]);
        setUser(null); // Limpiar user al cerrar sesión
    };

    useEffect(() => {
        setIsAuthenticated(authService.isAuthenticated());
        setRoles(authService.getRoles());
        setUser(authService.getUser()); // Inicializar user
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, roles, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};