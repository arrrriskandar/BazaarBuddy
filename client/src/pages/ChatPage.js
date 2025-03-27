import { Layout } from "antd";
import { useChat } from "../contexts/ChatContext";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";

const { Sider, Content } = Layout;

const ChatPage = () => {
  const { chats, activeChat, setActiveChat, messages, sendMessage } = useChat();

  return (
    <Layout style={{ height: "calc(100vh - 120px)" }}>
      <Sider width={300} style={{ background: "#fff", padding: "10px" }}>
        <ChatList
          chats={chats}
          activeChat={activeChat}
          setActiveChat={setActiveChat}
        />
      </Sider>

      <Content style={{ padding: "10px", background: "#f5f5f5" }}>
        {activeChat ? (
          <ChatWindow
            activeChat={activeChat}
            messages={messages}
            sendMessage={sendMessage}
          />
        ) : (
          <div style={{ textAlign: "center", padding: "20px" }}>
            Select a chat to start messaging
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default ChatPage;
