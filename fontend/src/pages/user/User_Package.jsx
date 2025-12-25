import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaBox, FaHistory, FaSearch, FaSpinner, FaUndo } from 'react-icons/fa'; // Import necessary icons
import Borrow from './Borrow_page';
import History from './history';
import Return from './Return_page';

const API = import.meta.env.VITE_API;

function User_Package() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("borrow");
  const [borrowData, setBorrowData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [activeBorrows, setActiveBorrows] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  useEffect(() => {
    const initData = async () => {
      const userString = localStorage.getItem('user');
      let userId = null;
      if (userString) {
        const user = JSON.parse(userString);
        setCurrentUser(user);
        userId = user._id || user.id;
      }

      await fetchSupplies();
      if (userId) {
        fetchHistory(userId);
        fetchActiveBorrows(userId);
      }
    };

    initData();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const userId = currentUser._id || currentUser.id;

    if (activeTab === 'borrow') {
      fetchSupplies();
    } else if (activeTab === 'history') {
      fetchHistory(userId);
    } else if (activeTab === 'return') {
      fetchActiveBorrows(userId);
    }
  }, [activeTab, currentUser]);


  // --- Data Fetching Functions (Unchanged Logic) ---

  const fetchSupplies = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/supplies`, config);
      setBorrowData(res.data);
    } catch (err) {
      console.error("Error fetching supplies:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (userId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/history/user/${userId}`, config);
      setHistoryData(res.data);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveBorrows = async (userId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/borrows/user/${userId}`, config);
      setActiveBorrows(res.data);
    } catch (err) {
      console.error("Error fetching active borrows:", err);
    } finally {
      setLoading(false);
    }
  };


  const handleBorrowRequest = async (borrowDataFromChild) => {
    if (!currentUser) {
      alert("กรุณาเข้าสู่ระบบก่อนทำรายการ");
      return;
    }
    const userId = currentUser._id || currentUser.id;
    const payload = {
      user_id: userId,
      supply_id: borrowDataFromChild.itemId || borrowDataFromChild._id,
      amount: borrowDataFromChild.quantity,
      due_date: borrowDataFromChild.returnDate
    };

    try {
      const res = await axios.post(`${API}/borrows`, payload, config);
      if (res.status === 201 || res.status === 200) {
        alert("ส่งคำขอยืมเรียบร้อย! กรุณารอเจ้าหน้าที่อนุมัติ");
        fetchSupplies();
        fetchActiveBorrows(userId);
        setActiveTab("return");
        fetchHistory(userId);
      }
    } catch (err) {
      console.error("Borrow Error:", err);
      alert(err.response?.data || "เกิดข้อผิดพลาดในการยืม");
    }
  };

  const handleReturnAction = async (itemToReturn) => {
    const borrowId = itemToReturn._id;
    if (!borrowId) {
      return alert("ไม่พบรหัสการยืม");
    }

    const payload = {
      image_retern: itemToReturn.image_retern,
      return_date: new Date().toISOString(),
    };

    try {
      const res = await axios.put(`${API}/borrows/request-return/${borrowId}`, payload, config);

      if (res.status === 200 || res.status === 201) {
        alert(`คืนพัสดุเรียบร้อยแล้ว!`);

        const userId = currentUser._id || currentUser.id;
        fetchActiveBorrows(userId);
        fetchSupplies();
      }
    } catch (err) {
      console.error("Return Error:", err);
      alert("เกิดข้อผิดพลาดในการคืน: " + (err.response?.data?.message || err.message));
    }
  };


  const getFilteredData = () => {
    if (activeTab === 'borrow') {
      return borrowData.filter((item) =>
        item.item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supply_number?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (activeTab === 'history') {
      return historyData.filter((item) =>
        (item.supply_item || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.action_date || "").includes(searchTerm) ||
        (item.supply_number || "").toLowerCase().includes(searchTerm.toLowerCase())

      );
    } else if (activeTab === 'return') {
      return activeBorrows.filter((item) => {
        const matchesSearch = (item.supply_item || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.supply_number || "").toLowerCase().includes(searchTerm.toLowerCase());

        const isActiveStatus = ['pending_borrow', 'borrow', 'pending_return'].includes(item.status);

        return matchesSearch && isActiveStatus;
      });
    }
    return [];
  };

  return (
    <div className="p-4 min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/src/assets/L1.jpg')" }}>
      {/* Container Card with Blur Effect */}
      <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50 min-h-[85vh]">

        {/* --- Header Section (Tabs + Search) --- */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 border-b border-gray-100 pb-6">

          {/* Segmented Control Tabs */}
          <div className="flex bg-gray-100 p-1.5 rounded-xl gap-1 w-full md:w-auto overflow-x-auto shadow-inner">
            <button
              onClick={() => setActiveTab("borrow")}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all text-sm whitespace-nowrap flex-1 md:flex-none ${activeTab === "borrow"
                  ? "bg-yellow-400 text-white shadow-md transform scale-100"
                  : "text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                }`}
            >
              <FaBox /> ยืมพัสดุ
            </button>
            <button
              onClick={() => setActiveTab("return")}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all text-sm whitespace-nowrap flex-1 md:flex-none ${activeTab === "return"
                  ? "bg-red-500 text-white shadow-md transform scale-100"
                  : "text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                }`}
            >
              <FaUndo /> คืนพัสดุ
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all text-sm whitespace-nowrap flex-1 md:flex-none ${activeTab === "history"
                  ? "bg-green-500 text-white shadow-md transform scale-100"
                  : "text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                }`}
            >
              <FaHistory /> ประวัติ
            </button>
          </div>

          {/* Modern Search Bar */}
          <div className="relative w-full md:w-80">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder={activeTab === 'history' ? "ค้นหาประวัติ..." : "ค้นหาพัสดุ..."}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all shadow-sm bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* --- Content Area --- */}
        <div className="mt-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-80 text-gray-400">
              <FaSpinner className="animate-spin text-5xl mb-4 text-yellow-500" />
              <p className="text-lg font-medium">กำลังโหลดข้อมูล...</p>
            </div>
          ) : (
            <div className="animate-fade-in">
              {activeTab === "borrow" && (
                <Borrow data={getFilteredData()} onBorrowConfirm={handleBorrowRequest} />
              )}
              {activeTab === "return" && (
                <Return data={getFilteredData()} onReturnConfirm={handleReturnAction} />
              )}
              {activeTab === "history" && (
                <History data={getFilteredData()} />
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default User_Package;