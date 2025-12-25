import { FaArrowRight, FaBoxOpen, FaClock, FaLaptop, FaSearch } from 'react-icons/fa';

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* --- 1. Hero Section (ส่วนหัวขนาดใหญ่) --- */}
      <div
        className="relative w-full h-[600px] bg-cover bg-center bg-fixed flex items-center"
        style={{ backgroundImage: "url('/src/assets/L1.jpg')" }} // รูปตึกคณะ
      >
        {/* Overlay สีน้ำเงิน PSU แบบไล่เฉด */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#003c71]/90 via-[#003c71]/70 to-transparent"></div>

        <div className="relative z-10 container mx-auto px-6 md:px-12">
          <div className="max-w-2xl text-white space-y-6 animate-fade-in-up">

            <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg">
              ระบบบริหารจัดการ <br />
              <span className="text-[#ffcd08]">พัสดุและครุภัณฑ์</span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100 font-light leading-relaxed">
              ยกระดับการจัดการทรัพย์สินของคณะวิทยาศาสตร์ มหาวิทยาลัยสงขลานครินทร์
            </p>

            {/* <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/login" className="px-8 py-3 bg-[#ffcd08] text-[#003c71] font-bold text-lg rounded-full hover:bg-white hover:shadow-xl transition-all transform hover:-translate-y-1 text-center flex items-center justify-center gap-2">
                เข้าสู่ระบบทันที <FaArrowRight />
              </Link>
              <button className="px-8 py-3 border-2 border-white text-white font-bold text-lg rounded-full hover:bg-white/10 transition-all text-center">
                คู่มือการใช้งาน
              </button>
            </div> */}
          </div>
        </div>

        {/* Decorative Wave (Optional CSS Shape) */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-[50px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-gray-50"></path>
          </svg>
        </div>
      </div>

      {/* --- 2. Features Section (จุดเด่นของระบบ) --- */}
      <div className="py-20 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#003c71] mb-4">ทำไมต้องใช้ระบบนี้?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">เปลี่ยนรูปแบบการทำงานจากเอกสารกระดาษสู่ระบบดิจิทัล เพื่อประสิทธิภาพที่ดียิ่งขึ้น</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-b-4 border-[#ffcd08] group">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#003c71] text-3xl mb-6 group-hover:bg-[#003c71] group-hover:text-white transition-colors">
              <FaClock />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">ยืม-คืน ได้ตลอด 24 ชม.</h3>
            <p className="text-gray-500 leading-relaxed">
              ทำรายการคำขอผ่านระบบออนไลน์ได้ทุกที่ ทุกเวลา ไม่ต้องรอเวลาทำการ ไม่ต้องเดินเอกสาร
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-b-4 border-[#003c71] group">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#003c71] text-3xl mb-6 group-hover:bg-[#003c71] group-hover:text-white transition-colors">
              <FaSearch />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">ตรวจสอบง่าย แม่นยำ</h3>
            <p className="text-gray-500 leading-relaxed">
              เช็คสถานะพัสดุคงเหลือ สถานะการอนุมัติ และประวัติการยืมย้อนหลังได้ทันทีแบบ Real-time
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-b-4 border-[#ffcd08] group">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#003c71] text-3xl mb-6 group-hover:bg-[#003c71] group-hover:text-white transition-colors">
              <FaLaptop />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">รองรับทุกอุปกรณ์</h3>
            <p className="text-gray-500 leading-relaxed">
              ใช้งานได้สะดวกทั้งบนคอมพิวเตอร์ แท็บเล็ต และสมาร์ทโฟน ด้วยดีไซน์ที่ทันสมัย
            </p>
          </div>
        </div>
      </div>

      {/* --- 3. Stats / Trust Section (ตัวเลขน่าสนใจ) --- */}
      {/* <div className="bg-[#003c71] py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
            <div>
              <div className="text-4xl font-bold text-[#ffcd08] mb-2">1,500+</div>
              <div className="text-blue-100 text-sm">รายการพัสดุ</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#ffcd08] mb-2">500+</div>
              <div className="text-blue-100 text-sm">ผู้ใช้งาน</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#ffcd08] mb-2">100%</div>
              <div className="text-blue-100 text-sm">ความปลอดภัย</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#ffcd08] mb-2">24/7</div>
              <div className="text-blue-100 text-sm">พร้อมใช้งาน</div>
            </div>
          </div>
        </div>
      </div> */}

      {/* --- 4. How it works (ขั้นตอนการใช้งาน) --- */}
      <div className="py-20 container mx-auto px-6 bg-white">
        <h2 className="text-3xl font-bold text-center text-[#003c71] mb-12">เริ่มต้นใช้งานง่ายๆ ใน 3 ขั้นตอน</h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 relative">

          {/* Step 1 */}
          <div className="w-full md:w-1/3 text-center px-4">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold text-[#003c71] border-4 border-[#ffcd08] shadow-sm mb-6">
              1
            </div>
            <h3 className="text-lg font-bold mb-2">เข้าสู่ระบบ (Login)</h3>
            <p className="text-gray-500 text-sm">ใช้รหัส PSU Passport ของท่านเพื่อยืนยันตัวตนเข้าสู่ระบบอย่างปลอดภัย</p>
          </div>

          {/* Arrow (Hidden on mobile) */}
          <div className="hidden md:block text-gray-300 text-2xl">
            <FaArrowRight />
          </div>

          {/* Step 2 */}
          <div className="w-full md:w-1/3 text-center px-4">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold text-[#003c71] border-4 border-[#ffcd08] shadow-sm mb-6">
              2
            </div>
            <h3 className="text-lg font-bold mb-2">เลือกพัสดุที่ต้องการ</h3>
            <p className="text-gray-500 text-sm">ค้นหาและเลือกรายการพัสดุ ระบุจำนวน และวันที่ต้องการใช้งาน</p>
          </div>

          {/* Arrow */}
          <div className="hidden md:block text-gray-300 text-2xl">
            <FaArrowRight />
          </div>

          {/* Step 3 */}
          <div className="w-full md:w-1/3 text-center px-4">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold text-[#003c71] border-4 border-[#ffcd08] shadow-sm mb-6">
              3
            </div>
            <h3 className="text-lg font-bold mb-2">รออนุมัติ & รับของ</h3>
            <p className="text-gray-500 text-sm">รอการอนุมัติจากเจ้าหน้าที่ และนำหลักฐานมารับของที่ห้องพัสดุได้เลย</p>
          </div>
        </div>
      </div>

      {/* --- 5. Footer --- */}
      <footer className="bg-gray-900 text-white py-8 border-t-4 border-[#ffcd08]">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <FaBoxOpen className="text-2xl text-[#ffcd08]" />
            </div>
            <div>
              <p className="font-bold text-lg">PSU Inventory</p>
              <p className="text-xs text-gray-400">ระบบจัดการพัสดุและครุภัณฑ์ คณะวิทยาศาสตร์</p>
            </div>
          </div>
          <div className="text-gray-400 text-sm text-center md:text-right">
            <p>&copy; 2025 Prince of Songkla University. All Rights Reserved.</p>
            <p className="text-xs mt-1">พัฒนาโดย ทีมงานนักศึกษา</p>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default Home;