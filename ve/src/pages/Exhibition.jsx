import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Image from "../Image";


export default function Exhibition () {

    const {exbId} = useParams();
    const [stalls, setStalls] = useState([]);
    const [exhibition, SetExhibition] = useState('');

    useEffect(() =>{

        axios.get('/exhibition/'+exbId).then(response =>{
            SetExhibition(response.data);
        })
        if(exbId){
            axios.get('/stalls/'+exbId).then(({data}) =>{
                setStalls(data);
            })
        }else {
            console.warn("Exhibition ID is not defined");
        } 
    }, [exbId])

    return(
        <div>
            <div className="mt-4 rounded-2xl shadow-lg bg-gray-200 items-center w-auto self-center gap-3 sm:gap-1 grid grid-cols-2  md:grid-cols-4 lg:grid-cols-5 ">
                {stalls.length? (stalls.map(stall =>(
                    <div className=" mx-4 sm:mx-3 flex justify-center ">
                        <Link to={`/exhibitions/${exbId}/${exhibition.title}/`+stall._id}  className="sm:w-auto w-full">
                        <div className=" bg-gray-100  flex-col p-4  shadow-md  rounded-2xl my-4  border ">
                            <div className="flex h-auto rounded-xl bg-gray-300 ">
                                {stall.photos.length > 0 && (
                                    <Image src={stall.photos[0]} alt="" className="object-cover grow shrink-0 rounded-xl w-auto aspect-square"/>
                                )}
                            </div> 
                            <div className="bg-teal-800 text-white rounded-xl">
                                <h2 className="text-xl text-center  mt-3">{stall.name}</h2>
            
                            </div>
                        </div>
                        </Link>
                    </div>
                ))) :(
                    <div className="bg-gray-300 rounded-2xl mb-2 aspect-square  flex items-center justify-evenly italic">No Stalls Available </div>
                )}
            </div>
        </div>
    )
}