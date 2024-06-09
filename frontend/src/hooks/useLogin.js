import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const login = async (email, password, role, _id) => {
    setIsLoading(true);
    setError(null);

    const url = role === 'user' || role === 'admin' ? '/api/user/login' : '/api/formateur/login';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const json = await response.json();
        setIsLoading(false);
        setError(json.error);
        return;
      }

      const res = await response.json();
      console.log('here', res);
      localStorage.setItem('user', JSON.stringify(res));
      dispatch({ type: 'LOGIN', payload: res });
      setIsLoading(false);

      if (res.role === 'user') {
        navigate('/formations'); // Redirect to user dashboard
      } else if (res.role === 'admin') {
        navigate('/'); // Redirect admin to home
      } else {
        navigate('/formateur'); // Redirect to formateur dashboard
      }
    } catch (error) {
      setIsLoading(false);
      setError('An error occurred while logging in');
    }
  };

  return { login, isLoading, error };
};
