import { createContext, useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'

export const AdminContext = createContext()

const AdminContextProvider = ({children}) => {

    const [aToken, setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
    const [doctors, setDoctors] = useState([])

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const getAllDoctors = async () => {

        try {
            const {data} = await axios.post(backendUrl + '/api/admin/all-doctors', {}, {headers:{aToken}})  
        if(data.success){
            setDoctors(data.doctors)
            console.log(data.doctors);
        }else{
            toast.error(error.message)
        }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/change-availability`, 
                { docId }, 
                { headers: { aToken } }
            );
    
            if (data.success) {
                toast.success(data.message);
                getAllDoctors(); // Optionally, you could pass docId if you update only one doctor
            } else {
                toast.error(data.message); // Use `data.message` instead of `error.message` here
            }
        } catch (error) {
            toast.error(error.message);
        }
    };
    
    const value = {
        aToken,setAToken,
        backendUrl,doctors,
        getAllDoctors,changeAvailability
    }

    return(
        <AdminContext.Provider value={value}>
                {children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider