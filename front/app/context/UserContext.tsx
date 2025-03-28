import React, { createContext, useContext, useState } from "react";

type UserContextType = {
    userId: number | null;
    setUserId: (id: number) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [userId, setUserId] = useState<number | null>(null);

    return (
        <UserContext.Provider value={{ userId, setUserId }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used inside <UserProvider>");
    return context;
};
