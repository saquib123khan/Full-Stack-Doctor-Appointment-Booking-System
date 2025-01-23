import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    if (token && ['/login', '/signup'].includes(location.pathname)) {
      navigate('/');
    }
  }, [token, navigate, location.pathname]);

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img onClick={() => navigate('/')} className="w-44 cursor-pointer" src={assets.logo} alt="Logo" />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/">HOME</NavLink>
        <NavLink to="/doctors">ALL DOCTORS</NavLink>
        <NavLink to="/about">ABOUT</NavLink>
        <NavLink to="/contact">CONTACT</NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="flex items-center gap-2 group relative">
            <img className="w-8 rounded-full" src={userData.image || assets.default_profile} alt="Profile" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="Dropdown Icon" />
            <div className="absolute top-0 right-0 p-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p onClick={() => navigate('/my-profile')} className="cursor-pointer">My Profile</p>
                <p onClick={() => navigate('/my-appointments')} className="cursor-pointer">My Appointment</p>
                <p onClick={logout} className="cursor-pointer">Logout</p>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} className="bg-primary text-white px-8 py-3 rounded-full hidden sm:block">
            Create Account
          </button>
        )}
        <img onClick={() => setShowMenu(true)} className="w-6 md:hidden cursor-pointer" src={assets.menu_icon} alt="Menu Icon" />
        {showMenu && (
          <div className="fixed top-0 right-0 bottom-0 w-full md:hidden bg-white z-20">
            <div className="flex items-center justify-between px-5 py-6">
              <img className="w-36" src={assets.logo} alt="Logo" />
              <img className="w-7" onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="Close Menu" />
            </div>
            <ul className="flex flex-col items-center gap-2 mt-5 text-lg font-medium">
              <NavLink onClick={() => setShowMenu(false)} to="/">HOME</NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/doctors">ALL DOCTORS</NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/about">ABOUT</NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/contact">CONTACT</NavLink>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

