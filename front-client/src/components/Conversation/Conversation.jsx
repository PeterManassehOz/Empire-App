import React, { useEffect, useState } from "react";
import { getUser } from "../../api/UserRequest";

const Conversation = ({data, currentUserId, online}) => {

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const userId = data.members.find((id) => id !== currentUserId);
        console.log("Conversation Component Rendered");
        console.log("Data: ", data, "CurrentUserId: ", currentUserId, "UserId: ", userId);
    
        const getUserData = async () => {
            try {
                console.log("Fetching User Data for ID: ", userId);
                const { data } = await getUser(userId);
                console.log("User Data Fetched: ", data);
                setUserData(data);
            } catch (error) {
                console.log("Error Fetching User Data: ", error);
            }
        };        
        getUserData();
    }, [currentUserId, data.members]);
    

   /*useEffect(()=>{
        const userId = data.members.find((id)=>id !== currentUserId);
        const getUserData = async ()=> {
            try {
                const {data} = await getUser(userId)
                setUserData(data)
            } catch (error) {
                console.log(error)
            }
        }
        getUserData();
    }, [currentUserId, data.members])
    */
    
    return (
      <>
        <div className="follower conversation">
                <div>
                    {online && <div className="online-dot"></div>}
                    <img src={userData?.profilePicture? process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePicture:  process.env.REACT_APP_PUBLIC_FOLDER + 'defaultprofile.png '} alt="" className="followerImage"
                    style={{width:"50px", height:"50px"}}
                    />
                    <div className="name" style={{fontSize: "0.8rem"}}>
                        <span>{userData?.firstname} {userData?.lastname}</span>
                        <span>{online? "Online" : "Offline"}</span>
                    </div>
                </div>
            </div>
        <hr style={{width: '85%', border: '0.1px solid #ececec'}}/>
     </>
    )
}

export default Conversation;