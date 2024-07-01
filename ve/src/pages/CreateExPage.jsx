
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

    console.log(createexb);
    return( 
    <div>
        <AccountNav  />
            <div className=" text-center ">
            List of all added Exhibition
            <br />
                <Link className="inline-flex gap-1 bg-teal-900 text-white py-2 px-6 rounded-full shadow-lg" to={'/account/create/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 ">
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                    </svg>
                Create New Exhibition
                </Link> 
            </div>
            <div className="mt-4">
                {createexb.length > 0 && createexb.map(exb =>(
                    <div  className="">
                        <Link to={`/account/create/new/${exb.title}`} state={{exb}} className="">
                            <div key={exb._id} className=" flex justify-between bg-gray-200 p-4 rounded-2xl my-4 border shadow-lg">
                                <div className="flex gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"width="24" height="24"><path d="M247.6 8C389.4 8 496 118.1 496 256c0 147.1-118.5 248-248.4 248C113.6 504 0 394.5 0 256 0 123.1 104.7 8 247.6 8zm.8 44.7C130.2 52.7 44.7 150.6 44.7 256c0 109.8 91.2 202.8 203.7 202.8 103.2 0 202.8-81.1 202.8-202.8 .1-113.8-90.2-203.3-202.8-203.3zm161.7 207.7l4.9 2.2v70c-7.2 3.6-63.4 27.5-67.3 28.8-6.5-1.8-113.7-46.8-137.3-56.2l-64.2 26.6-63.3-27.5v-63.8l59.3-24.8c-.7-.7-.4 5-.4-70.4l67.3-29.7L361 178.5v61.6l49.1 20.3zm-70.4 81.5v-43.8h-.4v-1.8l-113.8-46.5V295l113.8 46.9v-.4l.4 .4zm7.5-57.6l39.9-16.4-36.8-15.5-39 16.4 35.9 15.5zm52.3 38.1v-43L355.2 298v43.4l44.3-19z"/></svg>
                                <span>{exb.title}</span>
                                </div>
                                <Link to={`/account/create/`+exb._id} className="justify-end items-end flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                    </svg>
                                </Link> 
                            </div>
                        </Link>   
                        
                    </div>
                ))}
            </div>
    </div>
)}