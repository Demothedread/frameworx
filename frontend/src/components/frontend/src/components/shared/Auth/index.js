import React from 'react';

// Stub Auth Context/provider
export const AuthContext = React.createContext({ user: null, setUser: () => {} });

export function AuthProvider({ children }) {
  // Stub user state
  const [user, setUser] = React.useState(null);
  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}
