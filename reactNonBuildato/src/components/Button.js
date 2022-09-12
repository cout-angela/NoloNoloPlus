import PropTypes from 'prop-types'

const Button = ({ btnId, onClick, className, text }) => {
  return (
    <button
      id={btnId}
      onClick={onClick}
      className={className}
    >
      {text}
    </button>
  )
}
Button.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
}

export default Button
