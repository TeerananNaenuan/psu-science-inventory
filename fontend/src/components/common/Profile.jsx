import axios from 'axios';
import { IKContext, IKUpload } from 'imagekitio-react';
import { useEffect, useState } from 'react';
import { FaCamera, FaSave, FaSpinner, FaTrash, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API;

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        username: '',
        fullname: '',
        department: '',
        email: '',
        phone: '',
        image: '' // เพิ่ม field image
    });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false); // เช็คสถานะการอัปโหลด

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                "ngrok-skip-browser-warning": "true"
            }
        };
    };

    // --- ImageKit Authenticator ---
    const authenticator = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API}/imagekit-auth`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
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

    const onUploadError = (err) => {
        console.log("Error", err);
        setUploading(false);
        alert("อัปโหลดรูปภาพล้มเหลว");
    };

    const onUploadSuccess = (res) => {
        setUploading(false);
        // อัปเดต State รูปภาพทันทีเพื่อให้แสดงผล
        setUser(prev => ({ ...prev, image: res.url }));
    };
    // -----------------------------

    // ดึงข้อมูล User
    useEffect(() => {
        const fetchUser = async () => {
            const userString = localStorage.getItem('user');
            if (userString) {
                const currentUser = JSON.parse(userString);
                const userId = currentUser._id || currentUser.id;

                try {
                    setLoading(true);
                    const res = await axios.get(`${API}/users/${userId}`, getAuthHeaders());
                    setUser(res.data);
                } catch (err) {
                    console.error("Error fetching user:", err);
                    if (err.response && err.response.status === 401) {
                        localStorage.clear();
                        navigate('/');
                    }
                } finally {
                    setLoading(false);
                }
            } else {
                navigate('/');
            }
        };
        fetchUser();
    }, [navigate]);

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    // ฟังก์ชัน Update
    const handleUpdate = async () => {
        try {
            const userId = user._id;

            const payload = {
                fullname: user.fullname,
                department: user.department,
                email: user.email,
                phone: user.phone,
                image: user.image // ส่งรูปล่าสุดไปด้วย
            };

            await axios.put(`${API}/users/${userId}`, payload, getAuthHeaders());

            alert("แก้ไขข้อมูลสำเร็จ!");
            // อัปเดต localStorage ด้วย
            const oldUser = JSON.parse(localStorage.getItem('user'));
            const newUser = { ...oldUser, ...payload };
            localStorage.setItem('user', JSON.stringify(newUser));

            // รีเฟรชหน้าเพื่อให้รูปบน Navbar เปลี่ยน (ถ้ามี)
            window.location.reload();

        } catch (err) {
            console.error(err);
            alert("เกิดข้อผิดพลาดในการอัปเดต: " + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async () => {
        if (window.confirm("คุณแน่ใจหรือไม่ที่จะลบบัญชีนี้? การกระทำนี้ไม่สามารถย้อนกลับได้")) {
            try {
                const userId = user._id;
                await axios.delete(`${API}/users/${userId}`, getAuthHeaders());
                alert("ลบบัญชีเรียบร้อยแล้ว");
                localStorage.clear();
                navigate('/');
                window.location.reload();
            } catch (err) {
                console.error(err);
                alert("เกิดข้อผิดพลาดในการลบ");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10 px-4"
            style={{ backgroundImage: "url('/src/assets/L1.jpg')", backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>

            {/* การ์ดหลัก ปรับให้กว้างขึ้นเพื่อรองรับ 2 คอลัมน์ */}
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row">

                {loading ? (
                    <div className="w-full flex flex-col items-center justify-center py-20 text-gray-500">
                        <FaSpinner className="animate-spin text-5xl mb-4 text-yellow-500" />
                        <p className="text-lg">กำลังโหลดข้อมูล...</p>
                    </div>
                ) : (
                    <>
                        {/* --- ฝั่งซ้าย: ส่วนรูปโปรไฟล์ --- */}
                        <div className="w-full md:w-1/3 bg-gradient-to-b from-yellow-400 to-yellow-500 p-8 flex flex-col items-center justify-center text-white relative">

                            {/* รูปโปรไฟล์ */}
                            <div className="relative group">
                                <div className="w-48 h-48 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                                    {user.image ? (
                                        <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <FaUserCircle className="w-40 h-40 text-gray-400" />
                                    )}

                                    {/* Loading Overlay */}
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                                            <FaSpinner className="animate-spin text-white text-3xl" />
                                        </div>
                                    )}
                                </div>

                                {/* ปุ่มกล้องถ่ายรูป */}
                                <div className="absolute bottom-2 right-4 z-20">
                                    <IKContext
                                        publicKey="public_DOSBbESKgnmdajaBQDblFLCEaUU="
                                        urlEndpoint="https://ik.imagekit.io/moxbp0hbo"
                                        authenticator={authenticator}
                                    >
                                        <label className="cursor-pointer bg-white text-yellow-600 hover:text-yellow-700 p-3 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 border-2 border-yellow-500">
                                            <FaCamera className="text-xl" />
                                            <IKUpload
                                                fileName="profile.jpg"
                                                onError={onUploadError}
                                                onSuccess={onUploadSuccess}
                                                onUploadStart={() => setUploading(true)}
                                                className="hidden"
                                            />
                                        </label>
                                    </IKContext>
                                </div>
                            </div>

                            <h2 className="mt-6 text-2xl font-bold text-center drop-shadow-md">{user.username}</h2>
                            <p className="opacity-90 text-center">{user.department || "ไม่ระบุสังกัด"}</p>
                        </div>

                        {/* --- ฝั่งขวา: แบบฟอร์มแก้ไขข้อมูล --- */}
                        <div className="w-full md:w-2/3 p-8 md:p-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">ข้อมูลส่วนตัว</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* ชื่อ-นามสกุล */}
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-gray-600 font-semibold mb-2">ชื่อ-นามสกุล</label>
                                    <input
                                        type="text"
                                        name="fullname"
                                        value={user.fullname || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors bg-gray-50 focus:bg-white"
                                        placeholder="กรอกชื่อ-นามสกุล"
                                    />
                                </div>

                                {/* สังกัด (แก้ไขได้ตาม Form เดิม) */}
                                <div>
                                    <label className="block text-gray-600 font-semibold mb-2">สังกัด/แผนก</label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={user.department || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors bg-gray-50 focus:bg-white"
                                    />
                                </div>

                                {/* เบอร์โทรศัพท์ */}
                                <div>
                                    <label className="block text-gray-600 font-semibold mb-2">เบอร์โทรศัพท์</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={user.phone || ''}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^\d*$/.test(val) && val.length <= 10) handleChange(e);
                                        }}
                                        maxLength={10}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors bg-gray-50 focus:bg-white"
                                        placeholder="0xxxxxxxxx"
                                    />
                                </div>

                                {/* อีเมล */}
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-gray-600 font-semibold mb-2">อีเมล</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={user.email || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors bg-gray-50 focus:bg-white"
                                    />
                                </div>
                            </div>

                            {/* ปุ่ม Action */}
                            <div className="mt-10 flex flex-col-reverse md:flex-row justify-end gap-4">
                                <button
                                    onClick={handleDelete}
                                    disabled={uploading}
                                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-red-500 hover:bg-red-50 font-bold transition-colors border border-transparent hover:border-red-200"
                                >
                                    <FaTrash /> ลบบัญชี
                                </button>

                                <button
                                    onClick={handleUpdate}
                                    disabled={uploading}
                                    className={`flex items-center justify-center gap-2 px-8 py-3 rounded-lg text-white font-bold shadow-lg transform transition-transform hover:-translate-y-0.5 ${uploading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
                                        }`}
                                >
                                    <FaSave /> บันทึกการแก้ไข
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Profile;