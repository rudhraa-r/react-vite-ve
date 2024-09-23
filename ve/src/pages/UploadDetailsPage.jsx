import axios from "axios";
import { useEffect, useState } from "react"
import { Navigate, useLocation, useParams } from "react-router-dom";

export default function UploadDetailsPage(){

    const {stallId, imgId} = useParams();
    const location = useLocation();
    console.log(location);
    const { exb } = location.state || {};


    const [name , setName] = useState('');
    const [description, setDescription]=useState('');
    const [price, setPrice]=useState('');
    const [redirect, setRedirect]= useState(false);
    const [id, setId] = useState(null);

    

    async function saveUpload(ev){
        ev.preventDefault();
        const data ={name, description,price, imgId,stallId};
        if(id){
            await axios.put('/uploadDetails', {...data});
            setRedirect(true);

        } else {
            await axios.post('/uploadDetails', {name, description,price, imgId, stallId});
            setRedirect(true);
        }
        
    }

    useEffect(() =>{
        if(!imgId){
            return;
        }
        axios.get(`/uploadDetails/${imgId}`).then(response =>{
            const {data} = response;
            setName(data[0].name);
            setPrice(data[0].price);
            setDescription(data[0].description);
            setId(data[0]._id);
        })
    
    },[imgId])

    if(redirect) {
        return <Navigate to={`/account/create/${exb.title}/${stallId}`}state={{exb}} />
    }


    return(
        <div>
           <form onSubmit={saveUpload} className="  flex flex-col">
                    <div className="flex-none">
                    <h2 className="text-2xl mt-14">Name </h2>
                    <p className="text-gray-500 text-sm">Make sure to keep the name short </p>
                    <input value={name} onChange={ev => setName(ev.target.value)} type="text" placeholder='Title , Example: My New Exhibition'/>


                    <h2 className="text-2xl mt-4">Description</h2>
                    <p className="text-gray-500 text-sm">Write a few words about the kind of exhibition you are hosting</p>
                    <textarea value={description} onChange={ev => setDescription(ev.target.value)} />

                    <h2 className="text-2xl mt-4">Price</h2>
                    <p className="text-gray-500 text-sm">Write a few words about the kind of exhibition you are hosting</p>
                    <input type='number' value={price} onChange={ev => setPrice(ev.target.value)} placeholder='Price' />
                    </div>
                    <button className=" p-2 text-white rounded-2xl bg-teal-800 my-4 w-full   ">Create / Save</button>
                </form>
        </div>
    )
}