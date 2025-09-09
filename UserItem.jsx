import { Avatar, Button, ListItem, Typography } from "@mui/material";
import React, { memo } from "react";
import { useSelector } from "react-redux";
import { transformImage } from "../../libs/Features";

const UserItem = ({
  user,
  handler,
  handlerIsLoading,
  addFriends = false,
  addMembers = false,
  isGroupMember = false,
}) => {
  const userNow = useSelector((state) => state.user.user);

  const { username, _id, avatar } = user;

  const creatorId = useSelector((state) => state.creator.creator);

  return (
    <>
      <ListItem sx={{ width: "100%", padding: "0px", margin: "0px" }}>
        <div className="flex items-center justify-between w-full  px-2 py-2">
          <div className="flex items-center">
            <Avatar
              sx={{
                width: "3rem",
                height: "3rem",
                border: "1px solid white",
                margin: "0px 5px",
              }}
              src={avatar?transformImage(avatar,200):"http://placekitten.com/250/250"}
            />
            <Typography sx={{ fontSize: "15px", padding: "0px 3px" }}>
              {username}
            </Typography>
          </div>

          {addFriends && (
            <button
              onClick={() => handler(_id)}
              disabled={handlerIsLoading}
              type="button"
              className="flex justify-between px-2 w-[4rem] text-sm items-center text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full   py-1 me-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4 text-white"
              >
                <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
              </svg>
              <span>Add</span>
            </button>
          )}
          {addMembers &&
            (isGroupMember ? (
                <button
                  onClick={() => handler(_id)}
                  type="button"
                  className="text-white bg-red-500 hover:bg-red-700 font-medium rounded-full text-sm px-1 py-1 text-center me-2 "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4 text-white"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              
            ) : (
              <button
                onClick={() => handler(_id)}
                type="button"
                className="flex justify-between px-1 text-sm items-center text-white bg-gray-800 hover:bg-gray-900  font-medium rounded-full   py-1 me-2 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4 text-white"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ))}
        </div>
      </ListItem>
    </>
  );
};

export default memo(UserItem);
