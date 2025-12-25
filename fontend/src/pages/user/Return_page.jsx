import { useState } from 'react';
import { FaBoxOpen, FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaHourglassHalf, FaUndo } from 'react-icons/fa';
import Popup_return from './popupborrow/popup_return';

function Return({ data, onReturnConfirm }) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleReturnClick = (item) => {
    setSelectedItem(item);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setSelectedItem(null);
  };

  const handlePopupConfirm = (urlFromPopup) => {
    const returnData = {
      ...selectedItem,
      image_retern: urlFromPopup
    };
    onReturnConfirm(returnData);
    handlePopupClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // Helper: Status Badge Design
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending_borrow':
        return (
          <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200">
            <FaHourglassHalf /> รออนุมัติ
          </span>
        );
      case 'borrow':
        return (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
            <FaCheckCircle /> กำลังใช้งาน
          </span>
        );
      case 'pending_return':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">
            <FaExclamationCircle /> รอตรวจสอบคืน
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="overflow-x-auto pb-20">

      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100 text-gray-700 uppercase font-bold tracking-wider text-base border-b border-gray-200">
          <tr>
            <th className="px-6 py-5 w-[5%] text-center rounded-tl-lg">#</th>
            <th className="px-6 py-5 w-[20%]">รายการพัสดุ</th>
            <th className="px-6 py-5 w-[20%] font-mono">รหัสพัสดุ</th>
            <th className="px-6 py-5 w-[10%] text-center">จำนวน</th>
            <th className="px-6 py-5 w-[20%] text-center">วันที่ยืม/ขอ</th>
            <th className="px-6 py-5 w-[15%] text-center">สถานะ</th>
            <th className="px-6 py-5 w-[20%] text-center rounded-tr-lg">จัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index} className="hover:bg-red-50/30 transition-colors text-base group">
                <td className="px-6 py-5 text-center text-gray-500 font-medium">{index + 1}</td>

                <td className="px-6 py-5 text-gray-800 font-bold">
                  <div className="flex items-center gap-3">
                    <FaBoxOpen className="text-red-400" />
                    {item.supply_item || item.item}
                  </div>
                </td>

                <td className="px-6 py-5 text-blue-600 font-mono font-medium text-sm">
                  {item.supply_number || item.code}
                </td>

                <td className="px-6 py-5 text-center">
                  <span className="bg-gray-100 text-gray-700 font-bold py-1 px-3 rounded-full text-sm">
                    {item.amount || item.quantity}
                  </span>
                </td>

                <td className="px-6 py-5 text-center">
                  <div className="flex flex-col items-center text-sm">
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <FaCalendarAlt className="text-gray-400" />
                      {formatDate(item.borrow_date)}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5 text-center">
                  {getStatusBadge(item.status)}
                </td>

                <td className="px-6 py-5 text-center">
                  {item.status === 'borrow' ? (
                    <button
                      className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg font-bold text-sm shadow-md transition-all transform active:scale-95 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:-translate-y-0.5"
                      onClick={() => handleReturnClick(item)}
                    >
                      <FaUndo /> แจ้งคืน
                    </button>
                  ) : (
                    <span className="text-gray-400 text-xs font-medium italic">
                      {item.status === 'pending_borrow' ? 'รออนุมัติ...' : 'รอตรวจสอบ...'}
                    </span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-6 py-20 text-center text-gray-400 text-lg" colSpan="7">
                <div className="flex flex-col items-center gap-3">
                  <FaUndo className="text-4xl opacity-20" />
                  <span>ไม่มีรายการที่ต้องดำเนินการ</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Popup_return
        isOpen={showPopup}
        onClose={handlePopupClose}
        onConfirm={handlePopupConfirm}
      />
    </div>
  );
}

export default Return;