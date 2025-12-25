import { useState } from 'react'
import { FaArrowRight, FaEye, FaEyeSlash, FaLock, FaUser } from 'react-icons/fa'

function Login({ onLogin }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const API = import.meta.env.VITE_API

  const handleLoginClick = async (e) => {
    if (e) e.preventDefault()
    if (!username || !password) return
    setLoading(true)
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      if (!res.ok) throw new Error('Error')
      const data = await res.json()
      if (onLogin && data.user) onLogin({ ...data.user, token: data.token })
    } catch (err) {
      alert("เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูล")
    }
    setLoading(false)
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0f172a] font-sans">

      {/* --- 1. Animated Background Elements (ลูกบอลแสงลอยไปมา) --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        {/* Blue Orb */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#003c71] mix-blend-multiply filter blur-[100px] opacity-70 animate-blob"></div>
        {/* Yellow Orb */}
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[#ffcd08] mix-blend-multiply filter blur-[100px] opacity-60 animate-blob animation-delay-2000"></div>
        {/* Cyan Orb */}
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-blue-500 mix-blend-multiply filter blur-[120px] opacity-50 animate-blob animation-delay-4000"></div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* --- 2. Glassmorphism Card --- */}
      <div className="relative z-10 w-full max-w-[900px] h-auto lg:h-[550px] flex flex-col lg:flex-row bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.3)] overflow-hidden">

        {/* Left Side: Branding (ปรับปรุงให้ชัดเจนขึ้น) */}
        <div
          className="w-full lg:w-5/12 p-10 flex flex-col justify-between text-white relative bg-cover bg-center"
          style={{ backgroundImage: "url('/src/assets/L1.jpg')" }} // 🔴 ใส่รูปพื้นหลังตึกคณะตรงนี้ (เปลี่ยน path ตามจริง)
        >
          {/* Dark Overlay เพื่อให้ข้อความเด่นชัด */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#003c71]/95 to-[#001f3f]/90 z-0"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              {/* เพิ่มพื้นหลังขาวจางๆ ให้โลโก้ */}
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <img src="/src/assets/PSU.png" alt="PSU" className="h-10 drop-shadow-md" />
              </div>
              <div className="h-8 w-[1px] bg-white/30"></div>
              <span className="font-bold tracking-widest text-sm uppercase text-[#ffcd08] drop-shadow-sm">ระบบจัดการพัสดุ</span>
            </div>
            <h1 className="text-4xl font-bold mt-8 leading-tight drop-shadow-lg">
              ยินดีต้อนรับ <br /> กลับสู่ระบบ
            </h1>
            <p className="mt-4 text-blue-100 text-sm font-light leading-relaxed opacity-90 drop-shadow-md">
              ระบบบริหารจัดการพัสดุและครุภัณฑ์
            </p>
            <p className="mt-0.1 text-blue-100 text-sm font-light leading-relaxed opacity-90 drop-shadow-md">
              คณะวิทยาศาสตร์ มหาวิทยาลัยสงขลานครินทร์
            </p>
          </div>

          <div className="relative z-10 text-xs text-white/60 mt-8 lg:mt-0 drop-shadow-sm">
            &copy; 2025 PSU Inventory System.
          </div>

          {/* Decorative Circle inside card */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#ffcd08] rounded-full blur-3xl opacity-40 z-0"></div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-7/12 p-10 bg-white/5 relative">
          <h2 className="text-2xl font-bold text-white mb-6">เข้าสู่ระบบ</h2>

          <form onSubmit={handleLoginClick} className="space-y-6">

            {/* Username */}
            <div className="group">
              <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2 block group-focus-within:text-[#ffcd08] transition-colors">ชื่อผู้ใช้งาน</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-300 group-focus-within:text-[#ffcd08] transition-colors">
                  <FaUser />
                </div>
                <input
                  type="text"
                  className="block w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#ffcd08]/50 focus:border-transparent transition-all"
                  placeholder="รหัสนักศึกษา / PSU Passport"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2 block group-focus-within:text-[#ffcd08] transition-colors">รหัสผ่าน</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-300 group-focus-within:text-[#ffcd08] transition-colors">
                  <FaLock />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="block w-full pl-12 pr-12 py-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#ffcd08]/50 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                {/* 🔴 ปรับปรุงสีไอคอนดวงตาให้ชัดเจนขึ้น */}
                <div
                  className={`absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer transition-colors ${password ? 'text-[#ffcd08] hover:text-white' : 'text-white/30'}`}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full group relative flex justify-center py-4 px-4 border border-transparent rounded-xl text-sm font-bold text-[#003c71] bg-[#ffcd08] hover:bg-white hover:shadow-[0_0_20px_rgba(255,205,8,0.5)] transition-all duration-300 transform hover:-translate-y-1"
            >
              {loading ? (
                <span className="flex items-center gap-2">กำลังเชื่อมต่อ...</span>
              ) : (
                <span className="flex items-center gap-2">
                  เข้าใช้งานระบบ <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>

          </form>
        </div>
      </div>

      {/* --- Add CSS Animation Keyframes --- */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default Login