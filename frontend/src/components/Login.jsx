import { useState } from "react";
import userService from "../services/user";


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await userService.loginUser(username, password);

      if (!data.error) {
        localStorage.setItem('username', username);
        localStorage.setItem('token', data.token);
        setMessage('Login successful!');
        // Redirect to the main page
        window.location.reload(); 
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
      <div className="input">
      <label>Username:</label>
        <input type="text" value={username} placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div className="input">
      <label>Password:</label>
        <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
      </div>
        <button type="submit" className="button-85">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Login;