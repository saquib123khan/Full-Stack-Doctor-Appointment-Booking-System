import { createContext } from "react";

export const DoctorContext = createContext()

const DoctorContextProvider = ({children}) => {

    const value = {

    }

    return(
        <DoctorContext.Provider value={children}>
                {children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider