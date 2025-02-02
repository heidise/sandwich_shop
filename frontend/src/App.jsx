import { useState, useEffect } from "react";

import SandwichList from "./components/SandwichList";
import OrderList from "./components/OrderList";
import Login from "./components/Login";
import Register from "./components/Register";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleModeChange = () => {
    setIsLoginMode(!isLoginMode); // Toggle between login and registration mode
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    // redirect to the login page
    window.location.reload();
  }

  return (
    <div>
      <h1>&#129386; Ugly font sandwich shop &#129386;</h1>
      {isLoggedIn && (
        <>
        <div class="navigation">
          <div class="navigation_row"> <p class="loggedIn-text">Logged in as {localStorage.getItem('username')} </p>
            <button onClick={handleLogout} className="button-85"> logout</button> 
          </div>
          <div class="navigation_row">
          <p>&#9419; = Vegan, &#9409; = Lactose-free</p>
          </div>
        </div>
        </>
      )}
      {!isLoggedIn && isLoginMode && <Login onLogin={handleLogin} />} 
      {!isLoggedIn && !isLoginMode && <Register onLogin={handleLogin} />} 
      {isLoggedIn && (
        <>
          <SandwichList />
          <OrderList />
        </>
      )}
      {!isLoggedIn && ( 
        <p>
          {isLoginMode
            ? "Don't have an account? "
            : "Already have an account? "}
          <button onClick={handleModeChange} className="button-85">
            {isLoginMode ? "Register" : "Login"}
          </button>
        </p>
      )}
    </div>
  );
};

export default App;
