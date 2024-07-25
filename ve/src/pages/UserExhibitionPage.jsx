import { Link, useLocation, useParams } from "react-router-dom"
import {useEffect, useState } from "react";
import axios from 'axios';
import Image from "../Image";


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

    const removeStall = (stallId) => {
        axios.delete('/stalls/' + stallId)
            .then(() => {
                setCreateStall(prevStalls => prevStalls.filter(stall => stall._id !== stallId));
            })
            .catch(error => {
                console.error("There was an error deleting the stall!", error);
            });
    };


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

            <div className="mt-4 items-center w-auto gap-2 sm:gap-1 grid grid-cols-2  md:grid-cols-4 lg:grid-cols-5 ">
                {createStall.length > 0 && createStall.map(stall =>(
                    <div className=" mx-4 sm:mx-3 flex justify-center ">
                        
                        <Link to={`/account/create/${exb.title}/${stall._id}`} state={{exb}} className="sm:w-auto w-full">
                        <div className=" bg-gray-100   p-4  shadow-md  rounded-2xl my-4  border ">
                        
                            <div className="flex h-auto rounded-xl bg-gray-300 ">
                                {stall.photos.length > 0 && (
                                    <Image src={stall.photos[0]} alt="" className="object-cover grow shrink-0 rounded-xl w-auto aspect-square"/>
                                )}
                                <button onClick={(e) => { e.preventDefault(); removeStall(stall._id); }} className=" self-start relative -top-3.5 right-2.5 cursor-pointer text-black   bg-opacity-50 rounded-2xl py-0 px-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 ">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                            </div> 
                            
                            
                            <div className="flex items-center justify-center  bg-teal-800 text-white rounded-xl h-auto w-full px-4 py-1 my-1">
                                <h2 className="text-wrap text-center  self-center">{stall.name}</h2>
                                
                            </div>
                                
                        </div>
                        
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}