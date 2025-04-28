'use client';

import Login from '@/components/Login';
import Register from '@/components/Register';
import Welcome from '@/components/Welcome';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    loggedInUser: string;
    setLoggedInUser: (user: string) => void;
    showLogin: boolean;
    showRegister: boolean;
    showWelcome: boolean;
    openLogin: () => void;
    openRegister: () => void;
    openWelcome: () => void;
    closeAllModals: () => void;
    openScoreboard: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            setLoggedInUser(storedUser);
        }
    }, []);

    const openLogin = () => {
        setShowLogin(true);
    };

    const handleLoginSuccess = (username: string) => {
        setLoggedInUser(username);
        setShowLogin(false);
        setShowWelcome(true);
        localStorage.setItem('loggedInUser', username);
    };

    const openRegister = () => {
        closeAllModals();
        setShowRegister(true);
    };

    const openWelcome = () => {
        closeAllModals();
        setShowWelcome(true);
    };

    const closeAllModals = () => {
        setShowLogin(false);
        setShowRegister(false);
        setShowWelcome(false);
    };

    const openScoreboard = () => {
        if (typeof window !== 'undefined' && window.openScoreboardFromDropdown) {
            window.openScoreboardFromDropdown();
        }
    };

    const logout = () => {
        setLoggedInUser('');
        localStorage.removeItem('loggedInUser');
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider
            value={{
                loggedInUser,
                setLoggedInUser,
                showLogin,
                showRegister,
                showWelcome,
                openLogin,
                openRegister,
                openWelcome,
                closeAllModals,
                openScoreboard,
                logout
            }}
        >
            {children}

            {showLogin && (
                <Login
                    onClose={() => setShowLogin(false)}
                    onSwitchToRegister={() => {
                        setShowLogin(false);
                        setShowRegister(true);
                    }}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}

            {showRegister && (
                <Register
                    onClose={() => setShowRegister(false)}
                    onSwitchToLogin={() => {
                        setShowRegister(false);
                        setShowLogin(true);
                    }}
                />
            )}

            {showWelcome && (
                <Welcome
                    username={loggedInUser}
                    onClose={() => setShowWelcome(false)}
                    onPlayNow={() => {
                        window.location.href = '/play/solo/timetrial';
                    }}
                    onViewRecord={() => {
                        window.openScoreboardFromDropdown?.();
                        setShowWelcome(false);
                    }}
                />
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}


