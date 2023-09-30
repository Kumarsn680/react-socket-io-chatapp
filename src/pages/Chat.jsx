import { useEffect, useState,useRef } from "react";
import queryString from "query-string";
import { socket } from "../socket";
import MessageContainer from "../components/MessageContainer";
import "./Chat.css";


const Chat = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomUsers, setRoomUsers] = useState([]);
  const messageContainerRef = useRef(null)

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }

  useEffect(()=>{
    scrollToBottom()
  },[messages])

  useEffect(() => {
    const { userName, userRoom } = queryString.parse(location.search);
    setName(userName);
    setRoom(userRoom);
    

    console.log(name,room)
    socket.emit('onchatRoom')
    socket.on("message", (message) => {
      console.log("socket message callled");
      setMessages((messages) => [...messages, message]);
      console.log(messages);
    });

    socket.on("roomData", ({ room, users }) => {
      console.log("roomData was called");
      setRoomUsers(users);
    });

    return () => {
      console.log('disconnect getting called')
      socket.disconnect();
      socket.off();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    console.log("sendmesaage", message);
    if (message) {
      socket.emit("sendMessage", message, () => {
        setMessage("");
      });
    }
  };

  const handleKeyDown = (e) => {
    if(e.key === 'Enter'){
      e.preventDefault();
      console.log("sendmesaage", message);
      if (message) {
        socket.emit("sendMessage", message, () => {
          setMessage("");
        });
      }
    }
  }

  return (
    <div className="chatboxcontainer">
      <div className="roomusers">
        <h2 className="roomusersHeader">RoomUsers</h2>
        {roomUsers.map((user) => (
          <div className="username" key={user.id}>
            {user.name}
          </div>
        ))}
      </div>
      <div className="chatbox">
        <div className="chatHeader">{room}</div>
        <div className="chats" ref={messageContainerRef}>
          {messages.map((message) => (
            <MessageContainer message={message} currentUser={name} />
          ))}
        </div>
        <div className="inputcontainer">
          <input
            className="inputbox"
            placeholder="Message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          ></input>
          <button
            className="sendbutton"
            type="submit"
            onClick={(e) => sendMessage(e)}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
