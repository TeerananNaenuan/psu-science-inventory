import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaBoxOpen, FaBuilding, FaCalendarAlt, FaCheckCircle, FaImage, FaSpinner, FaUndoAlt, FaUser } from 'react-icons/fa';
import PopupReturnDetail from './poppurequest/popup_Request_refund';

const API = import.meta.env.VITE_API;

function Return_request() {
  const [returnRequests, setReturnRequests] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/borrows`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const pendingItems = res.data.filter(item => item.status === 'pending_return');
      setReturnRequests(pendingItems);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleDetailClick = (item) => {
    setSelectedRequest(item);
    setShowPopup(true);
  };

  const handleRefresh = () => {
    fetchRequests();
    setShowPopup(false);
    setSelectedRequest(null);
  }

  const handleImageClick = (url) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="w-full animate-fade-in-up">

      {/* Sub-Header & Stats */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4 px-1">
        <div className="flex items-center gap-3">
          <div className="bg-red-100 p-2 rounded-lg text-red-500">
            <FaUndoAlt className="text-lg" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-700 leading-tight">รายการแจ้งคืน</h2>
            <p className="text-xs text-gray-500">ตรวจสอบความถูกต้องของพัสดุและหลักฐาน</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-bold border border-red-200 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          รอตรวจสอบ: {returnRequests.length}
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <FaSpinner className="animate-spin text-4xl mb-3 text-red-500" />
            <p className="text-sm font-medium">กำลังโหลด...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 uppercase font-bold text-sm border-b border-gray-200">
                <tr>
                  <th className="px-4 py-4 text-center w-[5%]">#</th>
                  <th className="px-4 py-4 w-[20%]">ผู้ขอคืน / สังกัด</th>
                  <th className="px-4 py-4 w-[20%]">พัสดุ</th>
                  <th className="px-4 py-4 text-center w-[10%]">จำนวน</th>
                  <th className="px-4 py-4 text-center w-[15%]">หลักฐาน</th>
                  <th className="px-4 py-4 text-center w-[15%]">วันที่แจ้ง</th>
                  <th className="px-4 py-4 text-center w-[15%]">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {returnRequests.length > 0 ? (
                  returnRequests.map((item, index) => (
                    <tr key={item._id} className="hover:bg-red-50/40 transition-colors text-sm group">

                      <td className="px-4 py-4 text-center text-gray-500 font-medium">{index + 1}</td>

                      <td className="px-4 py-4">
                        <div className="font-bold text-gray-800 flex items-center gap-2"><FaUser className="text-gray-400 text-xs" /> {item.user_fullname}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-1"><FaBuilding className="text-gray-400 text-[10px]" /> {item.user_department}</div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-bold text-gray-800 flex items-center gap-2"><FaBoxOpen className="text-gray-400" /> {item.supply_item}</div>
                        <div className="text-xs text-blue-500 font-mono ml-6">{item.supply_number}</div>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span className="inline-block bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-md font-bold text-xs border border-gray-200">
                          {item.amount}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-center">
                        {(item.return_image || item.image_retern) ? (
                          <div
                            className="w-10 h-10 mx-auto rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:opacity-80 transition-transform hover:scale-110 shadow-sm relative group/img"
                            onClick={() => handleImageClick(item.return_image || item.image_retern)}
                          >
                            <img src={item.return_image || item.image_retern} className="w-full h-full object-cover" alt="proof" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                              <FaImage className="text-white text-xs" />
                            </div>
                          </div>
                        ) : <span className="text-gray-300">-</span>}
                      </td>

                      <td className="px-4 py-4 text-center text-gray-600">
                        <div className="flex items-center justify-center gap-1.5">
                          <FaCalendarAlt className="text-gray-400 text-xs" />
                          {item.due_date ? new Date(item.due_date).toLocaleDateString('th-TH') : '-'}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <button
                          className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg font-bold text-xs shadow-md transition-all transform active:scale-95 bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 hover:-translate-y-0.5"
                          onClick={() => handleDetailClick(item)}
                        >
                          <FaCheckCircle /> ตรวจสอบ
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <FaUndoAlt className="text-4xl opacity-10" />
                        <span className="text-sm">ไม่มีรายการแจ้งคืนในขณะนี้</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showPopup && selectedRequest && (
        <PopupReturnDetail
          item={selectedRequest}
          onClose={() => setShowPopup(false)}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
}

export default Return_request;