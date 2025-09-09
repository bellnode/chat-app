import React, { memo} from 'react'
import moment from 'moment'
import { Box } from '@mui/material'
import { fileFormat, transformImage } from '../../libs/Features'
import RenderAttachment from './RenderAttachment'

const MessageComponent = ({ message,user}) => {
    const { sender, content, attachments = [], createdAt } = message
    const sameSender = sender?._id === user?._id

    const timeAgo = moment(createdAt).fromNow()
    

    return (


        <div className={`chat ${sameSender ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img
                        alt="Tailwind CSS chat bubble component"
                        src={sender?.avatar ?transformImage(sender.avatar,100):"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZw4HYx8PHlE8ZniW1hqck5nZeKaYZSqG56g&s"} />
                </div>
            </div>
            <div className="chat-header">
                {!sameSender?sender.username:'You'}
            </div>
            {
                content && <div className={`chat-bubble text-white ${sameSender ? 'bg-indigo-600 ' : ''} `}>{content}</div>
            }
            {
                attachments.length>0 && (
                    attachments.map((attachment,index)=>{
                        const url = attachment.url
                        const file = fileFormat(url)
                        return<div key={index} className={`chat-bubble text-white ${sameSender ? 'bg-indigo-600 ' : ''} `}>
                            <Box >
                            <a href={url} target='_blank' download className='text-black'>
                                <RenderAttachment file={file} url={transformImage(url)} />
                            </a>

                        </Box>
                        </div>
                         
                    })
                )
            }
            <div className="chat-footer opacity-50">{timeAgo}</div>
        </div>




    )
}

export default memo(MessageComponent)