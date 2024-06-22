import axios from "axios";
import { useState } from "react";
import AccountNav from "./AccountNavPage";
import { Navigate } from "react-router-dom";


export default function CreateFormPage(){

    const [title , setTitle] = useState('');
    const [description , setDescription] = useState('');
    const [datefrom , setDatefrom] =useState('');
    const [dateto, setDateto] = useState('');
    const [redirect, setRedirect] = useState(false);

    async function createNewExhibition(ev){
        ev.preventDefault();
        const data ={title, description, datefrom, dateto};
        await axios.post('/create-exb', data);
        setRedirect(true);
    }

    if(redirect) {
        return <Navigate to={'/account/create'} />
    }

    return(
        <div>
            <AccountNav />
                <form onSubmit={createNewExhibition}>
                    <div className="text-left">
                    <h2 className="text-2xl mt-4">Title</h2>
                    <input type='text' value={title} onChange={ev => setTitle(ev.target.value)} placeholder='Title , Example: My New Exhibition' />

                    <h2 className="text-2xl mt-4">Description</h2>
                    <p className="text-gray-500 text-sm">Write a few words about the kind of exhibition you are hosting</p>
                    <textarea value={description} onChange={ev => setDescription(ev.target.value)} />

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
                    <button className=" p-2 text-white rounded-2xl bg-teal-800 my-4 w-3/4 items-center ">Create</button>
                </form>
            </div>
    );
}