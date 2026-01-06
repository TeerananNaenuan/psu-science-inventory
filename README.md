# 📦 PSU Science Inventory System
> ระบบบริหารจัดการพัสดุและครุภัณฑ์ คณะวิทยาศาสตร์ มหาวิทยาลัยสงขลานครินทร์

![Project Status](https://img.shields.io/badge/Status-Active_Development-green?style=flat-square)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square)

## 📖 เกี่ยวกับโปรเจกต์ (About The Project)

**PSU Science Inventory System** คือเว็บแอปพลิเคชันที่พัฒนาขึ้นเพื่อยกระดับการบริหารจัดการทรัพย์สินภายในคณะวิทยาศาสตร์ ช่วยลดการใช้กระดาษ (Paperless) และเพิ่มความแม่นยำในการตรวจสอบสถานะพัสดุและครุภัณฑ์

ระบบมีการรองรับผู้ใช้งานทั้งหมด 4 บทบาทคือ **ผู้ใช้งานทั่วไป  สมาชิกชุมนม สมาชิกสโมสรนักศึกษา** และ **ผู้ดูแลระบบ** โดยเน้นการใช้งานที่ง่าย และรองรับการแสดงผลบนทุกอุปกรณ์

### ✨ ฟีเจอร์หลัก (Key Features)

* **🔐 Authentication System:** ระบบเข้าสู่ระบบที่ปลอดภัย (มีการ hash รหัสผ่านก่อนนำเข้าฐานข้อมูล)
* **📦 Supply Management:** ระบบจัดการสต็อกวัสดุสิ้นเปลือง (เบิก-จ่าย)
* **🖥️ Durable Articles:** ระบบทะเบียนครุภัณฑ์ พร้อมรูปภาพและประวัติการซ่อมบำรุง
* **🔄 Loan & Return System:**
    * ทำรายการขอยืมพัสดุออนไลน์
    * ระบบอนุมัติคำขอ (Approve/Reject)
    * แจ้งคืนพัสดุพร้อมแนบหลักฐานรูปภาพ

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

### Utilities & Tools
* **ImageKit.io:** สำหรับจัดการและฝากไฟล์รูปภาพ
* **Axios:** สำหรับเชื่อมต่อ API
* **React Icons:** ชุดไอคอนสำหรับ UI
* **Git & GitHub:** Version Control

---

## 🚀 การติดตั้งและรันโปรเจกต์ (Getting Started)

### สิ่งที่ต้องมี (Prerequisites)
* Node.js (v16 ขึ้นไป)
* MongoDB Database

### ขั้นตอนการติดตั้ง (Installation)

1.  **Clone the repo**
    ```sh
    git clone https://github.com/TeerananNaenuan/psu-science-inventory.git
    ```
2.  **Install NPM packages (สำหรับทั้ง Backend และ Frontend)**
    ```sh
    cd backend
    npm install
    
    cd ../fontend
    npm install
    ```
3.  **ตั้งค่า Environment Variables (.env)**
    สร้างไฟล์ `.env` ในโฟลเดอร์ backend และใส่ค่าดังนี้:
    ```js
    PORT=8888
    MONGO_URI=your_mongodb_connection_string
    IMAGEKIT_PUBLIC_KEY=your_public_key
    IMAGEKIT_PRIVATE_KEY=your_private_key
    IMAGEKIT_URL_ENDPOINT=your_url_endpoint
    ```
4.  **รันระบบ (Run the App)**
    * Backend: `npm start` หรือ `node index.js`
    * Frontend: `npm run dev`

---
