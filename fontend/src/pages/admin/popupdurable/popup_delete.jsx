import { FaBoxOpen, FaExclamationTriangle, FaTrashAlt } from 'react-icons/fa';

function PopupDelete({ durable, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm p-4"
      onClick={onCancel}
      >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 border border-gray-100"
        onClick={(e) => e.stopPropagation()
        >

        {/* ส่วนเนื้อหา */}
        <div className="flex flex-col items-center pt-10 pb-6 px-6 text-center">

          {/* ไอคอนถังขยะ */}
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <FaTrashAlt className="text-4xl text-red-500 drop-shadow-sm" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">ยืนยันการลบ?</h2>

          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            คุณกำลังจะลบรายการครุภัณฑ์นี้ออกจากระบบ<br />
            <span className="text-red-400 text-xs flex items-center justify-center gap-1 mt-1">
              <FaExclamationTriangle /> การกระทำนี้ไม่สามารถย้อนกลับได้
            </span>
          </p>

          {/* การ์ดแสดงข้อมูลที่จะลบ (เน้นให้ชัดเจน) */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 w-full mb-2 shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-1 text-gray-800">
              <FaBoxOpen className="text-blue-500" />
              <span className="font-bold text-lg line-clamp-1">{durable.item}</span>
            </div>
            <div className="inline-block bg-white px-3 py-1 rounded-md border border-gray-300 text-xs font-mono text-gray-500 tracking-wide">
              {durable.asset_number}
            </div>
          </div>
        </div>

        {/* ส่วนปุ่มกด (Footer) */}
        <div className="bg-gray-50 px-6 py-5 flex gap-4 border-t border-gray-100">
          <button
            onClick={onCancel}
            className="flex-1 bg-white text-gray-700 font-bold py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition-colors shadow-sm"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <FaTrashAlt className="text-sm" /> ลบครุภัณฑ์
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopupDelete;
