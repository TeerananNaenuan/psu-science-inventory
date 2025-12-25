import { FaExclamationTriangle, FaTrashAlt } from 'react-icons/fa';

function PopupDelete({ user, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        
        {/* ส่วนเนื้อหา: ไอคอนและข้อความเตือน */}
        <div className="flex flex-col items-center pt-8 pb-6 px-6">
          
          {/* ไอคอนถังขยะในวงกลมสีแดงอ่อน */}
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-5">
            <FaTrashAlt className="text-3xl text-red-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">ยืนยันการลบ?</h2>
          
          <p className="text-gray-500 text-center text-sm mb-4">
            คุณกำลังจะลบข้อมูลผู้ใช้งานนี้ออกจากระบบ<br/>
            การกระทำนี้ไม่สามารถย้อนกลับได้
          </p>

          {/* ชื่อ User ที่จะลบ (ไฮไลท์ให้เด่น) */}
          <div className="bg-gray-100 px-6 py-2 rounded-full border border-gray-200 mb-2">
            <span className="text-lg font-bold text-gray-800">{user.username}</span>
          </div>

          <p className="text-xs text-red-400 mt-2 flex items-center gap-1 opacity-80">
            <FaExclamationTriangle /> ข้อมูลจะหายไปถาวร
          </p>
        </div>

        {/* ส่วนปุ่มกด (Footer) */}
        <div className="bg-gray-50 px-6 py-4 flex gap-3 border-t border-gray-100">
          <button
            onClick={onCancel}
            className="w-1/2 bg-white text-gray-700 font-bold py-2.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors shadow-sm"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className="w-1/2 bg-red-500 text-white font-bold py-2.5 rounded-lg hover:bg-red-600 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <FaTrashAlt className="text-sm" /> ลบข้อมูล
          </button>
        </div>

      </div>
    </div>
  );
}

export default PopupDelete;