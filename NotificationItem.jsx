import React, { memo } from "react";
import { ListItem, Avatar, Typography } from "@mui/material";

const NotificationItem = ({ request, handler }) => {
  // Destructure relevant properties from the request object
  const { _id, sender } = request;
  const { avatar, username } = sender || {}; // Assuming sender has these fields

  return (
    <ListItem sx={{ width: "100%", padding: "0px", margin: "0px" }}>
      <div className="flex items-center justify-between w-full  px-2 py-2 ">
        <div className="flex items-center">
          <Avatar
            sx={{
              width: "3rem",
              height: "3rem",
              border: "1px solid white",
              margin: "0px 5px",
            }}
            src={avatar || "/default-avatar.png"} // Set a default avatar if missing
          />
          <Typography sx={{ fontSize: "15px", padding: "0px 3px" }}>
            {username || "Unknown User"}{" "}
            {/* Fallback to 'Unknown User' if userName is missing */}
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => handler(_id, true)}
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-1 py-1 text-center me-2  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4"
            >
              <path
                fillRule="evenodd"
                d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={() => handler(_id, false)}
            type="button"
            className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-1 py-1 text-center me-2  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </ListItem>
  );
};

export default memo(NotificationItem);
