import axios from "axios";
import { useEffect, useState } from "react";
import React from 'react';
import { format } from 'date-fns';
import { Link } from "react-router-dom";

export default function IndexPage () {
    const [exhibitions , SetExhibitions] = useState([]);
    const [stalls , setStalls] = useState([])
    useEffect(() =>{
        axios.get('/exhibitions').then(response =>{
            SetExhibitions(response.data);
        });
    }, []);

    const DateFormatter = ({ datefrom, dateto }) => {
        const formattedDate = `${format(new Date(datefrom), 'MMMM dd')}-${format(new Date(dateto), 'MMM dd')}`;
        return (
          <div className="">Live from: <span className=" text-xs font-bold">{formattedDate}</span></div>
        );
      };


    return( 
    <div className=" mt-10 gap-x-11 gap-y-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4" >
        {exhibitions.length > 0 && exhibitions.map(exb =>(
            <Link className="bg-gray-100 rounded-2xl  mt-5 shadow-lg p-4" to={'/exhibition/'+exb._id}  key={exb._id} state={{exb}}>
                {exb.coverphoto ? (
                        <div className="bg-gray-500 rounded-2xl mb-2">
                            <img src={'http://localhost:4000/uploads/'+exb.coverphoto} alt="" className="rounded-2xl object-cover aspect-square" />
                        </div>  
                        ) : (
                            <div className="bg-gray-300 rounded-2xl mb-2 aspect-square  flex items-center justify-evenly italic"><p>Cover Photo</p></div>
                        )}
                <h2 className="text-xl font-semibold"> {exb.title}</h2>
                <h3 className="text-sm text-gray-800 ">{exb.description}</h3>
                <div className="text-sm mt-1 text-gray-600">
                <DateFormatter datefrom={exb.datefrom} dateto={exb.dateto} />
                </div>
            </Link>
            ) 
    )}
    </div>

    )
}

