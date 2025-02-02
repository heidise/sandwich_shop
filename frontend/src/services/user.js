const url = 'http://localhost:8080/v1/user';

/**
 * Gets certain user's information.
 * @returns {Object} User data
 */
const getUser = async () => {
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  const response = await fetch(`${url}/${username}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // add the access token to the header
    }
  });
  const user = await response.json();
  return user;
};

/**
 * Adds new user.
 * @param {String} username - username
 * @param {String} email - email
 * @param {String} password - password
 * @returns {Object} registered user
 */
const registerUser = async (username, email, password) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await response.json();

  return data;
}

/**
 * Logins user in to the system.
 * @param {String} username - username
 * @param {String} password - password
 * @returns {Object} login information
 */
const loginUser = async (username, password) => {
  const response = await fetch(`${url}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  return data;
};

export default { getUser, registerUser, loginUser };