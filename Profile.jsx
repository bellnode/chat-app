import { Avatar } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { Camera, X, Check } from 'lucide-react';
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { Mail } from "@mui/icons-material";
import { transformImage } from "../../libs/Features";
import { useFileHandler, useInputValidation } from '6pp'
import userService from "../../service/userService";
import toast from "react-hot-toast";
import { setUser } from "../../redux/Slice/userSlice";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [profile, setProfile] = useState(user || null)
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ ...profile });
  const fileRef = useRef()
  const newAvatar = useFileHandler('single')
  const newUsername = useInputValidation('')
  const newBio = useInputValidation('')

  const handleSave = async () => {
    const toastId = toast.loading("Updating Profile")
    const form = new FormData()
    if (newUsername.value) form.append('username', newUsername.value)
    if (newBio.value) form.append('bio', newBio.value)
    if (newAvatar.file) form.append('avatar', newAvatar.file)
    const res = await userService.updateProfileAPI(form, newAvatar.file ? true : false)

    if (res.success) {
      toast.success('Profile Updated successFully', { id: toastId })
      dispatch(setUser(res.updatedUser))
      setProfile(res.updatedUser)
    }
    setIsEditing(false);
    newAvatar.clear()
    newUsername.clear()
    newBio.clear()
  };

  const selectFile = () => {
    if (fileRef.current) {
      fileRef.current.click()
    }
  }

  return (
    <>

      <div className="w-full h-full bg-white border-r border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
            {isEditing ? (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                >
                  <Check size={20} />
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm(profile);
                    newAvatar.clear();
                    newUsername.clear();
                    newBio.clear()
                  }}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-6">
            <div className="relative w-32 h-32 mx-auto">
              <img
                src={isEditing ? newAvatar.preview ? newAvatar.preview : transformImage(user?.avatar?.url, 300) : transformImage(user?.avatar?.url, 300)}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
              {isEditing && (
                <>
                  <button onClick={selectFile} className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors">
                    <Camera size={20} />
                  </button>
                  <input ref={fileRef} onChange={newAvatar.changeHandler} type="file" className="hidden" name="" id="" />
                </>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={newUsername.value ? newUsername.value : profile.username}
                    onChange={newUsername.changeHandler}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
                  />
                ) : (
                  <p className="text-gray-900">{profile.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{profile.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 resize-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-900">{profile.bio}</p>
                )}
              </div>

              { !isEditing && <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <CalendarMonthIcon sx={{ width: '16px' }} /> Joined
                </label>
                <p className="text-gray-900">{user?.createdAt
                  ? moment(user.createdAt).format("MMMM D, YYYY")
                  : "N/A"}</p>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
