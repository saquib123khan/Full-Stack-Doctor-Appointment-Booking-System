import { useContext, useState, useEffect } from "react"
import { AppContext } from "../context/AppContext"
import { useNavigate, useParams } from "react-router-dom"

const Doctors = () => {

  const {speciality} = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate()

  const {doctors} = useContext(AppContext)

  const applyFilter = () => {
    if(speciality){
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    }else{
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
      applyFilter()
  }, [doctors, speciality])
  return (
    <div>
    <p className="text-gray-600">Browse through the doctors specialist.</p>
    
    <div className="flex flex-col sm:flex-row justify-between items-start gap-5 mt-5">
      <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`} onClick={()=>setShowFilter(prev=> !prev)}>filter</button>
      {/* Specialities List */}
      <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
        <p onClick={()=> speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} 
           className={`w-[94vw sm:w-auto py-2 pl-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'General physician' ? 'bg-indigo-100 text-black' : ''}`}>
          General physician
        </p>
        <p onClick={()=> speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} 
           className={`w-[94vw] sm:w-auto py-2 pl-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Gynecologist' ? 'bg-indigo-100 text-black' : ''}`}>
          Gynecologist
        </p>
        <p onClick={()=> speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} 
           className={`w-[94vw] sm:w-auto py-2 pl-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Dermatologist' ? 'bg-indigo-100 text-black' : ''}`}>
          Dermatologist
        </p>
        <p onClick={()=> speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} 
           className={`w-[94vw] sm:w-auto py-2 pl-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Pediatricians' ? 'bg-indigo-100 text-black' : ''}`}>
          Pediatricians
        </p>
        <p onClick={()=> speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} 
           className={`w-[94vw] sm:w-auto py-2 pl-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Neurologist' ? 'bg-indigo-100 text-black' : ''}`}>
          Neurologist
        </p>
        <p onClick={()=> speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} 
           className={`w-[94vw] sm:w-auto py-2 pl-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Gastroenterologist' ? 'bg-indigo-100 text-black' : ''}`}>
          Gastroenterologist
        </p>
      </div>
  
      {/* Doctor Cards */}
      <div className="w-ful sm:w-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 sm:mt-0">
        {
          filterDoc.map((item, index) => (
            <div onClick={() => navigate(`/appointment/${item._id}`)} 
                 key={index} 
                 className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-x-[-10px] transition-all duration-500">
              <img className="bg-blue-50" src={item.image} alt="" />
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-center text-green-500">
                  <p className="w-2 h-2 rounded-full bg-green-500"></p><p>Available</p>
                </div>
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.speciality}</p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  </div>
  
  )
}

export default Doctors