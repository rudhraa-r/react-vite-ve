
import { Link, useParams } from "react-router-dom"
import CreateFormPage from "./CreateFormPage";
import AccountNav from "./AccountNavPage";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CreatePage() {
    const [createexb , setCreateexb ] = useState([]);
    useEffect(() =>{
        axios.get('/create').then(({data})=>{
            setCreateexb(data);
        })
    }, [])

    return( 
    <div>
        <AccountNav  />
            <div className=" text-center">
            List of all added Exhibition
            <br />
                <Link className="inline-flex gap-1 bg-teal-900 text-white py-2 px-6 rounded-full" to={'/account/create/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                    </svg>
                Create New Exhibition
                </Link> 
            </div>
            <div className="mt-4">
                {createexb.length > 0 && createexb.map(exb =>(
                    <div className="">
                        <Link to={`/account/create/new/${exb.title}`} state={{exb}}>
                        <div className=" bg-gray-200 p-4 rounded-2xl my-4 border border-teal-700">
                        {exb.title}
                        </div>
                        </Link>    
                    </div>
                ))}
            </div>
    </div>
)}