import React, { createContext, useContext, useState } from 'react';
// Plug in user/session context for auth, preferences, etc.
export const UserContext = createContext();
export function useUser() { return useContext(UserContext); }
export function UserProvider({ children }) {
  // Expand with real authentication/session as needed
  const [user, setUser] = useState(null); // { name, id }
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
