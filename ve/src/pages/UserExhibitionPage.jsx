import { Link, useLocation, useParams } from "react-router-dom"
import {useEffect, useState } from "react";
import axios from 'axios';


export default function UserExbPage(){
    
    const location = useLocation();
    const exb = location.state?.exb;
    console.log(location);

    if (!exb) {
        return <div>Loading...</div>;
      }
    
    const [createStall , setCreateStall ] = useState([]);
      useEffect(() =>{
        if(exb && exb._id){
          axios.get('/stalls/'+exb._id).then(({data})=>{
              setCreateStall(data);
          })
        }else {
            console.warn("Exhibition ID is not defined");
        }
    }, [exb])

    return(
        <div className=" items-center justify-center">
            <div className="bg-gray-200 text-center shadow-lg mt-7 text-2xl p-3.5 rounded-lg flex justify-between items-center">
                <Link to={'/account/create'} className=" ">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-7">
                        <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                    </svg>
                </Link>
                <div className=" ">{exb.title}</div>
                <div></div>
            </div>
            <p className="text-gray-600 mt-2">Description : {exb.description}</p>
            <div className=" text-center mt-4">
                <Link className="inline-flex shadow-lg gap-1 bg-teal-900 text-white py-2 px-6 rounded-full" to={`/account/create/new/${exb.title}/stall`} state={{exb}}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Add New Stall
                </Link> 
            </div>

            <div className="mt-4 items-center  gap-2 grid grid-cols-3  md:grid-cols-4 lg:grid-cols-5 ">
                {createStall.length > 0 && createStall.map(stall =>(
                    <div className=" mx-4 flex justify-center ">
                        <Link to={`/account/create/${exb.title}/${stall._id}`} state={{exb}} className="w-full">
                        <div className=" bg-gray-100  flex-col p-4  shadow-md  rounded-2xl my-4  border ">
                            <div className="flex h-32 rounded-xl bg-gray-300 ">
                                {stall.photos.length > 0 && (
                                    <img src={'http://localhost:4000/uploads/'+stall.photos[0]} alt="" className="object-cover grow shrink-0 rounded-xl"/>
                                )}
                            </div> 
                            <div className="bg-teal-800 text-white rounded-xl">
                                <h2 className="text-xl text-center  mt-3">{stall.name}</h2>
            
                            </div>
                        </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}