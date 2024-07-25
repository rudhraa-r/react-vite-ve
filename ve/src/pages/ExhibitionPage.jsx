import axios from "axios";
import { useEffect, useState } from "react";
import { Link,  useParams } from "react-router-dom"
import Image from "../Image";

export default function ExhibtionPage () {
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
        <div className="shadow-lg mt-10 bg-gray-200 rounded-2xl items-center justify-center w-10/12 self-center">
            <div className="bg-gray-100 text-center shadow-lg m-7 text-2xl p-3.5 rounded-lg flex justify-between items-center">
                <Link to={'/'} className=" ">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-7">
                        <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                    </svg>
                </Link>
                <div className=" ">{exhibition.title}</div>
                <div></div>
            </div>
            <div className="flex">
                <div className=" flex-col mx-5  items-center justify-center ">
                    <Image className="object-cover rounded-2xl h-auto w-full sm:w-96 aspect-square" src={exhibition.coverphoto} alt="" />
                    <p className="text-center lg:self-center italic">Cover Photo</p>
                </div>
                <div className=" flex flex-col w-1/2 p-2 mx-7">
                    <div className="text-center py-7 h-32  text-gray-700 text-xl mb-4 rounded-lg">
                    Description : {exhibition.description} 
                    </div>
                    
                    <Link to={`/exhibitions/${exbId}/`+exhibition.title} className="px-5 w-full self-end rounded-2xl ">
                    <div className="text-center w-3/4 sm:w-11/12 py-3 px-2 my-9 mx-9 bg-teal-700  text-white text-xl rounded-2xl">Enter Exhibition</div>
                    </Link>
                </div>
            </div>
        </div>
    )
}