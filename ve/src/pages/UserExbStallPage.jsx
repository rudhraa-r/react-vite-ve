import axios from "axios";
import {  useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Link, useParams, useLocation } from "react-router-dom"
import Image from "../Image";


export default function NewStallPage(){

    const [name , setName] = useState('');
    const [addedPhotos , setAddedPhotos] = useState([]);
    const [addedVideos, setAddedVideos] = useState([]);
    const [photoLink , setPhotoLink] = useState('');
    const [redirect, setRedirect] = useState(false);


    async function addPhotoByLink(ev) {
        ev.preventDefault();
        const {data:filename} = await axios.post('/upload-by-link' , {link:photoLink})
        setAddedPhotos(prev =>{
            return [...prev, filename];
        });
        setPhotoLink('');
    };

    async function uploadPhoto(ev) {
        const files = ev.target.files;
        const data = new FormData();

        for (let i = 0; i < files.length; i++) {
            data.append('photos', files[i]);    
        }
        await axios.post('/upload', data, {
            headers: {'Content-Type': 'multipart/form-data'}
        }).then(response =>{
            const {data:filenames} = response;
            setAddedPhotos(prev =>{
                return [...prev, ...filenames];
            });
        })
    }

    async function uploadVideo(ev) {
        const files = ev.target.files;
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
          data.append("videos", files[i]);
        }
        await axios.post("/upload-video", data, {
          headers: { "Content-Type": "multipart/form-data" },
        }).then((response) => {
          const { data: filenames } = response;
          setAddedVideos((prev) => [...prev, ...filenames]);
        });
      }
    console.log(addedPhotos);

    const {exbTitle , stallId} = useParams();
    const location = useLocation();
    console.log(location);
    const { exb } = location.state || {};
    
    
    console.log(stallId);
    console.log(exb._id);
    useEffect(() => {
        if(!stallId){
          return
        }
        axios.get(`/create/${exbTitle}/`+stallId).then(response =>{
          const {data} = response;
          setName(data.name);
          setAddedPhotos(data.photos);
          setAddedVideos(data.videos);
        })
      }, [stallId,exbTitle]) 
   
    async function addNewStall(ev) {
        ev.preventDefault();
        const data = {name , addedPhotos, addedVideos,exhibitionId: exb._id};
        if(stallId){
            await axios.put('/stall', { stallId, ...data });
            setRedirect(true);
        }else{
            await axios.post('/stall', {name , addedPhotos,addedVideos,exhibitionId: exb._id});
            setRedirect(true);
        }
    }
    
    if(redirect) {
        return <Navigate to={`/account/create/new/${exb._id}`} state={{exb}} />
    }

    function removePhoto(filename){
        setAddedPhotos(prev => prev.filter(photo => photo !== filename));
    }

    function selectAsMainPhoto(filename){
        const addedPhotoswithoutSelected = addedPhotos.filter(photo => photo !== filename)
        const newAddedPhotos = [filename, ...addedPhotoswithoutSelected];
        setAddedPhotos(newAddedPhotos);
    }

    function removeVideo(filename) {
        setAddedVideos((prev) => prev.filter((video) => video !== filename));
      }

    const getImageName = (url) => {
        const parts = url.split('/');
        const orname = parts[parts.length - 1];
        const imagename = orname.split('.')
        return imagename[0];
    };

    return (
        <div>
            <form action="" onSubmit ={addNewStall}>
                <h2 className="text-2xl mt-14">Name of the Stall :</h2>
                <p className="text-gray-500 text-sm">Make sure to keep the name short </p>
                <input value={name} onChange={ev => setName(ev.target.value)} type="text" placeholder='Title , Example: My New Exhibition'/>

                <h2 className="text-2xl mt-8">Photos :</h2>
                <div className="flex gap-2">
                    <input type="text" value={photoLink} onChange={ev => setPhotoLink(ev.target.value)} placeholder={'Add using a link ....jpg'} />
                    <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">Add&nbsp;Photo</button>
                </div>
                
                <div className=" mt-2 gap-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {addedPhotos.length > 0 && addedPhotos.map(link => (
                        <div key={link} className="rounded-2xl h-32 flex relative">
                            <Image src={link} alt="" className="rounded-2xl w-full object-cover" />
                            <button onClick={(e) => {e.preventDefault();removePhoto(link);}} className="cursor-pointer absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-2xl py-1 px-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                            <button onClick={(e) => {e.preventDefault();selectAsMainPhoto(link);}} className="cursor-pointer absolute bottom-1 left-1 text-white bg-black bg-opacity-50 rounded-2xl py-1 px-2">
                                {link === addedPhotos[0] && (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                    </svg>
                                  
                                )}
                                {link !== addedPhotos[0] && (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    )) }
                    <label className=" cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-8 text-2xl text-gray-600">
                        <input multiple type="file" className="hidden" onChange={uploadPhoto} />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                        </svg>
                        Upload
                    </label>
                </div>
                

                <h2 className="text-2xl mt-8">Videos :</h2>
                
                
                <div className=" mt-2 gap-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {addedVideos.length > 0 && addedVideos.map(link => (
                        <div key={link} className="rounded-2xl h-32 flex relative">
                            <video src={link} alt="" className="rounded-2xl w-full object-cover" />
                            <button onClick={(e) => {e.preventDefault();removeVideo(link);}} className="cursor-pointer absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-2xl py-1 px-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    )) }
                    <label className=" cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-8 text-2xl text-gray-600">
                        <input multiple type="file" className="hidden" onChange={uploadVideo} />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                        </svg>
                        Upload Videos
                    </label>
                </div>
                
                <button on className=" p-2 text-white  rounded-2xl bg-teal-800 my-4 w-3/4 items-center ">Add / Save </button>
            </form>
        </div>
    )
}