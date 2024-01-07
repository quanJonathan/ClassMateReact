import { AccountCircle } from "@mui/icons-material";


const NotificationItem = (props) => {
  const {content} = props
  return (
    <>
      <div style={{ width: '100%', height: '70px', borderBottom: '1.5px solid lightgray' }}>
        <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
            <p style={{marginTop: 0, marginBottom: 0,marginLeft: 15, flex: 7}}>
              {content}
            </p>
        </div>
      </div>
    </>
  )
}

export default NotificationItem;