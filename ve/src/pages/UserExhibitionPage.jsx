import { Link, useLocation, useParams } from "react-router-dom"


export default function UserExbPage(){
    const {exbTitle} = useParams();
    const location = useLocation();
    const { exb } = location.state || {};

    if (!exb) {
        return <div>Loading...</div>;
      }

    return(
        <div >
            <div className="bg-gray-300 text-center mt-7 text-2xl p-3.5 rounded-lg">{exb.title}</div>
            <p className="text-gray-600 mt-2">Description : {exb.description}</p>
            <div className=" text-center mt-4">
                <Link className="inline-flex gap-1 bg-teal-900 text-white py-2 px-6 rounded-full" to={`/account/create/new/${exb.title}/stall`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Add New Stall
                </Link> 
            </div>
        </div>
    )
}