import PropTypes from 'prop-types'
import { useState } from 'react'

import Ingredient from './Ingredient'

import orderService from '../services/order'
import userService from '../services/user'

const SandwichCard = ({ sandwich }) => {
  const [toggle, setToggle] = useState(false)
  
  const handleToggle = () => {
    setToggle(!toggle)
  }

  const handleOrder = () => {
    console.log(`Ordering ${sandwich.name}`)
    userService.getUser()
      .then((user) => {
        const order = {
          sandwichId: sandwich.id,
          status: "ordered",
          userId: user.id
        }

        orderService.createOrder(order)
          .then((newOrder) => {
            console.log(`Order placed for ${sandwich.name} with id ${newOrder.id}`)
          })
      })
      .catch((err) => {
        console.error(err)
      })
  };

  const contentHeight = `${140 + sandwich.toppings.length * 23}px`;

  return (
    <div className='sandwichcard'>
      <h2 onClick={handleToggle}>{sandwich.name} 
      {sandwich.diet == 'vegan' ? <> &#9419;</> : <></>}
      {sandwich.diet == 'lactose-free' ? <> &#9409;</> : <></>}
      </h2>
      <div className='sandwichcard__content' style={{height: toggle ? contentHeight : "0px"}}>
        <p>Bread: {sandwich.breadType}</p>
        <ul>
          {sandwich.toppings.map((ingredient, index) => (
            <Ingredient key={index} ingredient={ingredient}/>
          ))}
        </ul>
        <button onClick={handleOrder} className='addtoorderbutton'>Add to order</button>
      </div>
    </div>
  )
}

SandwichCard.propTypes = {
  sandwich: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    toppings: PropTypes.array.isRequired,
    breadType: PropTypes.string.isRequired,
    diet: PropTypes.string
  }).isRequired
}

export default SandwichCard