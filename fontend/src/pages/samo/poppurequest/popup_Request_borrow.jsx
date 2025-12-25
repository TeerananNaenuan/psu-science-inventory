import axios from 'axios';
import { createPortal } from 'react-dom';
import { FaBoxOpen, FaBuilding, FaCalendarAlt, FaCheckCircle, FaClipboardList, FaTimes, FaTimesCircle, FaUser } from 'react-icons/fa';

const API = import.meta.env.VITE_API;

function PopupBorrowerDetail({ item, onClose, onSuccess }) {
  if (!item) return null;

  // ฟังก์ชันกดอนุมัติ
  const handleApprove = async () => {
    if (!window.confirm(`ยืนยันการอนุมัติให้ "${item.user_fullname}" ยืม "${item.supply_item}"?`)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/borrows/approve/${item._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("อนุมัติรายการสำเร็จ!");
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด: " + (err.response?.data || err.message));
    }
  };

  // ฟังก์ชันกดปฏิเสธ
  const handleReject = async () => {
    const reason = prompt("กรุณาระบุเหตุผลที่ไม่อนุมัติ:");
    if (reason === null) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/borrows/reject-borrow/${item._id}`,
        { reject_reason: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("ปฏิเสธคำขอเรียบร้อยแล้ว");
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด: " + (err.response?.data || err.message));
    }
  };

  // ใช้ createPortal
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">

      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Popup Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">

        {/* Header Gradient (Yellow-Orange for Loan Request) */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4 flex items-center gap-3 text-white shadow-md flex-shrink-0">
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
            <FaClipboardList className="text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-wide">รายละเอียดคำขอยืม</h2>
            <p className="text-yellow-50 text-xs opacity-90">ตรวจสอบข้อมูลก่อนทำการอนุมัติ</p>
          </div>
          <button onClick={onClose} className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors">
            <FaTimes />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-6 overflow-y-auto custom-scrollbar">

          {/* ข้อมูลผู้ยืม */}
          <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-100 flex items-start gap-4">
            <div className="bg-white p-3 rounded-full text-blue-500 shadow-sm">
              <FaUser />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-1">ข้อมูลผู้ยืม</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <p className="text-gray-500 text-xs">ชื่อ-สกุล</p>
                  <p className="font-bold text-gray-800">{item.user_fullname}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">สังกัด / แผนก</p>
                  <div className="flex items-center gap-1 font-medium text-gray-700">
                    <FaBuilding className="text-gray-400 text-xs" /> {item.user_department || '-'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ข้อมูลพัสดุ */}
          <div className="bg-yellow-50/50 rounded-xl p-4 mb-2 border border-yellow-100">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
              <FaBoxOpen className="text-yellow-600" /> รายละเอียดพัสดุ
            </h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div className="col-span-2 sm:col-span-1">
                <p className="text-gray-500 text-xs mb-0.5">ชื่อพัสดุ</p>
                <p className="font-bold text-gray-800 text-base">{item.supply_item}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-gray-500 text-xs mb-0.5">รหัสพัสดุ</p>
                <p className="font-mono text-blue-600 font-bold bg-white px-2 py-0.5 rounded border border-gray-200 inline-block">
                  {item.supply_number}
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-yellow-200 col-span-2 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs">จำนวนที่ขอ</p>
                  <p className="font-bold text-gray-900 text-xl">{item.amount} <span className="text-sm font-normal text-gray-500">ชิ้น</span></p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs flex items-center justify-end gap-1">
                    <FaCalendarAlt /> วันที่ต้องการคืน
                  </p>
                  <p className="font-bold text-red-600 text-lg">
                    {item.due_date ? new Date(item.due_date).toLocaleDateString('th-TH') : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={handleReject}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-red-600 bg-white border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all shadow-sm"
          >
            <FaTimesCircle /> ไม่อนุมัติ
          </button>
          <button
            onClick={handleApprove}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg transform active:scale-95 transition-all"
          >
            <FaCheckCircle /> อนุมัติให้ยืม
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default PopupBorrowerDetail;