import { useEffect, useState } from 'react';
import { FaBars, FaSignOutAlt, FaTimes, FaUserCircle } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';

const API = import.meta.env.VITE_API;

const roleShort = {
  admin: "ผู้ดูแลระบบ",
  samo: "สโมสร",
  rally: "ชุมนุม",
  user: "ผู้ใช้",
};

const Rally_Navbar = ({ onLogout, role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const location = useLocation();

  const fetchCurrentUser = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser) return;

      const userId = storedUser._id || storedUser.id;
      const token = localStorage.getItem('token');

      const res = await fetch(`${API}/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch user');

      const data = await res.json();

      if (data.image) {
        setUserImage(data.image);
      }
    } catch (err) {
      console.error('Fetch current user error:', err);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const isActive = (path) => location.pathname === path ? "bg-white/20 font-bold" : "hover:bg-white/10";

  return (
    <header className="bg-[#ffcd08] text-gray-900 shadow-md sticky top-0 z-50 font-sans">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          <div className="flex-shrink-0 flex items-center gap-3">
            <Link to="/">
              <img
                src="/src/assets/PSU.png"
                alt="LOGO"
                className="h-12 w-auto drop-shadow-sm hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-2 bg-black/5 p-1.5 rounded-full">
            <Link to="/" className={`px-6 py-2 rounded-full transition-all duration-300 ${isActive('/')}`}>
              หน้าหลัก
            </Link>
            <Link to="/borrow" className={`px-6 py-2 rounded-full transition-all duration-300 ${isActive('/borrow')}`}>
              ยืม/คืนพัสดุ
            </Link>
            <Link to="/rally_durable" className={`px-6 py-2 rounded-full transition-all duration-300 ${isActive('/rally_durable')}`}>
              ครุภัณฑ์
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/profile"
              className="flex items-center gap-3 pl-1 pr-4 py-1 bg-white/40 hover:bg-white/60 rounded-full transition-all cursor-pointer group border border-white/20"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-105 transition-transform border-2 border-white">
                {userImage ? (
                  <img
                    src={userImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-3xl text-gray-400" />
                )}
              </div>

              <div className="flex flex-col items-start leading-tight">
                <span className="text-[10px] font-bold text-gray-600 uppercase">สถานะ</span>
                <span className="text-sm font-bold text-gray-900">{roleShort[role] || role}</span>
              </div>
            </Link>

            <button
              onClick={onLogout}
              className="bg-white text-red-500 hover:bg-red-50 hover:text-red-600 px-4 py-2.5 rounded-xl font-bold shadow-sm transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <FaSignOutAlt />
              <span className="text-sm">ออก</span>
            </button>
          </div>

          {/* --- Mobile Menu Button --- */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 focus:outline-none p-2 rounded-md hover:bg-black/5 transition-colors"
            >
              {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>
      </nav>

      <div className={`lg:hidden absolute w-full bg-[#ffcd08] shadow-xl border-t border-black/5 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 pt-4 pb-6 space-y-3 flex flex-col items-center">
          <Link to="/" onClick={() => setIsOpen(false)} className="w-full text-center py-3 font-bold hover:bg-white/20 rounded-lg transition-colors">หน้าหลัก</Link>
          <Link to="/borrow" onClick={() => setIsOpen(false)} className="w-full text-center py-3 font-bold hover:bg-white/20 rounded-lg transition-colors">ยืม/คืนพัสดุ</Link>
          <Link to="/rally_durable" onClick={() => setIsOpen(false)} className="w-full text-center py-3 font-bold hover:bg-white/20 rounded-lg transition-colors">ครุภัณฑ์</Link>
          <div className="w-full h-[1px] bg-black/10 my-2"></div>
          <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white/20 w-full justify-center transition-colors">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
              {userImage ? (
                <img src={userImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <FaUserCircle className="w-full h-full text-gray-600 bg-white" />
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-gray-900">{roleShort[role]}</span>
              <span className="text-xs text-gray-700">แตะเพื่อแก้ไขโปรไฟล์</span>
            </div>
          </Link>

          <button
            onClick={onLogout}
            className="w-full bg-white/90 text-red-600 py-3 rounded-lg font-bold shadow-sm flex justify-center items-center gap-2 hover:bg-white transition-colors"
          >
            <FaSignOutAlt /> ออกจากระบบ
          </button>
        </div>
      </div>
    </header>
  );
};

export default Rally_Navbar;