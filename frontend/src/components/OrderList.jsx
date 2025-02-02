import Order from "./Order"
import PropTypes from "prop-types"
import { useState, useEffect } from "react"
import orderService from '../services/order'

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await orderService.getAllOrders();
      if (orders.includes("error")) {
        setError(true);
      }
      else {
        setOrders(orders);
      }
    };

    fetchOrders();
    const intervalId = setInterval(fetchOrders, 1000);
    return () => clearInterval(intervalId);
  }, [])

  return (
    <div className='orderlist'>
      {error && <>Error fetching the orders. Please logout and login again.</>}
      {orders && orders.map((order) => (
        <Order key={order.id} order={order} />
    ))}
    </div>
  )
}

OrderList.propTypes = {
  orders: PropTypes.array.isRequired,
}

export default OrderList