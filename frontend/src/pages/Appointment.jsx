import { useContext, useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AppContext } from "../context/AppContext"
import { assets } from "../assets/assets"
import RelatedDoctors from "../components/RelatedDoctors"
import { toast } from "react-toastify"
import axios from "axios"

const Appointment = () => {

  const {docId} = useParams()
  const {doctors,currencySymbol, backendUrl, token, getDoctorsData} = useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON',' TUE', 'WED', 'THU', 'FRI', 'SAT']

  const navigate  = useNavigate()

  const [docData, setDocData] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const fetchDocData = async () => {
  const docInfo = doctors.find(doc => doc._id === docId)
    setDocData(docInfo) 
    console.log(docInfo);
  }

  const getAvailableSlots = async () => {
    // Reset the docSlots state to an empty array before fetching new slots
    setDocSlots([])
  
    // Get the current date and time
    const today = new Date()
  
    // Loop through the next 7 days to generate slots for each day
    for (let i = 0; i < 7; i++) {
  
      // Create a new Date object for the current iteration day (i days from today)
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i) // Add i days to today's date
  
      // Set the end time for the day to 9 PM (21:00:00)
      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0) // Set to 21:00 (9 PM)
  
      // If it's the current day, start from the next available hour; otherwise, start from 10 AM
      if (today.getDate() === currentDate.getDate()) {
        // Start time is the current hour or the next hour, but not before 10 AM
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        // Round minutes to either 00 or 30 for cleaner slot intervals
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        // For future days, set the start time to 10:00 AM
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }
  
      // Initialize an array to store time slots for the current day
      let timeSlots = []
      
      // Generate 30-minute slots until the end time of the day (9 PM)
      while (currentDate < endTime) {
        // Format the time (e.g., 10:30 AM) for displaying in the slots
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        const slotDate = `${day}_${month}_${year}`;
        const slotTime = formattedTime;

        const isSlotAvailable = docData?.slots_booked?.[slotDate]?.includes(slotTime) ? false : true;

        if (isSlotAvailable) {
          timeSlots.push({
            dateTime: new Date(currentDate),
            time: formattedTime,
          });
        }
  
        // Increment the current time by 30 minutes for the next slot
        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }
  
     // Append the new timeSlots array to the existing docSlots array
    // The spread operator ensures the previous state (prev) is maintained
      setDocSlots(prev => ([...prev, timeSlots])) 
    }
  }

  const bookAppointment = async () => {
    if(!token){
      toast.warn('loigin to book appointment')
      return navigate('/login')
    }

    try {
      const date = docSlots[slotIndex][0].dateTime

      let day = date.getDate()
      let month = date.getMonth()+1
      let year = date.getFullYear()

      const slotDate = day + "_" + month + "_" + year
      
      const {data} = await axios.post(backendUrl + '/api/user/book-appointment', {docId, slotDate, slotTime}, {headers: {token}})
      if(data.success){
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }


  useEffect(() => {
     getAvailableSlots()
  },[docData])
  
  useEffect(() => {
     fetchDocData()
  },[doctors, docId])

  useEffect(() => {
   console.log(docSlots); 
  },[docSlots])

  return docData && (
    <div>
      {/* ------Doctors Details------- */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full bg-primary sm:max-w-72 rounded-lg">
          <img className="w-full bg-primary sm:max-w-72 rounded-lg" src={docData.image} alt="" />
        </div>

        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80] sm:mt-0">
          {/* ------- Doc Info: name, degree, experience ------- */}
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
            {docData.name}
            <img className="w-5" src={assets.verified_icon} alt="" />
          </p>
          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
            <p>{docData.degree} - {docData.speciality}</p>
            <button className="py-0.5 px-2 border text-xs rounded-full">{docData.experience}</button>
          </div>

          {/* ------ Doctor About ------ */}
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">About <img src={assets.info_icon} alt="" /></p>
           <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docData.about}</p> 
          </div>
          <p className="text-gray-500 font-medium mt-4">Appointment fee: <span className="text-gray-500">{currencySymbol}{docData.fees}</span></p>
        </div>
      </div>

      {/* ------ booking slots ------- */}
      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
        <p>Booking slots</p>
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {
            docSlots.length && docSlots.map((item, index) => (
              <div onClick={()=>setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`} key={index}>
                <p>{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
                <p>{item[0] && item[0].dateTime.getDate()}</p>
              </div>
            ))
          }
        </div>

        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {
            docSlots.length && docSlots[slotIndex].map((item, index)=>(
               <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-700 border border-gray-200'}`} key={index}>
                  {item.time.toLowerCase()}
               </p>
            ))
          }
        </div>
        <button onClick={bookAppointment} className="bg-primary text-white text-sm font-light px-14 py-3
        rounded-full my-6">Book an Appointment</button>
      </div>

      {/* Listing Related Docters */}
      <RelatedDoctors docId={docId} speciality={docData.speciality}/>
    </div>
  )
}

export default Appointment