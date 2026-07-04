import { useRef, useEffect } from 'react'
import { ChatMessage } from './ChatMessage';
 export function ChatMessages({chatMessages}){
                /* const array = React.useState([{
                    message: 'hey',
                    sender:'user',
                    id : 'id1'
                },
                {
                    message:'how can i help you',
                    sender:'robot',
                    id: 'id2'
                }]);*/
                //const chatMessages = array[0]; //most current chat message 
                //const setChatMessages= array[1];// function that updates tnhe data ->updater function
                const chatMessagesRef=useRef(null);
                useEffect(()=>{
                    const containerElem=chatMessagesRef.current;
                    if(containerElem){
                        containerElem.scrollTop=containerElem.scrollHeight;
                    }
                },[chatMessages]);
                return (
                    <div className="chat-messages-container"
                    ref={chatMessagesRef}>
                {chatMessages.map((chatMessage)=>{
                    return(
                        <ChatMessage 
                        message={chatMessage.message}
                        sender={chatMessage.sender}
                        key={chatMessage.id}
                        />
                    )
                })}
                </div>
            );
            }
        