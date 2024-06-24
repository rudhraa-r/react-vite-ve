import axios from "axios";
import {  useState } from "react";
import { Navigate } from "react-router-dom";
import { Link, useParams, useLocation } from "react-router-dom"


export default function NewStallPage(){

    const [name , setName] = useState('');
    const [addedPhotos , setAddedPhotos] = useState([]);
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

    async function addNewStall(ev) {
       ev.preventDefault();
       await axios.post('/stall', {name , addedPhotos});
       setRedirect(true);
    }
    const {exbTitle , stall} = useParams();

    //exbpath = pathname.split('/').slice(0, 5).join('/');
    const location = useLocation();
    //const { stall } = location.state || {};
    console.log(location)
    //console.log(location.state);

    if(redirect) {
        return <Navigate to={`/account/create/new/${exbTitle}`} state={{ exb: { title: exbTitle }} } />
    }

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
                        <div className="rounded-2xl h-32 flex">
                            <img src={"http://localhost:4000/uploads/"+link} alt="" className="rounded-2xl w-full object-cover" />
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
                <button on className=" p-2 text-white  rounded-2xl bg-teal-800 my-4 w-3/4 items-center ">Add Stall</button>
            </form>
        </div>
    )
}