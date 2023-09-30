import {useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import { socket } from '../socket'
import './Join.css'

const Join = () => {
    const [userName,setUserName] = useState('')
    const [userRoom, setUserRoom] = useState("");
    const navigate = useNavigate()

    const validateUser = () => {
      if (userName && userRoom) {
        socket.connect();
        console.log(userName, userRoom);
        socket.emit("join", { name: userName, room: userRoom }, (error) => {
          if (error) alert(error);
        navigate(`/chat?userName=${userName}&userRoom=${userRoom}`);
        });
      }
    }
    
    

  return (
    <div className="joinroom">
      <div className="logincontainer">
        <h2>Login</h2>
        <input
          className="inputjoin"
          placeholder="Name"
          type="text"
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
        ></input>
        <input
          className="inputjoin"
          placeholder="Room"
          type="text"
          onChange={(e) => setUserRoom(e.target.value)}
          value={userRoom}
        ></input>

        <button type="submit" onClick={validateUser}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default Join