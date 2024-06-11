import { createContext, useReducer, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload, loading: false };
    case 'LOGOUT':
      return { user: null, loading: false };
    case 'LOADING':
      return { ...state, loading: true };
    case 'DONE_LOADING':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true
  });

  useEffect(() => {
    dispatch({ type: 'LOADING' });
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      dispatch({ type: 'LOGIN', payload: user });
    } else {
      dispatch({ type: 'DONE_LOADING' });
    }
  }, []);

  return (
      <AuthContext.Provider value={{ ...state, dispatch }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
