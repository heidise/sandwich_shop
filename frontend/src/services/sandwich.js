const url = 'http://localhost:8080/v1/sandwich';

/**
 * Gets all the sandwiches.
 * @returns {Array} All the sandwiches
 */
const getAllSandwiches = async () => {
  const response = await fetch(`${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const orders = await response.json();

  return orders;
};

/**
 * Gets certain sandwiches information.
 * @param {ObjectId} id - sandwichId
 * @returns {Object} Sandwich data
 */
const getSandwich = async (id) => {
  const response = await fetch(`${url}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const sandwich = await response.json();

  return sandwich;
};

export default { getAllSandwiches, getSandwich };