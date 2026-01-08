import { IKContext, IKUpload } from 'imagekitio-react';
import { useState } from 'react';
import { FaBoxOpen, FaCamera, FaEdit, FaTimes } from 'react-icons/fa';

const API = import.meta.env.VITE_API;
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;
const ENDPOINT = import.meta.env.VITE_ENDPOINT;

function PopupEdit({ formData, onChange, onCancel, onSubmit }) {
  const [uploading, setUploading] = useState(false);

  const authenticator = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/imagekit-auth`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      const { signature, expire, token: authToken } = data;
      return { signature, expire, token: authToken };

    } catch (error) {
      console.error("Authentication request failed:", error);
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  const onError = (err) => {
    console.log("Error", err);
    setUploading(false);
    alert("อัปโหลดรูปภาพล้มเหลว กรุณาลองใหม่");
  };

  const onSuccess = (res) => {
    setUploading(false);
    onChange({
      target: { name: 'image', value: res.url }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm p-4 overflow-y-auto md:overflow-visible"
      onClick={onCancel}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative overflow-hidden flex flex-col md:block"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-4 md:px-8 md:py-5 text-white relative shadow-md sticky top-0 z-20 md:static md:z-auto">
          <div className="flex items-center gap-3">
            <FaEdit className="text-2xl md:text-3xl" />
            <h2 className="text-xl md:text-2xl font-bold">แก้ไขข้อมูลครุภัณฑ์</h2>
          </div>
          <FaBoxOpen className="absolute right-12 top-1/2 -translate-y-1/2 text-white/10 text-5xl pointer-events-none md:right-16 md:text-6xl" />
          <button
            type="button"
            onClick={onCancel}
            disabled={uploading}
            className="absolute right-3 top-3 md:right-4 md:top-4 text-white/70 hover:text-white transition-colors z-10"
          >
            <FaTimes size={20} className="md:w-[17px] md:h-[17px]" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[80vh] md:max-h-none md:overflow-visible">
          <form onSubmit={onSubmit} className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 bg-gray-50 p-6 md:p-8 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-100">
              <label className="text-gray-700 font-bold mb-4 self-start text-sm md:text-base">รูปภาพครุภัณฑ์</label>

              <div className="w-48 h-48 md:w-full md:h-auto md:aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-white relative overflow-hidden group hover:border-yellow-400 transition-colors">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-400">
                    <FaCamera className="text-4xl md:text-5xl mx-auto mb-2 opacity-50" />
                    <span className="text-xs md:text-sm">ไม่มีรูปภาพ</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <IKContext
                    publicKey={PUBLIC_KEY}
                    urlEndpoint={ENDPOINT}
                    authenticator={authenticator}
                  >
                    <label className="cursor-pointer bg-white text-yellow-600 px-4 py-2 rounded-full font-bold shadow-lg hover:bg-yellow-50 transition-transform hover:scale-105 border border-yellow-200 text-sm md:text-base">
                      {uploading ? 'กำลัง...' : 'เปลี่ยนรูปภาพ'}
                      <IKUpload
                        fileName="durable-item.jpg"
                        onError={onError}
                        onSuccess={onSuccess}
                        onUploadStart={() => setUploading(true)}
                        className="hidden"
                      />
                    </label>
                  </IKContext>
                </div>

                {uploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-400 mt-3 text-center">
                คลิกที่รูปเพื่ออัปโหลดใหม่
              </p>
              <input type="hidden" name="image" value={formData.image} />
            </div>

            <div className="w-full md:w-2/3 p-5 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">ชื่อครุภัณฑ์ <span className="text-red-500">*</span></label>
                  <input
                    name="item"
                    value={formData.item}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-shadow"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">หมายเลขทะเบียน<span className="text-red-500">*</span></label>
                  <input
                    name="asset_number"
                    value={formData.asset_number}
                    onChange={onChange}
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed focus:outline-none font-mono"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">สังกัด/แผนก</label>
                  <input
                    name="department"
                    value={formData.department}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">จำนวน<span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-shadow text-center"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">ปีงบประมาณ<span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="budget_year"
                    min="2500"
                    max="2600"
                    value={formData.budget_year}
                    onChange={onChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none text-center transition-shadow"
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">สถานะ</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white transition-shadow"
                    required
                  >
                    <option value="พร้อมใช้งาน">พร้อมใช้งาน</option>
                    <option value="เสื่อมสภาพ">เสื่อมสภาพ</option>
                    <option value="ชำรุด">ชำรุด</option>
                    <option value="ส่งซ่อม">ส่งซ่อม</option>
                    <option value="สูญหาย">สูญหาย</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col-reverse md:flex-row justify-end gap-3 md:gap-4 mt-6 md:mt-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  className="w-full md:w-auto px-6 py-2.5 rounded-lg text-gray-600 font-bold hover:bg-gray-100 transition-colors"
                  onClick={onCancel}
                  disabled={uploading}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className={`w-full md:w-auto px-8 py-2.5 rounded-lg text-white font-bold shadow-md transform transition-transform hover:-translate-y-0.5 ${uploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                    }`}
                  disabled={uploading}
                >
                  {uploading ? 'กำลังโหลด...' : 'บันทึกการแก้ไข'}
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default PopupEdit;
