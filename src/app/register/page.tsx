"use client";

import { useLayoutEffect, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface WaitlistUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  properties?: string;
  city?: string;
  contactMethod?: string;
  comments?: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<WaitlistUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();
  const logoutTimer = useRef<NodeJS.Timeout | null>(null);

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/secured/administrative");
  };

  // Reset the inactivity timer
  const resetTimer = () => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    logoutTimer.current = setTimeout(logout, 10 * 60 * 1000); // 10 min
  };

  // Load env variables (throw early if missing)
  const apiUsersUrl = process.env.NEXT_PUBLIC_API_USERS;
  const apiDownloadUrl = process.env.NEXT_PUBLIC_API_DOWNLOAD;

  if (!apiUsersUrl) {
    throw new Error("NEXT_PUBLIC_API_USERS environment variable is not set");
  }
  if (!apiDownloadUrl) {
    throw new Error("NEXT_PUBLIC_API_DOWNLOAD environment variable is not set");
  }

  useLayoutEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/secured/administrative");
      return;
    }

    let cancelled = false;

    const fetchUsers = async () => {
      try {
        const res = await fetch(apiUsersUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        if (!cancelled) setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        router.replace("/secured/administrative");
      } finally {
        if (!cancelled) {
          setLoading(false);
          setAuthChecked(true);
        }
      }
    };

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, [router, apiUsersUrl]);

  useEffect(() => {
    // Start inactivity tracking
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer(); // start timer

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
    };
  }, []);

  const handleDownloadCSV = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/secured/administrative");
      return;
    }

    try {
      const res = await fetch(apiDownloadUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to download CSV: ${res.status}`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "waitlist.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error downloading CSV");
    }
  };

  if (!authChecked) {
    return (
      <main className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-8 w-8 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <div>Checking authentication...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Fixall Landlord WaitList</h1>
          <div className="flex gap-4">
            <button
              onClick={handleDownloadCSV}
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow-lg"
            >
              Download CSV
            </button>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-lg"
            >
              Logout
            </button>
          </div>
        </header>

        {loading ? (
          <p className="text-center text-gray-400">Loading data...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-400">No submissions found.</p>
        ) : (
          <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-700 text-gray-200">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Properties</th>
                  <th className="p-3 text-left">City</th>
                  <th className="p-3 text-left">Contact Method</th>
                  <th className="p-3 text-left">Comments</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.phone || "-"}</td>
                    <td className="p-3">{u.role || "-"}</td>
                    <td className="p-3">{u.properties || "-"}</td>
                    <td className="p-3">{u.city || "-"}</td>
                    <td className="p-3">{u.contactMethod || "-"}</td>
                    <td className="p-3">{u.comments || "-"}</td>
                    <td className="p-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}


// 'use client'

// import { useState } from 'react'
// import Image from 'next/image'
// import Link from 'next/link'
// import { Home } from 'lucide-react';

// export default function RegisterPage() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     role: '',
//     properties: '',
//     city: '',
//     contactMethod: '',
//     comments: '',
//   })

//   const [submitted, setSubmitted] = useState(false)

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const res = await fetch('http://localhost:4000/api/waitlist/submit', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(formData),
//     })
//     if (res.ok) {
//       setSubmitted(true)
//     } else {
//       alert('Something went wrong. Try again.')
//     }
//   }

//   return (
//     <main className="relative min-h-screen text-white">
//       {/* Background Image */}
//       <div
//         className="absolute inset-0 bg-cover bg-center z-0"
//         style={{
//           backgroundImage:
//             "url('https://res.cloudinary.com/dmle9na5b/image/upload/v1754662099/photo-1529506711032-973f0b98912b_mbhca6.jpg')",
//         }}
//       >
//         <div className="absolute inset-0 bg-[#0F254F]/90" />
//       </div>

//       {/* Content */}
//       <div className="relative z-10 min-h-screen flex flex-col justify-between px-4 py-6">
        

//         {/* Header */}
//         <header className="w-full flex items-center justify-between px-6 py-4 bg-white/80 shadow-sm">
//           <div>
//             <Image
//               src="https://res.cloudinary.com/dmle9na5b/image/upload/v1754661934/FIXALL_LANDLORD_LOGO_yyvtuy.png"
//               alt="Company Logo"
//               width={150}
//               height={150}
//             />
//           </div>
//           <nav className="space-x-6 text-gray-700 text-sm font-medium">
//             <Link href="/" className="hover:text-blue-500">Home</Link>
            
//           </nav>
//         </header>

//         {/* Form Section */}
//         <section className="flex-1 flex mt-4 flex-col justify-center items-center">
//           <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg w-full max-w-2xl shadow-lg">
//           <h2 className="text-3xl font-bold text-center mb-8 text-blue-600 flex justify-center items-center gap-2">
//             <Home className="w-7 h-7 text-blue-600" />
//             Join the Waitlist
//             </h2>

//             {!submitted ? (
//               <form onSubmit={handleSubmit} className="space-y-4 text-white">
//                 <input name="name" required onChange={handleChange} placeholder="Full Name" className="w-full p-3 border rounded bg-transparent border-white placeholder-white" />
//                 <input name="email" required type="email" onChange={handleChange} placeholder="Email" className="w-full p-3 border rounded bg-transparent border-white placeholder-white" />
//                 <input name="phone" required onChange={handleChange} placeholder="Phone Number" className="w-full p-3 border rounded bg-transparent border-white placeholder-white" />
                
//                 <select name="role" required onChange={handleChange} className="w-full p-3 border rounded bg-transparent border-white text-white">
//                   <option value="">Are you a landlord or property manager?</option>
//                   <option value="Landlord">Landlord</option>
//                   <option value="Property Manager">Property Manager</option>
//                 </select>

//                 <input name="properties" required onChange={handleChange} placeholder="How many properties do you manage?" className="w-full p-3 border rounded bg-transparent border-white placeholder-white" />
//                 <input name="city" required onChange={handleChange} placeholder="City / Location" className="w-full p-3 border rounded bg-transparent border-white placeholder-white" />
                
//                 <select name="contactMethod" required onChange={handleChange} className="w-full p-3 border rounded bg-transparent border-white text-white">
//                   <option value="">Preferred Contact Method</option>
//                   <option value="Email">Email</option>
//                   <option value="WhatsApp">WhatsApp</option>
//                 </select>

//                 <textarea name="comments" onChange={handleChange} placeholder="Any comments or special request (optional)" className="w-full p-3 border rounded bg-transparent border-white placeholder-white" />

//                 <button type="submit" className="bg-[#3B82F6] text-white px-6 py-3 rounded hover:bg-blue-700 w-full">
//                   Submit
//                 </button>
//               </form>
//             ) : (
//               <div className="text-center text-green-300 text-lg mt-10">
//                 ✅ Thank you for joining! you will receive an email confirmation shortly.
//               </div>
//             )}
//           </div>
//         </section>

//          {/* Footer */}
//          <footer className="bg-[#0F254F] text-white py-4 text-center text-sm mt-6">
//           &copy; 2025 Powered by{' '}
//           <a href="https://fixallafrica.com" className="underline hover:text-blue-400">
//             Fixall Africa
//           </a>
//           . All rights reserved.
//         </footer>
//       </div>
//     </main>
//   )
// }
