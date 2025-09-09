import React from 'react'
import { transformImage } from '../../libs/Features'
import { FileOpen } from '@mui/icons-material'

const RenderAttachment = ({file,url}) => {
 
    if (file==='video'){
        return <video src={url} preload='none' width={'200px'} controls />
    }else if (file==='image'){
        return <img src={transformImage(url,200)} alt="Attachment" width={'200px'} height={'150px'} style={{objectFit:'contain'}} />
    }
    else if (file==='audio'){
        return <audio src={url} preload='none' controls  />
    }
    return <FileOpen sx={{color:'white'}}/>
}

export default RenderAttachment