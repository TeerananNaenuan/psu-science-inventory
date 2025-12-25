import { useState } from 'react';
import { FaBoxOpen, FaHandHoldingHeart, FaImage } from 'react-icons/fa';
import Popup_borrow from './popupborrow/popup_borrow';

function Borrow({ data, onBorrowConfirm }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // เมื่อกดปุ่ม "ยืม" ในตาราง
  const handleBorrowClick = (item) => {
    setSelectedItem(item);
    setIsPopupOpen(true);
  };

  // ปิด Popup
  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedItem(null);
  };

  // เมื่อกดยืนยันใน Popup -> ส่งข้อมูลกลับไปให้ User_Package
  const handleConfirm = (formData) => {
    const borrowedItem = {
      ...selectedItem,
      ...formData,
    };
    onBorrowConfirm(borrowedItem);
    closePopup();
  };

  const handleImageDetail = (item) => {
    if (item.image) {
      window.open(item.image, '_blank');
    }
  };

  return (
    <div className="overflow-x-auto pb-20">

      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100 text-gray-700 uppercase font-bold tracking-wider text-base border-b border-gray-200">
          <tr>
            <th className="px-6 py-5 w-[5%] text-center rounded-tl-lg">#</th>
            <th className="px-6 py-5 w-[15%]">หมวดหมู่</th>
            <th className="px-6 py-5 w-[20%]">รายการพัสดุ</th>
            <th className="px-6 py-5 w-[20%] font-mono">รหัสพัสดุ</th>
            <th className="px-6 py-5 w-[10%] text-center">รูปภาพ</th>
            <th className="px-6 py-5 w-[10%] text-center">คงเหลือ</th>
            <th className="px-6 py-5 w-[15%] text-center rounded-tr-lg">ดำเนินการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item._id || index} className="hover:bg-yellow-50/50 transition-colors text-base group">
                <td className="px-6 py-5 text-center text-gray-500 font-medium">{index + 1}</td>

                <td className="px-6 py-5 text-gray-600 font-medium">
                  <span className="bg-gray-100 text-gray-600 py-1 px-3 rounded-full text-sm">
                    {item.category}
                  </span>
                </td>

                <td className="px-6 py-5 text-gray-800 font-bold">
                  <div className="flex items-center gap-3">
                    <FaBoxOpen className="text-yellow-500" />
                    {item.item}
                  </div>
                </td>

                <td className="px-6 py-5 text-blue-600 font-mono font-medium text-sm">
                  {item.supply_number}
                </td>

                <td className="px-6 py-5 text-center">
                  {item.image ? (
                    <div
                      className="w-14 h-14 mx-auto rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:opacity-80 transition-all hover:scale-105 shadow-sm"
                      onClick={() => handleImageDetail(item)}
                      title="คลิกเพื่อดูรูปใหญ่"
                    >
                      <img src={item.image} alt={item.item} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 mx-auto rounded-lg bg-gray-100 flex items-center justify-center text-gray-300">
                      <FaImage />
                    </div>
                  )}
                </td>

                <td className="px-6 py-5 text-center">
                  <span className={`font-bold text-lg ${item.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {item.stock}
                  </span>
                </td>

                <td className="px-6 py-5 text-center">
                  <button
                    className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-bold text-sm shadow-md transition-all transform active:scale-95 ${item.stock > 0
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 hover:-translate-y-0.5'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    onClick={() => handleBorrowClick(item)}
                    disabled={item.stock <= 0}
                  >
                    {item.stock > 0 ? (
                      <><FaHandHoldingHeart className="text-lg" /> แจ้งยืม</>
                    ) : (
                      'ของหมด'
                    )}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-6 py-20 text-center text-gray-400 text-lg" colSpan="7">
                <div className="flex flex-col items-center gap-3">
                  <FaBoxOpen className="text-5xl opacity-30" />
                  <span>ไม่พบรายการพัสดุ</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Popup */}
      <Popup_borrow
        selectedItem={selectedItem}
        isOpen={isPopupOpen}
        onClose={closePopup}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

export default Borrow;