const url = 'http://localhost:8080/v1/order';

/**
 * Gets all orders for certain user from the backend.
 * 
 * @returns {Array<Order>} 
 */
const getAllOrders = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // add the access token to the header
    }
  });

  const orders = await response.json();
  
  // If jwt malformed, return error array.
  if (orders.error) {
    return Array("error");
  }

  return orders;
};

/**
 * Creates a new order
 * 
 * @param {Object} order 
 * @returns {Object} created order
 */
const createOrder = async (order) => {
  const token = localStorage.getItem('token');
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // add the access token to the header
    },
    body: JSON.stringify(order)
  });

  const newOrder = await response.json();

  return newOrder;
};

export default { getAllOrders, createOrder };