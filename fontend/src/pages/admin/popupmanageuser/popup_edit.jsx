import { IKContext, IKUpload } from 'imagekitio-react';
import { useState } from 'react';
import { FaCamera, FaUserCircle, FaUserEdit } from 'react-icons/fa';
import AutoWidthInput from "../../../components/common/AutoWidthInput";

const API = import.meta.env.VITE_API;

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
    alert("อัปโหลดรูปภาพล้มเหลว");
  };

  const onSuccess = (res) => {
    setUploading(false);
    onChange({
      target: { name: 'image', value: res.url }
    });
  };

  const onUploadStart = () => {
    setUploading(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm p-4"
      onClick={onCancel}
      >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        >

        {/* --- Header --- */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-5 flex items-center gap-4 text-white shadow-md">
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
            <FaUserEdit className="text-3xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-wide">แก้ไขข้อมูลผู้ใช้</h2>
            <p className="text-yellow-100 text-sm opacity-90">ปรับปรุงรายละเอียดบัญชีและสิทธิ์การใช้งาน</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-8">
          <div className="flex flex-col md:flex-row gap-8">

            {/* --- ฝั่งซ้าย: รูปโปรไฟล์ --- */}
            <div className="w-full md:w-1/3 flex flex-col items-center border-r border-gray-100 pr-4">
              <label className="text-gray-700 font-bold mb-4 self-start pl-2 border-l-4 border-yellow-500">รูปโปรไฟล์</label>

              <div className="relative group mt-2">
                {/* วงกลมแสดงรูป */}
                <div className="w-40 h-40 rounded-full border-4 border-yellow-100 overflow-hidden bg-gray-50 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                  {formData.image ? (
                    <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <FaUserCircle className="w-32 h-32 text-gray-300" />
                  )}

                  {/* Loading Overlay */}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>

                {/* ปุ่มกล้องถ่ายรูป */}
                <div className="absolute bottom-1 right-2 z-20">
                  <IKContext
                    publicKey="public_DOSBbESKgnmdajaBQDblFLCEaUU="
                    urlEndpoint="https://ik.imagekit.io/moxbp0hbo"
                    authenticator={authenticator}
                  >
                    <label className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white p-2.5 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 border-2 border-white">
                      <FaCamera className="text-sm" />
                      <IKUpload
                        fileName="user-profile.jpg"
                        onError={onError}
                        onSuccess={onSuccess}
                        onUploadStart={onUploadStart}
                        className="hidden"
                      />
                    </label>
                  </IKContext>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-4 text-center">
                คลิกที่กล้องเพื่อเปลี่ยนรูป
              </p>
              <input type="hidden" name="image" value={formData.image || ''} />
            </div>

            {/* --- ฝั่งขวา: ข้อมูลผู้ใช้ --- */}
            <div className="w-full md:w-2/3 flex flex-col gap-5">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">ชื่อผู้ใช้ (แก้ไขไม่ได้)<span className="text-red-500">*</span></label>
                  <AutoWidthInput
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={onChange}
                    disabled
                    className="w-full bg-gray-100 border border-gray-300 px-4 py-2.5 rounded-lg text-gray-500 cursor-not-allowed focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">รหัสผ่านใหม่</label>
                  <AutoWidthInput
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={onChange}
                    pattern=".{6,}"
                    title="อย่างน้อย 6 ตัวอักษร"
                    className="w-full bg-gray-50 border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-shadow"
                    placeholder="กรอกเมื่อต้องการเปลี่ยน"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">ชื่อ-นามสกุล<span className="text-red-500">*</span></label>
                <AutoWidthInput
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={onChange}
                  required
                  className="w-full bg-gray-50 border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-shadow"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">สังกัด/คณะ</label>
                  <AutoWidthInput
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={onChange}
                    className="w-full bg-gray-50 border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">สิทธิ์การใช้งาน</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={onChange}
                    className="w-full bg-gray-50 border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white transition-shadow"
                    required
                  >
                    <option value="user">ผู้ใช้งานทั่วไป</option>
                    <option value="samo">สโมสร</option>
                    <option value="rally">ชุมนุม</option>
                    <option value="admin">ผู้ดูแลระบบ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">อีเมล<span className="text-red-500">*</span></label>
                  <AutoWidthInput
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    required
                    className="w-full bg-gray-50 border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                  <AutoWidthInput
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={onChange}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    className="w-full bg-gray-50 border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-shadow"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* ปุ่ม Action */}
          <div className="flex justify-end gap-4 mt-8 pt-5 border-t border-gray-100">
            <button
              type="button"
              className="px-6 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-bold transition-colors"
              onClick={onCancel}
              disabled={uploading}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className={`px-8 py-2.5 rounded-lg text-white font-bold shadow-lg transform transition-transform hover:-translate-y-0.5 ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'}`}
              disabled={uploading}
            >
              {uploading ? 'กำลังโหลด...' : 'บันทึกการแก้ไข'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default PopupEdit;
