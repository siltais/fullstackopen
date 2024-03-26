import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification.msg)
  const displayStyle = useSelector(state => state.notification.style)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    margin: 10,
    display: displayStyle
  }


  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification