import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import { CategoriesContextProvider } from './context/CategoriesContext';

// pages & components
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Formateur from './pages/Formateur';
import Navbar from './components/Navbar';
import Categories from './pages/Categories';
import Formation from './pages/Formation';
import Profile from './pages/Profile';
import Mesformations from './pages/Mesformations';
import RequestReset from './components/RequestReset';
import ResetPassword from './components/ResetPassword';
import FormateurFormations from './pages/FormateurFormations';
import EtudiantsFormations from './pages/EtudiantsFormations';

import './index.css';

const routes = [
  // admin
  { path: "/formateur", guarded: true, userType: "admin", element: <Formateur /> },
  { path: "/formations", guarded: true, userType: "admin", element: <Formation /> },
  { path: "/categories", guarded: true, userType: "admin", element: <Categories /> },
  { path: "/", guarded: true, userType: "admin", element: <Home /> },
  { path: "/profile", guarded: true, userType: "admin", element: <Profile /> },
  { path: "/formateursformations/:id", guarded: true, userType: "admin", element: <FormateurFormations /> },
  { path: "/usersformations/:id", guarded: true, userType: "admin", element: <EtudiantsFormations /> },

  // user
  { path: "/login", guarded: false, userType: "user", element: <Login /> },
  { path: "/signup", guarded: false, userType: "user", element: <Signup /> },
  { path: "/", guarded: true, userType: "user", element: <Home /> },
  { path: "/profile", guarded: true, userType: "user", element: <Profile /> },
  { path: "/myformations", guarded: true, userType: "user", element: <Mesformations /> },
  { path: "/request-password-reset", guarded: false, userType: "user", element: <RequestReset /> },
  { path: "/reset-password/:token", guarded: false, userType: "user", element: <ResetPassword /> },

  // formateur
  { path: "/formateur", guarded: true, userType: "formateur", element: <Formateur /> },
  { path: "/", guarded: true, userType: "formateur", element: <Home /> },
  { path: "/login", guarded: false, userType: "formateur", element: <Login /> },
  { path: "/profile", guarded: true, userType: "formateur", element: <Profile /> },
  { path: "/my-formations", guarded: true, userType: "formateur", element: <Mesformations /> },
  { path: "/request-password-reset", guarded: false, userType: "formateur", element: <RequestReset /> },
  { path: "/reset-password/:token", guarded: false, userType: "formateur", element: <ResetPassword /> },
];

function App() {
  const { user } = useAuthContext();

  const renderRoutes = (user) => {
    return routes.map(({ path, guarded, userType, element }) => {
      if (guarded) {
        if (user && (user.role === userType || userType === "admin")) {
          return <Route key={path} path={path} element={element} />;
        } else {
          return <Route key={path} path={path} element={<Navigate to="/login" />} />;
        }
      } else {
        return <Route key={path} path={path} element={element} />;
      }
    });
  };

  return (
    <div className="App">
      <BrowserRouter>
        <CategoriesContextProvider>
          <Navbar />
          <div className="pages">
            <Routes>
              {renderRoutes(user)}
            </Routes>
          </div>
        </CategoriesContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
