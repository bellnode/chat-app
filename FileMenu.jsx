import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from '@mui/material'
import React, { useContext, useRef } from 'react'
import { AppContext } from '../../context/SideMenuStates'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import messageService from '../../service/messageService'
import { getSocket } from '../../context/Socket'
import { NEW_ATTACHMENT } from '../../constants/event'

const FileMenu = ({ anchor }) => {

  const { isFileMenu, setIsFileMenu } = useContext(AppContext)
  const imageRef = useRef(null)
  const videoRef = useRef(null)
  const audioRef = useRef(null)
  const fileRef = useRef(null)
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  const allowedAudioTypes = ['audio/mpeg', 'audio/wav'];
  const { chatId } = useParams()
  const socket = getSocket()


  const handleInputClick = (ref) => {
    if (ref.current) {
      ref.current.click()
    }
  }

  const handleFilesUpload = async (files, key) => {
    const toastId = toast.loading(`Sending ${key}...`)
    console.log({ files })
    if (!chatId) return
    const myForm = new FormData()
    myForm.append('chatId', chatId)
    files.forEach((file) =>
      myForm.append('attachments', file)
    );

    for (let [key, value] of myForm.entries()) {
      console.log(`${key}:`, value);
    }
    setIsFileMenu(false)

    try {
      const res = await messageService.sendAttachments(myForm)
      console.log({ res })
      if (res.success) {
        toast.success(`${key} Sent Successfully`, { id: toastId })
        socket.emit(NEW_ATTACHMENT,{chatId})
      } else {
        toast.error(res.message, { id: toastId })
      }
    } catch (error) {
      toast.error(error.message, { id: toastId })
    }
  }

  const validateFiles = (event, key, allowedTypes) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) => allowedTypes.includes(file.type));

    if (validFiles.length !== files.length) {
      alert('Some files were not images (jpeg, jpg, png). Please select images');
      imageRef.current.value = ''; // Clear input if no valid files
    }
    else {
      handleFilesUpload(validFiles, key)
    }
  };

  return (
    <>
      <Menu open={isFileMenu} anchorEl={anchor} onClose={() => setIsFileMenu(false)} >
        <ul className="menu bg-white text-black rounded-box w-40">
          <li>
            <div onClick={(e) => handleInputClick(imageRef)} className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 text-green-600">
                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
              </svg>

              <span className="ml-1.5">Image</span>
              <input onChange={(e) => validateFiles(e, 'image', allowedImageTypes)} multiple ref={imageRef} type="file" name="image" accept='image/jpeg, image/png, image/jpg' className='hidden' />
            </div>
          </li>
          <li>
            <div onClick={(e) => handleInputClick(videoRef)} className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 text-purple-700">
                <path fillRule="evenodd" d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 18.375V5.625Zm1.5 0v1.5c0 .207.168.375.375.375h1.5a.375.375 0 0 0 .375-.375v-1.5a.375.375 0 0 0-.375-.375h-1.5A.375.375 0 0 0 3 5.625Zm16.125-.375a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h1.5A.375.375 0 0 0 21 7.125v-1.5a.375.375 0 0 0-.375-.375h-1.5ZM21 9.375A.375.375 0 0 0 20.625 9h-1.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h1.5a.375.375 0 0 0 .375-.375v-1.5Zm0 3.75a.375.375 0 0 0-.375-.375h-1.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h1.5a.375.375 0 0 0 .375-.375v-1.5Zm0 3.75a.375.375 0 0 0-.375-.375h-1.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h1.5a.375.375 0 0 0 .375-.375v-1.5ZM4.875 18.75a.375.375 0 0 0 .375-.375v-1.5a.375.375 0 0 0-.375-.375h-1.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h1.5ZM3.375 15h1.5a.375.375 0 0 0 .375-.375v-1.5a.375.375 0 0 0-.375-.375h-1.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375Zm0-3.75h1.5a.375.375 0 0 0 .375-.375v-1.5A.375.375 0 0 0 4.875 9h-1.5A.375.375 0 0 0 3 9.375v1.5c0 .207.168.375.375.375Zm4.125 0a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5h-9Z" clipRule="evenodd" />
              </svg>
              <span className="ml-1.5">Video</span>
              <input onChange={(e) => validateFiles(e, 'video', allowedVideoTypes)} multiple ref={videoRef} type="file" name="video" accept='video/mp4, video/webm, video/ogg' className='hidden' />
            </div>
          </li>
          <li>
            <div onClick={(e) => handleInputClick(audioRef)} className="flex items-center">
              <svg className="size-5 text-red-500" fill='currentColor' viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M256 80C149.9 80 62.4 159.4 49.6 262c9.4-3.8 19.6-6 30.4-6c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48c-44.2 0-80-35.8-80-80V384 336 288C0 146.6 114.6 32 256 32s256 114.6 256 256v48 48 16c0 44.2-35.8 80-80 80c-26.5 0-48-21.5-48-48V304c0-26.5 21.5-48 48-48c10.8 0 21 2.1 30.4 6C449.6 159.4 362.1 80 256 80z"></path>
              </svg>
              <span className="ml-1.5">Audio</span>
              <input onChange={(e) => validateFiles(e, 'audio', allowedAudioTypes)} multiple ref={audioRef} type="file" name="audio" accept='audio/mpeg, audio/wav' className='hidden' />
            </div>
          </li>
          <li>
            <div onClick={(e) => handleInputClick(fileRef)} className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 text-blue-500">
                <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
              </svg>
              <span className="ml-1.5">File</span>
              <input onChange={(e) => handleFilesUpload(Array.from(e.target.files), 'file')} multiple ref={fileRef} type="file" name="file" accept='*' className='hidden' />
            </div>
          </li>
        </ul>

      </Menu>
    </>
  )
}

export default FileMenu