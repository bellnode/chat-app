import { Typography } from "@mui/material";
import { React, memo } from "react";
import { Link } from "react-router-dom";
import AvatarCard from "./AvatarCard";

const GroupListItem = ({
  avatar = [],
  _id,
  name,
  chatId,
  sameSender,
}) => {
  return (
    <>
      <Link
        to={`/group/${_id}`}
        className="hover:bg-gray-200  border-b-black border-b"
        
      >
        <div
          className={`flex items-center relative p-4 gap-4 ${
            sameSender ? "bg-black text-white" : ""
          }`}
        >
          <AvatarCard avatar={avatar} />
          <div className="flex flex-col mx-2 ">
            <Typography>{name}</Typography>
          </div>
        </div>
      </Link>
    </>
  );
};

export default memo(GroupListItem);
