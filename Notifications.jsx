import { List, Stack } from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import NotificationItem from "../shared/NotificationItem";
import requestService from "../../service/requestService";
import { useDispatch, useSelector } from "react-redux";
import { setIsNotificationLoading, setNotification } from "../../redux/Slice/notificationSlice";
import { toast } from "react-hot-toast";
import { Inbox } from "lucide-react";
import { ThreeDots } from "react-loader-spinner";

const Notifications = () => {
  const dispatch = useDispatch()
  const { notification, fetched,isNotificationLoading } = useSelector((state) => state.notification);

  const fetchRequests = async () => {
    dispatch(setIsNotificationLoading(true))
    try {
      const result = await requestService.requestNotification();
      dispatch(setNotification(result.allRequest));
    } catch (error) {
      console.log("Error fetching requests:", error);
    }
    dispatch(setIsNotificationLoading(false))
  };

  // Function to handle accept/reject request
  const handleRequest = async (requestId, state) => {
    try {
      const result = await requestService.acceptRequest(requestId, state); // Call API to accept/reject request
      console.log(result);
      if(result.status === "accepted"){
        toast.success(`You and ${result.senderUsername} are now friends` );
      }
      fetchRequests(); // Refetch the notifications after handling the request
    } catch (error) {
      console.error("Error handling request:", error);
      toast.error("Error handling request");
    }
  };

  return (
    <>
      <div className="w-full h-full bg-white border-r border-gray-200">
        <div className="p-4 pt-6 pb-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Notifications
            </h2>
          </div>          
        </div>
        {
          isNotificationLoading ?
          <div className="h-96 flex flex-row items-center justify-center">
            <ThreeDots color={'#4F46E5'} width={100}/> 
          </div>
          :notification.length > 0 ?
          <Stack
          width={"100%"}
          direction={"column"}
          overflow-y={"auto"}
          style={{ height: "calc(100% - 88px)", overflowY:"auto" , overflowX:"hidden" }}
          >
          {
            notification.map((request) => (
              <NotificationItem
                request={request}
                handler={handleRequest}
                key={request._id}
              />
            ))
          }
        </Stack> :
        <div className="h-96 flex flex-row items-center justify-center">
          <Inbox className="mr-4" size={18}/>
          No Notifications
        </div>
        }
        
        <div>

        </div>
      </div>

    </>
  );
};

export default memo(Notifications);
