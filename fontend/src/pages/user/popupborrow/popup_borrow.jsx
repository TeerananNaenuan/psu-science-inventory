import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaBoxOpen, FaCalendarAlt, FaClipboardList, FaCubes, FaHashtag, FaLayerGroup } from 'react-icons/fa';

function Popup_borrow({ selectedItem, isOpen, onClose, onConfirm }) {
  const [quantity, setQuantity] = useState(1);
  const [returnDate, setReturnDate] = useState("");

  useEffect(() => {
    setQuantity(1);
    setReturnDate("");
  }, [selectedItem, isOpen]);

  // ถ้าไม่เปิด หรือไม่มีข้อมูล ให้ return null ไปเลย
  if (!isOpen || !selectedItem) return null;

  const handleConfirm = () => {
    onConfirm({
      quantity,
      returnDate,
      itemId: selectedItem._id,
      item: selectedItem.item || selectedItem.name,
      code: selectedItem.supply_number || selectedItem.code,
    });
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">

      {/* Overlay สีดำจางๆ (คลิกพื้นหลังเพื่อปิด) */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* ตัว Popup */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-5 py-3 flex items-center gap-3 text-white shadow-md relative z-10">
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
            <FaClipboardList className="text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-wide">ยืนยันการยืมพัสดุ</h2>
            <p className="text-yellow-50 text-[10px] opacity-90">ตรวจสอบรายการด้านล่าง</p>
          </div>
        </div>

        {/* Image Banner */}
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden relative border-b border-gray-200">
          {selectedItem.image ? (
            <img
              src={selectedItem.image}
              alt={selectedItem.item}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <FaBoxOpen className="text-5xl mb-2 opacity-40" />
              <span className="text-xs font-medium">ไม่มีรูปภาพ</span>
            </div>
          )}

          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-md flex items-center gap-1.5">
            <FaCubes className="text-yellow-400" />
            <span>คงเหลือ: <span className="font-bold text-yellow-300">{selectedItem.stock ?? selectedItem.available ?? '-'}</span></span>
          </div>
        </div>

        <div className="p-5">

          {/* ข้อมูลพัสดุ */}
          <div className="mb-5 space-y-2">
            <h3 className="font-bold text-gray-900 text-xl leading-tight truncate">{selectedItem.item || selectedItem.name}</h3>

            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                <FaHashtag className="text-gray-400" />
                <span className="font-mono font-medium">{selectedItem.supply_number || selectedItem.code}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                <FaLayerGroup className="text-gray-400" />
                <span>{selectedItem.category || 'ไม่ระบุ'}</span>
              </div>
            </div>
          </div>

          {/* ฟอร์มกรอกข้อมูล */}
          <div className="space-y-3 p-4 bg-yellow-50/50 rounded-xl border border-yellow-100">

            {/* จำนวน */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                <FaCubes className="text-yellow-600" /> จำนวนที่ยืม
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 focus:outline-none transition-all text-center font-bold text-xl text-gray-800 bg-white"
                  value={quantity}
                  min="1"
                  max={selectedItem.stock ?? selectedItem.available ?? 1}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>
            </div>

            {/* วันที่คืน */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                <FaCalendarAlt className="text-yellow-600" /> วันที่คืน
              </label>
              <input
                type="date"
                min={getCurrentDate()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 focus:outline-none transition-all text-center text-base text-gray-700 cursor-pointer bg-white font-medium"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-gray-600 font-bold hover:bg-gray-100 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleConfirm}
              disabled={!returnDate || quantity < 1}
              className={`px-6 py-2 rounded-lg text-sm text-white font-bold shadow-md transform transition-transform active:scale-95 ${!returnDate || quantity < 1
                ? 'bg-gray-300 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                }`}
            >
              ยืนยันการยืม
            </button>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}

export default Popup_borrow;