import { useState } from "react";
import userService from "../services/user";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await userService.registerUser(username, email, password);

      if (!data.error) {
        setMessage('Registeration successful!');
        // Redirect to the login page
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
          <label>Email:</label>
          <input type="email" value={email} placeholder="Email@example.com" onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="input">
        <label>Password:</label>
        <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
        <button type="submit" className="button-85">Register</button>
        </div>
        
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Login;