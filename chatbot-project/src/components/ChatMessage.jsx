import RobotProfileImage from '../assets/robot.png'
import UserProfileImage from '../assets/user.png'
export function ChatMessage(props){
                const message=props.message;
                const sender= props.sender;
                return(
                    <div className={sender==='user'?'chat-message-user': 'chat-message-robot'}>
                        {props.sender==='robot' &&(<img src={RobotProfileImage} className="chat-message-profile"/> )}
                        <div className="chat-message-text">{message}</div>
                        {props.sender==='user' &&(<img src={UserProfileImage} className="chat-message-profile"/>)}
                    </div>
                );
            }