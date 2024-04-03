import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector((state) => state.notification.msg);
  const displayStyle = useSelector((state) => state.notification.style);
  const messageFormat = useSelector((state) => state.notification.msgFormat);

  const style = {
    display: displayStyle,
  };

  return (
    <div className={messageFormat} style={style}>
      {notification}
    </div>
  );
};

export default Notification;
