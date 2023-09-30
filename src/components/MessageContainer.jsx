import React from 'react'
import './MessageContainer.css'

const MessageContainer = ({message,currentUser}) => {
    const {user,text,timestamp} = message
    const time = new Date(timestamp).toLocaleTimeString();
    const style = currentUser === user ? {backgroundColor : 'rgb(0, 153, 255)',color : 'white'} : {}

  return (
    <div className='messagecontainer'>
        <div className='user'>{user}</div>
        <div style={style} className='text'>{text}</div>
        <div className='timestamp'>{time}</div>
    </div>
  )
}

export default MessageContainer