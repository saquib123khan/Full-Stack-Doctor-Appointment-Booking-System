import { useContext } from "react";
import Login from "./pages/Login"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import AllApointment from "./pages/Admin/AllApointment";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";


const App = () => {

  const {aToken} = useContext(AdminContext)
  return aToken? (
    <div>
      <ToastContainer/>
      <Navbar/>
      <div className="flex items-start ">
        <Sidebar/>
        <Routes>
          <Route path="/" element={<></>}/>
          <Route path="/admin-dashboard" element={<Dashboard/>}/>
          <Route path="/all-appointements" element={<AllApointment/>}/>
          <Route path="/add-doctors" element={<AddDoctor/>}/>
          <Route path="/doctor-list" element={<DoctorsList/>}/>
        </Routes>
      </div>
    </div>
  ) : (
    <>
    <Login/>
    <ToastContainer/>
    </>
  )
}

export default App