import { IKContext, IKUpload } from 'imagekitio-react';
import { useState } from 'react';
import { createPortal } from 'react-dom'; // 1. Import
import { FaBoxOpen, FaCamera, FaEdit } from 'react-icons/fa';
import AutoWidthInput from "../../../components/common/AutoWidthInput";

const API = import.meta.env.VITE_API;

function PopupEdit({ formData, onChange, onCancel, onSubmit }) {
  const [uploading, setUploading] = useState(false);

  const authenticator = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/imagekit-auth`, {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" }
      });
      if (!response.ok) throw new Error(`Request failed`);
      const data = await response.json();
      return { signature: data.signature, expire: data.expire, token: data.token };
    } catch (error) { throw new Error(`Auth failed: ${error.message}`); }
  };

  const onError = (err) => { console.log(err); setUploading(false); alert("อัปโหลดรูปภาพล้มเหลว"); };
  const onSuccess = (res) => { setUploading(false); onChange({ target: { name: 'image', value: res.url } }); };
  const onUploadStart = () => { setUploading(true); };

  // 2. ใช้ createPortal Wrap ทั้งหมด
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onCancel}></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in-up">

        {/* Header Orange */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4 flex items-center gap-3 text-white shadow-md">
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
             <FaEdit className="text-2xl" />
          </div>
          <div>
             <h2 className="text-xl font-bold tracking-wide">แก้ไขข้อมูลพัสดุ</h2>
             <p className="text-yellow-50 text-xs opacity-90">ปรับปรุงรายละเอียดรายการพัสดุ</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col md:flex-row">
          
          {/* Left: Image */}
          <div className="w-full md:w-5/12 bg-gray-50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
             <label className="text-gray-700 font-bold mb-4 flex items-center gap-2 self-start">
                <FaCamera className="text-orange-500" /> รูปภาพพัสดุ
             </label>

             <div className={`w-full aspect-square relative group rounded-xl overflow-hidden border-2 border-dashed transition-all duration-300 ${
                formData.image ? 'border-orange-400 bg-white' : 'border-gray-300 bg-white hover:border-orange-300 hover:bg-orange-50'
             }`}>
                {formData.image ? (
                   <>
                      <img src={formData.image} alt="Preview" className="w-full h-full object-contain p-2" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <p className="text-white font-bold text-sm flex items-center gap-2"><FaCamera /> เปลี่ยนรูปภาพ</p>
                      </div>
                   </>
                ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      {uploading ? (
                         <div className="flex flex-col items-center animate-pulse text-orange-600">
                            <FaBoxOpen className="text-4xl mb-2 animate-bounce" />
                            <span className="text-sm font-bold">กำลังอัปโหลด...</span>
                         </div>
                      ) : (
                         <><FaBoxOpen className="text-6xl mb-3 opacity-30 text-orange-500" /><span className="font-bold text-gray-500">แตะเพื่ออัปโหลด</span></>
                      )}
                   </div>
                )}
                <div className="absolute inset-0 opacity-0 cursor-pointer">
                   <IKContext publicKey="public_DOSBbESKgnmdajaBQDblFLCEaUU=" urlEndpoint="https://ik.imagekit.io/moxbp0hbo" authenticator={authenticator}>
                      <IKUpload fileName="supply-item.jpg" onError={onError} onSuccess={onSuccess} onUploadStart={onUploadStart} className="w-full h-full cursor-pointer" />
                   </IKContext>
                </div>
             </div>
             <input type="hidden" name="image" value={formData.image} required />
          </div>

          {/* Right: Form */}
          <div className="w-full md:w-7/12 p-8 flex flex-col justify-between">
             <div className="space-y-5">
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">ชื่อพัสดุ<span className="text-red-500">*</span></label>
                   <AutoWidthInput type="text" name="item" value={formData.item} onChange={onChange} required className="w-full bg-white border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none transition-shadow text-gray-800 font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1"> หมวดหมู่</label>
                      <AutoWidthInput type="text" name="category" value={formData.category} onChange={onChange} required className="w-full bg-white border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none transition-shadow" />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-500 mb-1 flex items-center gap-1">รหัสพัสดุ (แก้ไขไม่ได้)<span className="text-red-500">*</span></label>
                      <AutoWidthInput type="text" name="supply_number" value={formData.supply_number} onChange={onChange} required disabled className="w-full bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg text-gray-500 font-mono text-sm cursor-not-allowed" />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">คงเหลือ<span className="text-red-500">*</span></label>
                      <input type="number" name="stock" min={0} value={formData.stock} onChange={onChange} required className="w-full bg-white border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none transition-shadow text-center font-bold text-gray-800" />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">หน่วย<span className="text-red-500">*</span></label>
                      <AutoWidthInput type="text" name="unit" value={formData.unit} onChange={onChange} required className="w-full bg-white border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none transition-shadow text-left" />
                   </div>
                </div>
             </div>

             <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                <button type="button" onClick={onCancel} disabled={uploading} className="px-6 py-2.5 rounded-lg text-gray-600 font-bold hover:bg-gray-100 transition-colors">ยกเลิก</button>
                <button type="submit" disabled={uploading} className={`px-8 py-2.5 rounded-lg text-white font-bold shadow-lg transform transition-transform hover:-translate-y-0.5 ${uploading ? 'bg-gray-400' : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'}`}>
                   {uploading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                </button>
             </div>
          </div>
        </form>
      </div>
    </div>,
    document.body // 3. Render ที่ Body
  );
}

export default PopupEdit;