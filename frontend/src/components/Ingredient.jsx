import PropTypes from 'prop-types'

const Ingredient = ({ ingredient }) => {
    return (
        <li className='ingredient'>
        <>&#9830; </> {ingredient.name}
        </li>
    )
}

Ingredient.propTypes = {
    ingredient: PropTypes.string.isRequired
}

export default Ingredient

