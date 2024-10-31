import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { backendUrl, token, setToken } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === 'Sign Up') {

        const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
        
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-lg text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p>Please {state === 'Sign Up' ? 'sign up' : 'login'} to book an appointment</p>
        
        {state === 'Sign Up' && (
          <div className="w-full">
            <label htmlFor="name">Full Name</label>
            <input id="name" className="border border-zinc-300 rounded w-full p-2 mt-1" type="text" onChange={(e) => setName(e.target.value)} value={name} />
          </div>
        )}
        
        <div className="w-full">
          <label htmlFor="email">Email</label>
          <input id="email" className="border border-zinc-300 rounded w-full p-2 mt-1" type="text" onChange={(e) => setEmail(e.target.value)} value={email} />
        </div>
        
        <div className="w-full">
          <label htmlFor="password">Password</label>
          <input id="password" className="border border-zinc-300 rounded w-full p-2 mt-1" type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
        </div>
        
        <button type="submit" className="bg-primary text-white w-full py-2 rounded-md text-base">
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>
        
        {state === 'Sign Up' ? (
          <p>
            Already have an account?{' '}
            <span onClick={() => setState('Login')} className="text-primary underline cursor-pointer">Login here</span>
          </p>
        ) : (
          <p>
            Create a new account?{' '}
            <span onClick={() => setState('Sign Up')} className="text-primary underline cursor-pointer">Click here</span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
