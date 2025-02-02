import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import sandwichService from '../services/sandwich';

const Order = ({ order }) => {
  const [sandwich, setSandwich] = useState(null);

  useEffect(() => {
    const fetchSandwich = async () => {
      const sandwich = await sandwichService.getSandwich(order.sandwichId);
      setSandwich(sandwich);
    };

    fetchSandwich();
  }, [order.sandwichId]);

  return (
    <li className='order'>
      <p>Order {order.id} status: {order.status}</p>
      {sandwich && <p>Sandwich: {sandwich.name}</p>}
    </li>
  )
}

Order.propTypes = {
  order : PropTypes.shape({
    id: PropTypes.number.isRequired,
    sandwichId: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
  }).isRequired
}

export default Order