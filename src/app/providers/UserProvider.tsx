'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

type UserContextType = {
    loggedInUser: string;
    setLoggedInUser: (username: string) => void;
    logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [loggedInUser, setLoggedInUserState] = useState('');

    const setLoggedInUser = (username: string) => {
        setLoggedInUserState(username);
    };

    const logout = () => {
        setLoggedInUserState('');
    };

    return (
        <UserContext.Provider value={{ loggedInUser, setLoggedInUser, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}