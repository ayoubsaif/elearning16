import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import SignUp from './pages/SignUp';

export const UserContext = createContext();

function App() {
  const [userData, setUserData] = useState({
    isLogged: false,
    jwt: '',
    user: {},
  });

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const user = sessionStorage.getItem('user');

    if (token && user) {
      setUserData({
        isLogged: true,
        jwt: token,
        user: JSON.parse(user),
      });
    }
  }, []);

  const routes = [
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/signup',
      element: <SignUp />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ];

  return (
    <UserContext.Provider value={[userData, setUserData]}>
      <Router>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
