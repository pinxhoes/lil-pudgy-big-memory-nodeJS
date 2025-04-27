'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type UserContextType = {
    loggedInUser: string;
    setLoggedInUser: (username: string) => void;
};

const UserContext = createContext<UserContextType>({
    loggedInUser: '',
    setLoggedInUser: () => { },
});

export function UserProvider({ children }: { children: ReactNode }) {
    const [loggedInUser, setLoggedInUserState] = useState('');

    useEffect(() => {
        const savedUser = localStorage.getItem('loggedInUser');
        if (savedUser) {
            setLoggedInUserState(savedUser);
        }
    }, []);

    const setLoggedInUser = (user: string) => {
        setLoggedInUserState(user);
        if (user) {
            localStorage.setItem('loggedInUser', user);
        } else {
            localStorage.removeItem('loggedInUser');
        }
    };

    return (
        <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
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