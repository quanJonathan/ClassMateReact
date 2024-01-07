import NotificationItem from "./NotificationItem";


const NotificationDropdown = (props) => {
  const notifications = props.noti;

  return (
    <>
      <div style={{ position: 'absolute', height: '300px', width: '500px', top: '50px', right: '0', borderRadius: '15px', backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 5px 5px -3px, rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px' }}>
        <div style={{ display: 'flex', borderBottom: '1.5px solid lightgray', justifyContent: 'center', height: '50px', color: 'black' }}>
          <p style={{fontWeight: 'bolder'}}>Notification</p>
        </div>
        <div style={{ height: '85%', overflowY: 'scroll', padding: '10px' }}>
          {notifications.map((content, index) => {
            return <div key={index}>
              <NotificationItem content={content}/>
            </div>
          })}
        </div>
      </div>
    </>
  );
}

export default NotificationDropdown;