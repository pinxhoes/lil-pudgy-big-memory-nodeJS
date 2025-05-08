'use client';

import Scoreboard from '@/components/Scoreboard';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import Login from '../../components/Login';
import Register from '../../components/Register';
import Welcome from '../../components/Welcome';

interface AuthContextType {
    loggedInUser: string;
    setLoggedInUser: (user: string) => void;
    openLogin: () => void;
    openRegister: () => void;
    openWelcome: () => void;
    closeAllModals: () => void;
    openScoreboard: () => void;
    logout: () => void;
    handleLoginSuccess: (username: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [loggedInUser, setLoggedInUserState] = useState('');
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [showScoreboard, setShowScoreboard] = useState(false);
    const [scoreboardData, setScoreboardData] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser && storedUser !== loggedInUser) {
            setLoggedInUserState(storedUser);
        }
    }, [loggedInUser]);

    const setLoggedInUser = (username: string) => {
        localStorage.setItem('loggedInUser', username);
        setLoggedInUserState(username);
    };

    const handleLoginSuccess = (username: string) => {
        setLoggedInUser(username);
        setShowLogin(false);
        setShowWelcome(true);
    };

    const openLogin = () => {
        closeAllModals();
        setShowLogin(true);
    };

    const openRegister = () => {
        closeAllModals();
        setShowRegister(true);
    };

    const openWelcome = () => {
        closeAllModals();
        setShowWelcome(true);
    };

    const openScoreboard = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/scoreboard`);
            const data = await res.json();
            setScoreboardData(data);
            closeAllModals();
            setShowScoreboard(true);
        } catch (error) {
            console.error('Failed to load scoreboard:', error);
        }
    };

    const closeAllModals = () => {
        setShowLogin(false);
        setShowRegister(false);
        setShowWelcome(false);
        setShowScoreboard(false);
    };

    const logout = () => {
        localStorage.removeItem('loggedInUser');
        setLoggedInUserState('');
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider
            value={{
                loggedInUser,
                setLoggedInUser,
                openLogin,
                openRegister,
                openWelcome,
                closeAllModals,
                openScoreboard,
                logout,
                handleLoginSuccess,
            }}
        >
            {children}

            {showLogin && (
                <Login onClose={() => setShowLogin(false)} onSwitchToRegister={openRegister} />
            )}

            {showRegister && (
                <Register onClose={() => setShowRegister(false)} onSwitchToLogin={openLogin} />
            )}

            {showWelcome && (
                <Welcome
                    username={loggedInUser}
                    onClose={() => setShowWelcome(false)}
                    onPlayNow={() => {
                        router.push('/play/timetrial');
                        setShowWelcome(false);
                    }}
                    onViewRecord={() => {
                        openScoreboard();
                        setShowWelcome(false);
                    }}
                />
            )}

            {showScoreboard && (
                <Scoreboard
                    onClose={() => setShowScoreboard(false)}
                    currentUsername={loggedInUser}
                    scoreboardData={scoreboardData}
                />
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};