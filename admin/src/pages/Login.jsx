import { useContext, useState } from 'react'
import {assets} from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext'

const Login = () => {

  const [state, setState] = useState('Admin')

  const {setAToken, backendUrl} = useContext(AdminContext)
  const {dToken, setDToken} = useContext(DoctorContext)

  const [LoginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const handleUserInput = (e) => {
    const {name, value} = e.target

    setLoginData((prev) =>({...prev, [name]: value}))
  }

  const handleFormSubmit = async (e) => {
     e.preventDefault()

     const {email, password} = LoginData // Extract email and password from LoginData
     try {
      if(state === 'Admin'){
         const {data} = await axios.post(backendUrl + '/api/admin/login',{email,password})
         if(data.success){
            console.log(data.token); 
            localStorage.setItem('aToken', data.token)
            setAToken(data.token)
         }else{
          toast.error(data.message)
         }
      }else{
        try {
          const {data} = await axios.post(backendUrl + '/api/doctor/login', {email, password}, {Headers:{dToken}})
        if(data.success){
          console.log(data.token); 
          localStorage.setItem('dToken', data.token)
          setDToken(data.token)
        }
        } catch (error) {
          toast.error(error.message)
        }
      }
     } catch (error) {
      toast.error(error.message)
     }
  }
  return (
    <form onSubmit={handleFormSubmit} className='min-h-[80vh] flex items-center'>
     <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
      <p className='text-2xl font-semibold m-auto'><span className='text-primary'> {state} </span>Login</p>
      <div className='w-full'>
        <p>Email</p>
        <input
         className='border border-[#DADADA] rounded w-full p-2 mt-1'
          type="text"
          name='email'
          required
          value={LoginData.email}
          onChange={handleUserInput}
          />
      </div>
      <div className='w-full'>
        <p>Password</p>
        <input className='border border-[#DADADA] rounded w-full p-2 mt-1'
        type="text"
        name='password'
        required
        value={LoginData.password}
        onChange={handleUserInput}
        />
      </div>
      <button className='bg-primary text-white w-full py-2 rounded-md text-base'>Login</button>
      {
        state === "Admin" 
        ? <p>Doctor Login? <span onClick={()=>setState('Doctor')} className='text-primary underline cursor-pointer'>Click me</span></p>
        : <p>Admin Login? <span onClick={()=>setState('Admin')} className='text-primary underline cursor-pointer'>Click me</span></p>
      }
     </div>
    </form>
  )
}

export default Login