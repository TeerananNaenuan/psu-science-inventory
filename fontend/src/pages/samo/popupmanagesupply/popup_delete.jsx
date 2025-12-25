import { createPortal } from 'react-dom'; // 1. Import
import { FaBox, FaExclamationTriangle, FaTimes, FaTrashAlt } from 'react-icons/fa';

function PopupDelete({ supply, onCancel, onConfirm }) {
  // 2. ใช้ createPortal Wrap ทั้งหมด
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onCancel}></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        
        {/* Header Red */}
        <div className="bg-gradient-to-r from-red-600 to-red-400 px-6 py-4 flex items-center gap-3 text-white shadow-md relative">
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
             <FaTrashAlt className="text-xl" />
          </div>
          <div>
             <h2 className="text-xl font-bold tracking-wide">ยืนยันการลบ</h2>
             <p className="text-red-100 text-xs opacity-90">การกระทำนี้ไม่สามารถย้อนกลับได้</p>
          </div>
          <button onClick={onCancel} className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"><FaTimes /></button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
             <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4 animate-pulse">
                <FaExclamationTriangle className="text-3xl text-red-500" />
             </div>
             <h3 className="text-gray-800 font-bold text-lg">คุณแน่ใจหรือไม่?</h3>
             <p className="text-gray-500 text-sm mt-1">คุณกำลังจะลบรายการพัสดุนี้ออกจากระบบอย่างถาวร</p>
          </div>

          {/* Item Details */}
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-start gap-4">
             <div className="w-12 h-12 bg-white rounded-lg border border-red-200 flex items-center justify-center flex-shrink-0 text-red-400">
                {supply.image ? (
                   <img src={supply.image} alt={supply.item} className="w-full h-full object-cover rounded-lg" />
                ) : (
                   <FaBox className="text-xl" />
                )}
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-gray-900 font-bold text-base truncate">{supply.item}</p>
                <p className="text-gray-500 text-sm font-mono flex items-center gap-1">
                   รหัส: <span className="bg-white px-1.5 rounded border border-red-100 text-red-500 font-bold">{supply.supply_number}</span>
                </p>
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onCancel} className="px-5 py-2.5 rounded-lg text-gray-600 font-bold hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">ยกเลิก</button>
            <button onClick={onConfirm} className="px-6 py-2.5 rounded-lg text-white font-bold shadow-md transform transition-transform hover:-translate-y-0.5 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 flex items-center gap-2">
              <FaTrashAlt /> ยืนยันการลบ
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body // 3. Render ที่ Body
  );
}

export default PopupDelete;