import { createContext, useContext, useEffect, useState } from 'react'
import { createBrowserHistory } from 'history';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {

  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const history = createBrowserHistory();
  const [notification,setNotification]=useState([]);  

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (!userInfo) {
      history.replace('/');
    }
  }, [])


  return (<ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats,notification,setNotification }}>{children}</ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
}

export default ChatProvider;