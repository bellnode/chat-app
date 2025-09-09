import React, { memo} from 'react';
import { Link } from 'react-router-dom';
import { transformImage } from '../../libs/Features';
import { useSelector } from 'react-redux';

const ChatItem = ({
    avatar = [],
    _id,
    name,
    groupChat = false,
    sameSender,
    isOnline,
    newMessageAlert,
    index = 0,
    handleDeleteChatOpen,
    lastMessage, 
    lastMessageCreatedAt,
    lastMessageSender,
    members
}) => {
    const avatarData = groupChat ? avatar : [avatar];

    const formatLastMessageTime = (timestamp) => {
        const messageDate = new Date(timestamp);
        const now = new Date();

        if (!timestamp) return " ";
        
        // Check if the message is from today
        if (messageDate.toDateString() === now.toDateString()) {
            return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        }
        
        // Check if the message is from yesterday
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        if (messageDate.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }
        
        // Return date in "dd/mm/yyyy" format
        return messageDate.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
    };
    

    const formattedTime = formatLastMessageTime(lastMessageCreatedAt);

    return (
        <Link
            to={`/chat/${_id}`}
            onContextMenu={(e) => handleDeleteChatOpen(e, _id, groupChat)}
            className={`p-4 rounded-xl cursor-pointer transition-all transform hover:scale-[1.02] `}
        >
            <div className="flex items-center space-x-4">
                <div className="relative flex-shrink-0">
                    {groupChat ? (
                        <GroupAvatar avatar={avatar} />
                    ) : (
                        <>
                            <img
                                src={avatar.url?transformImage(avatar.url, 100):"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZw4HYx8PHlE8ZniW1hqck5nZeKaYZSqG56g&s"}
                                alt={name}
                                className="w-14 h-14 rounded-full ring-2 ring-purple-100"
                            />
                            <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${isOnline ? 'bg-green-400' : 'bg-gray-300'
                                }`} />
                        </>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
                        <span className="text-sm text-gray-500 flex-shrink-0">{formattedTime}</span>
                    </div>
                    <div className='flex justify-between items-center'>
                        <p className="text-sm text-gray-600 truncate pr-8">
                            {typeof lastMessage === "string" ? lastMessageSender?`${lastMessageSender}: ${lastMessage}`:lastMessage : "File"}
                        </p>
                        {newMessageAlert?.count > 0 && (
                            <span className="flex-shrink-0 inline-flex items-center justify-center px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded-full min-w-[1.25rem] h-5">
                                {newMessageAlert?.count}
                            </span>
                        )}
                    </div>
                </div>


            </div>
        </Link >

    );
};

const GroupAvatar = ({ avatar }) => {
    if (avatar.length === 2) {
        return (
            <div className="relative w-14 h-14">
                <div className="absolute inset-0 flex">
                    <div className="w-1/2 overflow-hidden">
                        <img
                            src={avatar[0].url?transformImage(avatar[0].url, 100):"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZw4HYx8PHlE8ZniW1hqck5nZeKaYZSqG56g&s"}
                            alt="Member 1"
                            className="w-14 h-14 rounded-l-full object-cover border-2 border-white"
                        />
                    </div>
                    <div className="w-1/2 overflow-hidden">
                        <img
                            src={avatar[1].url?transformImage(avatar[1].url, 100):"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZw4HYx8PHlE8ZniW1hqck5nZeKaYZSqG56g&s"}
                            alt="Member 2"
                            className="w-14 h-14 rounded-r-full object-cover border-2 border-white"
                        />
                    </div>
                </div>
            </div>
        );
    }else{
        return(
            <div className="relative w-14 h-14">
        {avatar.slice(0, 3).map((a, index) => (
            <img
                key={a.public_id}
                src={a.url?transformImage(a.url, 50):"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZw4HYx8PHlE8ZniW1hqck5nZeKaYZSqG56g&s"}
                alt="Member"
                className={`absolute w-8 h-8 rounded-full border-2 border-white ${index === 0 ? 'top-0 left-0' :
                    index === 1 ? 'top-0 right-0' :
                        'bottom-0 left-1/4'
                    }`}
            />
        ))}
    </div>
        )
    }
    
}
export default memo(ChatItem);
