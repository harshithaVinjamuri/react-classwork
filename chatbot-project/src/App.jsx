import { useState } from 'react'
import { Chatbot} from 'supersimpledev';
import { ChatInput} from './components/ChatInput.jsx';
import { ChatMessage } from './components/ChatMessage.jsx';
import { ChatMessages } from './components/ChatMessages.jsx';
import './App.css'
function App(){
                const [chatMessages, setChatMessages] = useState([
                {
                    message: 'hey',
                    sender: 'user',
                    id: 'id1'
                },
                {
                    message: 'how can i help you',
                    sender: 'robot',
                    id: 'id2'
                }
                ]); 
                return(
                    <div className="app-container">
                    <ChatMessages
                    chatMessages={chatMessages}
                    setChatMessages={setChatMessages}
                    />
                    <ChatInput 
                    chatMessages={chatMessages}
                    setChatMessages={setChatMessages}
                    />
                    </div>
                );
            }

export default App
