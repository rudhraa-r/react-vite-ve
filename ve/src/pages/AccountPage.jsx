import { useContext, useState } from "react"
import { UserContext } from "../UserContext"
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import CreatePage from "./CreateExPage";
import AccountNav from "./AccountNavPage";



export default function ProfilePage () {
    const {ready,user,setUser} = useContext(UserContext);

    let {subpage}= useParams();
    if(subpage === undefined){
        subpage ='profile'
    }

     function logout() {
         axios.post('/logout');
        setRedirect('/');
        setUser(null);
        
    }

    if(!ready) {
        return 'Loading...'
    }

    if(ready && !user && !redirect) {
        return<Navigate to={'/login'} />
    }


    return (
        <div>
            <AccountNav />
            {subpage === 'profile' && (
                <div className=" text-center max-w-lg mx-auto">
                    Logged in as {user.name} ({user.email})<br />
                    <button onClick={logout} className="primary max-w-lg mt-2 rounded-full">Logout</button>
                </div> 
            )}

            {subpage === 'create' && (
                <div>
                    <CreatePage />
                </div>
            )}
        </div>
    )
}