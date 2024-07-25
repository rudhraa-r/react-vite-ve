import axios from "axios";
import { useEffect, useState } from "react";
import AccountNav from "./AccountNavPage";
import { Navigate, useParams } from "react-router-dom";
import Image from "../Image";


export default function CreateFormPage(){

    const {id} =useParams();
    
    const [title , setTitle] = useState('');
    const [description , setDescription] = useState('');
    const [coverphoto , setCoverPhoto] = useState(null);
    const [datefrom , setDatefrom] =useState('');
    const [dateto, setDateto] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
      if(!id){
        return
      }
      axios.get('/create/'+id).then(response =>{
        const {data} = response;
        setTitle(data.title);
        setDescription(data.description);
        setCoverPhoto(data.coverphoto);
        setDatefrom(data.datefrom);
        setDateto(data.dateto);
      })
    }, [id])
    

    async function saveExhibition(ev){
        ev.preventDefault();
        const data ={title, description,coverphoto, datefrom, dateto};
        if(id){
            
            await axios.put('/create-exb',{id, ...data});
            setRedirect(true);

        } else {
            await axios.post('/create-exb', data);
            setRedirect(true);
        }
        
    }
    async function uploadPhoto(ev) {
        const file = ev.target.files[0];
        const data = new FormData();
        data.append('coverphoto', file);    
        await axios.post('/uploadcover', data, {
            headers: {'Content-Type': 'multipart/form-data'}
        }).then(response =>{
            setCoverPhoto(response.data);
            });
        }
    
        function removePhoto(filename){
            setCoverPhoto(null)
        }

    if(redirect) {
        return <Navigate to={'/account/create'} />
    }

    return(
        <div>
            <AccountNav />
                <form onSubmit={saveExhibition} className="  flex flex-col">
                    <div className="flex-none">
                    <h2 className="text-2xl mt-4">Title</h2>
                    <input type='text' value={title} onChange={ev => setTitle(ev.target.value)} placeholder='Title , Example: My New Exhibition' />

                    <h2 className="text-2xl mt-4">Description</h2>
                    <p className="text-gray-500 text-sm">Write a few words about the kind of exhibition you are hosting</p>
                    <textarea value={description} onChange={ev => setDescription(ev.target.value)} />
                    

                    <h2 className="text-2xl mt-4">Cover Photo </h2>
                    <p className="text-gray-500 text-sm">Upload a cover photo for your exhibition </p>
                    <div className=" mt-2 gap-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 ">
                    {coverphoto ? (
                        <div key={coverphoto} className="rounded-2xl h-32 flex relative shadow-lg">
                            <Image src={coverphoto} alt="" className="rounded-2xl w-full object-cover" />
                            <button onClick={(e) => {e.preventDefault();removePhoto(coverphoto);}} className="cursor-pointer absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-2xl py-1 px-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                            </div>
                        ) : (<label className=" shadow-lg cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-8 text-2xl text-gray-600">
                            <input  type="file" className="hidden" onChange={uploadPhoto} />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-11">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                            </svg>
                            Upload 
                        </label>
                        )}
                    
                    </div>

                    <h2 className="text-2xl mt-3">Exhibition Dates</h2>
                    <div className=" max-w-sm text-left  ">
                        <p className="text-gray-500 text-sm">Mention the starting & ending date of your exhibition</p>
                        <div className="flex">
                            <div className="  my-4  px-4 rounded-2xl  bg-gray-200 border border-teal-700">
                                <h3 className=" -mb-5 py-2.5 text-lg">Start Date :</h3>
                                <input value={datefrom} onChange={ev => setDatefrom(ev.target.value)} type="date" placeholder="dd/mm/yyyy , Example: 12/12/2024" />
                            </div>
                            <div className=" my-4 mx-4 px-4 rounded-2xl bg-gray-200 border border-teal-700">
                                <h3 className="  -mb-5 py-2.5 text-lg">End Date :</h3>
                                <input value={dateto} onChange={ev => setDateto(ev.target.value)} type="date" placeholder="dd/mm/yyyy , Example: 16/12/2024" />
                            </div>
                            </div>
                        </div>
                    </div>
                    <button className=" p-2 text-white rounded-2xl bg-teal-800 my-4 w-full   ">Create / Save</button>
                </form>
            </div>
    );
}