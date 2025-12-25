import { IKContext, IKUpload } from 'imagekitio-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom'; // 1. Import createPortal
import { FaCamera, FaCheckCircle, FaCloudUploadAlt, FaTimes, FaUndoAlt } from 'react-icons/fa';

const API = import.meta.env.VITE_API;

function Popup_return({ isOpen, onClose, onConfirm }) {
    const [returnImage, setReturnImage] = useState("");
    const [uploading, setUploading] = useState(false);

    // Reset state เมื่อเปิด Popup
    useEffect(() => {
        if (isOpen) {
            setReturnImage("");
            setUploading(false);
        }
    }, [isOpen]);

    // ถ้าไม่เปิด ให้ return null
    if (!isOpen) return null;

    const authenticator = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API}/imagekit-auth`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true"
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
        setReturnImage(res.url);
    };

    const onUploadStart = () => {
        setUploading(true);
    };

    const handleConfirm = () => {
        if (returnImage) {
            onConfirm(returnImage);
        }
    };

    // 2. ใช้ createPortal ย้ายไป render ที่ body เพื่อแก้ปัญหา Popup ไม่ขึ้น
    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            
            {/* Overlay สีดำจางๆ */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            {/* ตัว Popup */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
                
                {/* Header Gradient */}
                <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-4 flex items-center gap-3 text-white shadow-md relative z-10">
                    <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                        <FaUndoAlt className="text-2xl" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-wide">ยืนยันการคืนพัสดุ</h2>
                        <p className="text-red-100 text-xs opacity-90">แนบหลักฐานการส่งคืน</p>
                    </div>
                    
                    {/* ปุ่มปิดมุมขวาบน */}
                    <button onClick={onClose} className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors">
                        <FaTimes />
                    </button>
                </div>

                <div className="p-6">
                    <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <FaCamera className="text-red-500" /> อัปโหลดรูปภาพยืนยัน
                    </label>

                    {/* Upload Area (Interactive) */}
                    <div className={`w-full h-64 relative group rounded-xl overflow-hidden border-2 border-dashed transition-all duration-300
                        ${returnImage ? 'border-green-500' : 'border-gray-300 hover:border-red-400 hover:bg-red-50/30'}
                    `}>
                        
                        {/* 1. กรณีมีรูปภาพแล้ว (Show Preview) */}
                        {returnImage ? (
                            <div className="relative w-full h-full">
                                <img
                                    src={returnImage}
                                    alt="Return Proof"
                                    className="w-full h-full object-cover"
                                />
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-white font-bold flex items-center gap-2">
                                        <FaCamera /> เปลี่ยนรูปภาพ
                                    </p>
                                </div>
                                {/* Badge Success */}
                                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow flex items-center gap-1">
                                    <FaCheckCircle /> อัปโหลดเสร็จสิ้น
                                </div>
                            </div>
                        ) : (
                            /* 2. กรณีไม่มีรูปภาพ (Show Placeholder) */
                            <div className={`w-full h-full flex flex-col items-center justify-center text-gray-400 ${uploading ? 'bg-gray-50' : ''}`}>
                                {uploading ? (
                                    <>
                                        <svg className="animate-spin h-10 w-10 text-red-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="text-red-500 font-medium animate-pulse">กำลังอัปโหลด...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaCloudUploadAlt className="text-6xl mb-2 opacity-40 text-red-300" />
                                        <span className="font-bold text-gray-500">แตะเพื่ออัปโหลดรูปภาพ</span>
                                        <span className="text-xs mt-1 text-gray-400">(JPG, PNG สูงสุด 5MB)</span>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Hidden Input สำหรับ ImageKit (คลิกได้ทั่วพื้นที่) */}
                        <div className="absolute inset-0 opacity-0 cursor-pointer z-20">
                            <IKContext
                                publicKey="public_DOSBbESKgnmdajaBQDblFLCEaUU="
                                urlEndpoint="https://ik.imagekit.io/moxbp0hbo"
                                authenticator={authenticator}
                            >
                                <IKUpload
                                    fileName="return-item.jpg"
                                    onError={onError}
                                    onSuccess={onSuccess}
                                    onUploadStart={onUploadStart}
                                    className="w-full h-full cursor-pointer"
                                />
                            </IKContext>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                        <button
                            onClick={onClose}
                            disabled={uploading}
                            className="px-5 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={!returnImage || uploading}
                            className={`px-6 py-2.5 rounded-xl text-white font-bold shadow-md transform transition-transform active:scale-95 flex items-center gap-2 ${
                                !returnImage || uploading
                                ? 'bg-gray-300 cursor-not-allowed shadow-none'
                                : 'bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700'
                            }`}
                        >
                            <FaCheckCircle /> ยืนยันการคืน
                        </button>
                    </div>

                </div>
            </div>
        </div>,
        document.body // 3. Render ที่ Body
    );
}

export default Popup_return;