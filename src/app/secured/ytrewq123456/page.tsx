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

// "use client";

// import { useLayoutEffect, useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";

// interface WaitlistUser {
//   _id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   role?: string;
//   properties?: string;
//   city?: string;
//   contactMethod?: string;
//   comments?: string;
//   createdAt: string;
// }

// export default function AdminDashboard() {
//   const [users, setUsers] = useState<WaitlistUser[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [authChecked, setAuthChecked] = useState(false);
//   const router = useRouter();
//   const logoutTimer = useRef<NodeJS.Timeout | null>(null);

//   const logout = () => {
//     localStorage.removeItem("token");
//     router.replace("/secured/administrative");
//   };

//   // Reset the inactivity timer
//   const resetTimer = () => {
//     if (logoutTimer.current) clearTimeout(logoutTimer.current);
//     logoutTimer.current = setTimeout(logout, 10 * 60 * 1000); // 10 min
//   };

//   useLayoutEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.replace("/secured/administrative");
//       return;
//     }

//     let cancelled = false;

//     const fetchUsers = async () => {
//       try {
//         const res = await fetch("http://localhost:4000/api/admin/users", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) throw new Error("Unauthorized");

//         const data = await res.json();
//         if (!cancelled) setUsers(data);
//       } catch (err) {
//         console.error("Error fetching users:", err);
//         router.replace("/secured/administrative");
//       } finally {
//         if (!cancelled) {
//           setLoading(false);
//           setAuthChecked(true);
//         }
//       }
//     };

//     fetchUsers();

//     return () => {
//       cancelled = true;
//     };
//   }, [router]);

//   useEffect(() => {
//     // Start inactivity tracking
//     const events = ["mousemove", "keydown", "click", "scroll"];
//     events.forEach((event) => window.addEventListener(event, resetTimer));
//     resetTimer(); // start timer

//     return () => {
//       events.forEach((event) => window.removeEventListener(event, resetTimer));
//       if (logoutTimer.current) clearTimeout(logoutTimer.current);
//     };
//   }, []);

//   const handleDownloadCSV = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.replace("/secured/administrative");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:4000/api/admin/download", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) {
//         throw new Error(`Failed to download CSV: ${res.status}`);
//       }

//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "waitlist.csv";
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error(err);
//       alert("Error downloading CSV");
//     }
//   };

//   if (!authChecked) {
//     return (
//       <main className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
//         <div className="flex flex-col items-center gap-4">
//           <svg
//             className="animate-spin h-8 w-8 text-white"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
//           </svg>
//           <div>Checking authentication...</div>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-gray-900 text-white p-8">
//       <div className="max-w-6xl mx-auto">
//         <header className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold">Fixall Landlord WaitList</h1>
//           <div className="flex gap-4">
//             <button
//               onClick={handleDownloadCSV}
//               className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow-lg"
//             >
//               Download CSV
//             </button>
//             <button
//               onClick={logout}
//               className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-lg"
//             >
//               Logout
//             </button>
//           </div>
//         </header>

//         {loading ? (
//           <p className="text-center text-gray-400">Loading data...</p>
//         ) : users.length === 0 ? (
//           <p className="text-center text-gray-400">No submissions found.</p>
//         ) : (
//           <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
//             <table className="w-full table-auto border-collapse">
//               <thead className="bg-gray-700 text-gray-200">
//                 <tr>
//                   <th className="p-3 text-left">Name</th>
//                   <th className="p-3 text-left">Email</th>
//                   <th className="p-3 text-left">Phone</th>
//                   <th className="p-3 text-left">Role</th>
//                   <th className="p-3 text-left">Properties</th>
//                   <th className="p-3 text-left">City</th>
//                   <th className="p-3 text-left">Contact Method</th>
//                   <th className="p-3 text-left">Comments</th>
//                   <th className="p-3 text-left">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((u) => (
//                   <tr key={u._id} className="border-b border-gray-700 hover:bg-gray-750">
//                     <td className="p-3">{u.name}</td>
//                     <td className="p-3">{u.email}</td>
//                     <td className="p-3">{u.phone || "-"}</td>
//                     <td className="p-3">{u.role || "-"}</td>
//                     <td className="p-3">{u.properties || "-"}</td>
//                     <td className="p-3">{u.city || "-"}</td>
//                     <td className="p-3">{u.contactMethod || "-"}</td>
//                     <td className="p-3">{u.comments || "-"}</td>
//                     <td className="p-3">{new Date(u.createdAt).toLocaleDateString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }



// "use client";

// import { useLayoutEffect, useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";

// interface WaitlistUser {
//   _id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   role?: string;
//   properties?: string;
//   city?: string;
//   contactMethod?: string;
//   comments?: string;
//   createdAt: string;
// }

// export default function AdminDashboard() {
//   const [users, setUsers] = useState<WaitlistUser[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [authChecked, setAuthChecked] = useState(false);
//   const router = useRouter();
//   const logoutTimer = useRef<NodeJS.Timeout | null>(null);

//   const logout = () => {
//     localStorage.removeItem("token");
//     router.replace("/secured/administrative");
//   };

//   // Reset the inactivity timer
//   const resetTimer = () => {
//     if (logoutTimer.current) clearTimeout(logoutTimer.current);
//     logoutTimer.current = setTimeout(logout, 10 * 60 * 1000); // 10 min
//   };

//   useLayoutEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.replace("/secured/administrative");
//       return;
//     }

//     let cancelled = false;

//     const fetchUsers = async () => {
//       try {
//         const res = await fetch("http://localhost:4000/api/admin/users", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) throw new Error("Unauthorized");

//         const data = await res.json();
//         if (!cancelled) setUsers(data);
//       } catch (err) {
//         console.error("Error fetching users:", err);
//         router.replace("/secured/administrative");
//       } finally {
//         if (!cancelled) {
//           setLoading(false);
//           setAuthChecked(true);
//         }
//       }
//     };

//     fetchUsers();

//     return () => {
//       cancelled = true;
//     };
//   }, [router]);

//   useEffect(() => {
//     // Start inactivity tracking
//     const events = ["mousemove", "keydown", "click", "scroll"];
//     events.forEach((event) => window.addEventListener(event, resetTimer));
//     resetTimer(); // start timer

//     return () => {
//       events.forEach((event) => window.removeEventListener(event, resetTimer));
//       if (logoutTimer.current) clearTimeout(logoutTimer.current);
//     };
//   }, []);

//   if (!authChecked) {
//     return (
//       <main className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
//         <div className="flex flex-col items-center gap-4">
//           <svg
//             className="animate-spin h-8 w-8 text-white"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
//           </svg>
//           <div>Checking authentication...</div>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-gray-900 text-white p-8">
//       <div className="max-w-6xl mx-auto">
//         <header className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold">Fixall Landlord WaitList</h1>
//           <div className="flex gap-4">
//             <button
//               onClick={() => {
//                 const token = localStorage.getItem("token");
//                 if (!token) {
//                   router.replace("/secured/administrative");
//                   return;
//                 }
//                 window.location.href = `http://localhost:4000/api/admin/download?token=${token}`;
//               }}
//               className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow-lg"
//             >
//               Download CSV
//             </button>
//             <button
//               onClick={logout}
//               className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-lg"
//             >
//               Logout
//             </button>
//           </div>
//         </header>

//         {loading ? (
//           <p className="text-center text-gray-400">Loading data...</p>
//         ) : users.length === 0 ? (
//           <p className="text-center text-gray-400">No submissions found.</p>
//         ) : (
//           <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
//             <table className="w-full table-auto border-collapse">
//               <thead className="bg-gray-700 text-gray-200">
//                 <tr>
//                   <th className="p-3 text-left">Name</th>
//                   <th className="p-3 text-left">Email</th>
//                   <th className="p-3 text-left">Phone</th>
//                   <th className="p-3 text-left">Role</th>
//                   <th className="p-3 text-left">Properties</th>
//                   <th className="p-3 text-left">City</th>
//                   <th className="p-3 text-left">Contact Method</th>
//                   <th className="p-3 text-left">Comments</th>
//                   <th className="p-3 text-left">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((u) => (
//                   <tr key={u._id} className="border-b border-gray-700 hover:bg-gray-750">
//                     <td className="p-3">{u.name}</td>
//                     <td className="p-3">{u.email}</td>
//                     <td className="p-3">{u.phone || "-"}</td>
//                     <td className="p-3">{u.role || "-"}</td>
//                     <td className="p-3">{u.properties || "-"}</td>
//                     <td className="p-3">{u.city || "-"}</td>
//                     <td className="p-3">{u.contactMethod || "-"}</td>
//                     <td className="p-3">{u.comments || "-"}</td>
//                     <td className="p-3">{new Date(u.createdAt).toLocaleDateString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }



// "use client";

// import { useLayoutEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// interface WaitlistUser {
//   _id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   role?: string;
//   properties?: string;
//   city?: string;
//   contactMethod?: string;
//   comments?: string;
//   createdAt: string;
// }

// export default function AdminDashboard() {
//   const [users, setUsers] = useState<WaitlistUser[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [authChecked, setAuthChecked] = useState(false);
//   const router = useRouter();

//   useLayoutEffect(() => {
//     // run synchronously before paint to avoid UI flash
//     const token = localStorage.getItem("token");

//     if (!token) {
//       // immediate replace (no history entry)
//       router.replace("/secured/administrative");
//       return;
//     }

//     let cancelled = false;

//     const fetchUsers = async () => {
//       try {
//         const res = await fetch("http://localhost:4000/api/admin/users", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) {
//           throw new Error("Unauthorized");
//         }

//         const data = await res.json();
//         if (!cancelled) setUsers(data);
//       } catch (err) {
//         console.error("Error fetching users:", err);
//         // ensure redirect happens without flashing dashboard
//         router.replace("/secured/administrative");
//       } finally {
//         if (!cancelled) {
//           setLoading(false);
//           setAuthChecked(true);
//         }
//       }
//     };

//     fetchUsers();

//     return () => {
//       cancelled = true;
//     };
//   }, [router]);

//   // while auth is being checked, render only a minimal loading screen
//   if (!authChecked) {
//     return (
//       <main className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
//         <div className="flex flex-col items-center gap-4">
//           <svg
//             className="animate-spin h-8 w-8 text-white"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
//           </svg>
//           <div>Checking authentication...</div>
//         </div>
//       </main>
//     );
//   }

//   // authenticated UI
//   return (
//     <main className="min-h-screen bg-gray-900 text-white p-8">
//       <div className="max-w-6xl mx-auto">
//         <header className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold">Fixall Landlord WaitList</h1>
//           <button
//             onClick={() => {
//               const token = localStorage.getItem("token");
//               if (!token) {
//                 router.replace("/secured/administrative");
//                 return;
//               }
//               window.location.href = `http://localhost:4000/api/admin/download?token=${token}`;
//             }}
//             className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow-lg"
//           >
//             Download CSV
//           </button>
//         </header>

//         {loading ? (
//           <p className="text-center text-gray-400">Loading data...</p>
//         ) : users.length === 0 ? (
//           <p className="text-center text-gray-400">No submissions found.</p>
//         ) : (
//           <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
//             <table className="w-full table-auto border-collapse">
//               <thead className="bg-gray-700 text-gray-200">
//                 <tr>
//                   <th className="p-3 text-left">Name</th>
//                   <th className="p-3 text-left">Email</th>
//                   <th className="p-3 text-left">Phone</th>
//                   <th className="p-3 text-left">Role</th>
//                   <th className="p-3 text-left">Properties</th>
//                   <th className="p-3 text-left">City</th>
//                   <th className="p-3 text-left">Contact Method</th>
//                   <th className="p-3 text-left">Comments</th>
//                   <th className="p-3 text-left">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((u) => (
//                   <tr key={u._id} className="border-b border-gray-700 hover:bg-gray-750">
//                     <td className="p-3">{u.name}</td>
//                     <td className="p-3">{u.email}</td>
//                     <td className="p-3">{u.phone || "-"}</td>
//                     <td className="p-3">{u.role || "-"}</td>
//                     <td className="p-3">{u.properties || "-"}</td>
//                     <td className="p-3">{u.city || "-"}</td>
//                     <td className="p-3">{u.contactMethod || "-"}</td>
//                     <td className="p-3">{u.comments || "-"}</td>
//                     <td className="p-3">{new Date(u.createdAt).toLocaleDateString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// interface WaitlistUser {
//   _id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   role?: string;
//   properties?: string;
//   city?: string;
//   contactMethod?: string;
//   comments?: string;
//   createdAt: string;
// }

// export default function AdminDashboard() {
//   const [users, setUsers] = useState<WaitlistUser[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [authChecked, setAuthChecked] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.replace("/secured/administrative"); // no flashback
//       return;
//     }

//     const fetchUsers = async () => {
//       try {
//         const res = await fetch("http://localhost:4000/api/admin/users", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) {
//           throw new Error("Unauthorized");
//         }

//         const data = await res.json();
//         setUsers(data);
//       } catch (err) {
//         console.error("Error fetching users:", err);
//         router.replace("/secured/administrative");
//       } finally {
//         setLoading(false);
//         setAuthChecked(true);
//       }
//     };

//     fetchUsers();
//   }, [router]);

//   const handleDownload = () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.replace("/secured/administrative");
//       return;
//     }
//     window.location.href = `http://localhost:4000/api/admin/download?token=${token}`;
//   };

//   if (!authChecked) {
//     return (
//       <main className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
//         Checking authentication...
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-gray-900 text-white p-8">
//       <div className="max-w-6xl mx-auto">
//         <header className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold">Fixall Landlord WaitList</h1>
//           <button
//             onClick={handleDownload}
//             className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow-lg"
//           >
//             Download CSV
//           </button>
//         </header>

//         {loading ? (
//           <p className="text-center text-gray-400">Loading data...</p>
//         ) : users.length === 0 ? (
//           <p className="text-center text-gray-400">No submissions found.</p>
//         ) : (
//           <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
//             <table className="w-full table-auto border-collapse">
//               <thead className="bg-gray-700 text-gray-200">
//                 <tr>
//                   <th className="p-3 text-left">Name</th>
//                   <th className="p-3 text-left">Email</th>
//                   <th className="p-3 text-left">Phone</th>
//                   <th className="p-3 text-left">Role</th>
//                   <th className="p-3 text-left">Properties</th>
//                   <th className="p-3 text-left">City</th>
//                   <th className="p-3 text-left">Contact Method</th>
//                   <th className="p-3 text-left">Comments</th>
//                   <th className="p-3 text-left">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((u) => (
//                   <tr key={u._id} className="border-b border-gray-700 hover:bg-gray-750">
//                     <td className="p-3">{u.name}</td>
//                     <td className="p-3">{u.email}</td>
//                     <td className="p-3">{u.phone || "-"}</td>
//                     <td className="p-3">{u.role || "-"}</td>
//                     <td className="p-3">{u.properties || "-"}</td>
//                     <td className="p-3">{u.city || "-"}</td>
//                     <td className="p-3">{u.contactMethod || "-"}</td>
//                     <td className="p-3">{u.comments || "-"}</td>
//                     <td className="p-3">{new Date(u.createdAt).toLocaleDateString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// interface WaitlistUser {
//   _id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   role?: string;
//   properties?: string;
//   city?: string;
//   contactMethod?: string;
//   comments?: string;
//   createdAt: string;
// }

// export default function AdminDashboard() {
//   const [users, setUsers] = useState<WaitlistUser[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   // Fetch all users from backend
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/secured/administrative"); // redirect if not logged in
//       return;
//     }

//     const fetchUsers = async () => {
//       try {
//         const res = await fetch("http://localhost:4000/api/admin/users", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) {
//           throw new Error("Unauthorized");
//         }

//         const data = await res.json();
//         setUsers(data);
//       } catch (err) {
//         console.error("Error fetching users:", err);
//         router.push("/secured/administrative");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUsers();
//   }, [router]);

//   // Handle CSV download
//   const handleDownload = () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/secured/administrative");
//       return;
//     }
//     window.location.href = `http://localhost:4000/api/admin/download?token=${token}`;
//   };

//   return (
//     <main className="min-h-screen bg-gray-900 text-white p-8">
//       <div className="max-w-6xl mx-auto">
//         <header className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold">Fixall Landlord WaitList</h1>
//           <button
//             onClick={handleDownload}
//             className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow-lg"
//           >
//             Download CSV
//           </button>
//         </header>

//         {loading ? (
//           <p className="text-center text-gray-400">Loading data...</p>
//         ) : users.length === 0 ? (
//           <p className="text-center text-gray-400">No submissions found.</p>
//         ) : (
//           <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
//             <table className="w-full table-auto border-collapse">
//               <thead className="bg-gray-700 text-gray-200">
//                 <tr>
//                   <th className="p-3 text-left">Name</th>
//                   <th className="p-3 text-left">Email</th>
//                   <th className="p-3 text-left">Phone</th>
//                   <th className="p-3 text-left">Role</th>
//                   <th className="p-3 text-left">Properties</th>
//                   <th className="p-3 text-left">City</th>
//                   <th className="p-3 text-left">Contact Method</th>
//                   <th className="p-3 text-left">Comments</th>
//                   <th className="p-3 text-left">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((u) => (
//                   <tr key={u._id} className="border-b border-gray-700 hover:bg-gray-750">
//                     <td className="p-3">{u.name}</td>
//                     <td className="p-3">{u.email}</td>
//                     <td className="p-3">{u.phone || "-"}</td>
//                     <td className="p-3">{u.role || "-"}</td>
//                     <td className="p-3">{u.properties || "-"}</td>
//                     <td className="p-3">{u.city || "-"}</td>
//                     <td className="p-3">{u.contactMethod || "-"}</td>
//                     <td className="p-3">{u.comments || "-"}</td>
//                     <td className="p-3">{new Date(u.createdAt).toLocaleDateString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// interface WaitlistUser {
//   _id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   role?: string;
//   properties?: string;
//   city?: string;
//   contactMethod?: string;
//   comments?: string;
//   createdAt: string;
// }

// export default function AdminDashboard() {
//   const [users, setUsers] = useState<WaitlistUser[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [authChecked, setAuthChecked] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.replace("/secured/administrative");
//       return;
//     }

//     const fetchUsers = async () => {
//       try {
//         const res = await fetch("http://localhost:4000/api/sers", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (res.status === 401) {
//           localStorage.removeItem("token");
//           router.replace("/secured/administrative");
//           return;
//         }

//         const data = await res.json();
//         setUsers(data);
//       } catch (err) {
//         console.error("Error fetching users:", err);
//       } finally {
//         setLoading(false);
//         setAuthChecked(true);
//       }
//     };

//     fetchUsers();
//   }, [router]);

//   // Prevent rendering before auth check
//   if (!authChecked) return null;

//   const handleDownload = () => {
//     const token = localStorage.getItem("token");
//     window.location.href = `http://localhost:4000/api/admin/download?token=${token}`;
//   };

//   return (
//     <main className="min-h-screen bg-gray-900 text-white p-8">
//       <div className="max-w-6xl mx-auto">
//         <header className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold">Fixall Landlord WaitList</h1>
//           <button
//             onClick={handleDownload}
//             className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow-lg"
//           >
//             Download CSV
//           </button>
//         </header>

//         {loading ? (
//           <p className="text-center text-gray-400">Loading data...</p>
//         ) : users.length === 0 ? (
//           <p className="text-center text-gray-400">No submissions found.</p>
//         ) : (
//           <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
//             <table className="w-full table-auto border-collapse">
//               <thead className="bg-gray-700 text-gray-200">
//                 <tr>
//                   <th className="p-3 text-left">Name</th>
//                   <th className="p-3 text-left">Email</th>
//                   <th className="p-3 text-left">Phone</th>
//                   <th className="p-3 text-left">Role</th>
//                   <th className="p-3 text-left">Properties</th>
//                   <th className="p-3 text-left">City</th>
//                   <th className="p-3 text-left">Contact Method</th>
//                   <th className="p-3 text-left">Comments</th>
//                   <th className="p-3 text-left">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((u) => (
//                   <tr key={u._id} className="border-b border-gray-700 hover:bg-gray-750">
//                     <td className="p-3">{u.name}</td>
//                     <td className="p-3">{u.email}</td>
//                     <td className="p-3">{u.phone || "-"}</td>
//                     <td className="p-3">{u.role || "-"}</td>
//                     <td className="p-3">{u.properties || "-"}</td>
//                     <td className="p-3">{u.city || "-"}</td>
//                     <td className="p-3">{u.contactMethod || "-"}</td>
//                     <td className="p-3">{u.comments || "-"}</td>
//                     <td className="p-3">{new Date(u.createdAt).toLocaleDateString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// interface WaitlistUser {
//   _id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   role?: string;
//   properties?: string;
//   city?: string;
//   contactMethod?: string;
//   comments?: string;
//   createdAt: string;
// }

// export default function AdminDashboard() {
//   const [users, setUsers] = useState<WaitlistUser[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   // ✅ Check authentication before fetching data
//   useEffect(() => {
//     const token = localStorage.getItem("token"); // Or get from cookies
//     if (!token) {
//       router.push("/"); // Redirect to login if no token
//       return;
//     }

//     const fetchUsers = async () => {
//       try {
//         const res = await fetch("http://localhost:4000/api/sers", {
//           headers: {
//             Authorization: `Bearer ${token}`, // Send token to backend
//           },
//         });

//         if (res.status === 401) {
//           // Unauthorized → force login
//           localStorage.removeItem("token");
//           router.push("/secured/administrative");
//           return;
//         }

//         const data = await res.json();
//         setUsers(data);
//       } catch (err) {
//         console.error("Error fetching users:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, [router]);

//   // ✅ CSV download with token
//   const handleDownload = () => {
//     const token = localStorage.getItem("token");
//     window.location.href = `http://localhost:4000/api/admin/download?token=${token}`;
//   };

//   return (
//     <main className="min-h-screen bg-gray-900 text-white p-8">
//       <div className="max-w-6xl mx-auto">
//         <header className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold">Fixall Landlord WaitList</h1>
//           <button
//             onClick={handleDownload}
//             className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow-lg"
//           >
//             Download CSV
//           </button>
//         </header>

//         {loading ? (
//           <p className="text-center text-gray-400">Loading data...</p>
//         ) : users.length === 0 ? (
//           <p className="text-center text-gray-400">No submissions found.</p>
//         ) : (
//           <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
//             <table className="w-full table-auto border-collapse">
//               <thead className="bg-gray-700 text-gray-200">
//                 <tr>
//                   <th className="p-3 text-left">Name</th>
//                   <th className="p-3 text-left">Email</th>
//                   <th className="p-3 text-left">Phone</th>
//                   <th className="p-3 text-left">Role</th>
//                   <th className="p-3 text-left">Properties</th>
//                   <th className="p-3 text-left">City</th>
//                   <th className="p-3 text-left">Contact Method</th>
//                   <th className="p-3 text-left">Comments</th>
//                   <th className="p-3 text-left">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((u) => (
//                   <tr key={u._id} className="border-b border-gray-700 hover:bg-gray-750">
//                     <td className="p-3">{u.name}</td>
//                     <td className="p-3">{u.email}</td>
//                     <td className="p-3">{u.phone || "-"}</td>
//                     <td className="p-3">{u.role || "-"}</td>
//                     <td className="p-3">{u.properties || "-"}</td>
//                     <td className="p-3">{u.city || "-"}</td>
//                     <td className="p-3">{u.contactMethod || "-"}</td>
//                     <td className="p-3">{u.comments || "-"}</td>
//                     <td className="p-3">{new Date(u.createdAt).toLocaleDateString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";

// interface WaitlistUser {
//   _id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   role?: string;
//   properties?: string;
//   city?: string;
//   contactMethod?: string;
//   comments?: string;
//   createdAt: string;
// }

// export default function AdminDashboard() {
//   const [users, setUsers] = useState<WaitlistUser[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch all users from backend
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await fetch("http://localhost:4000/api/admin/users");
//         const data = await res.json();
//         setUsers(data);
//       } catch (err) {
//         console.error("Error fetching users:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUsers();
//   }, []);

//   // Handle CSV download
//   const handleDownload = () => {
//     window.location.href = "http://localhost:4000/api/admin/download";
//   };

//   return (
//     <main className="min-h-screen bg-gray-900 text-white p-8">
//       <div className="max-w-6xl mx-auto">
//         <header className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold">Fixall Landlord WaitList </h1>
//           <button
//             onClick={handleDownload}
//             className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow-lg"
//           >
//             Download CSV
//           </button>
//         </header>

//         {loading ? (
//           <p className="text-center text-gray-400">Loading data...</p>
//         ) : users.length === 0 ? (
//           <p className="text-center text-gray-400">No submissions found.</p>
//         ) : (
//           <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
//             <table className="w-full table-auto border-collapse">
//               <thead className="bg-gray-700 text-gray-200">
//                 <tr>
//                   <th className="p-3 text-left">Name</th>
//                   <th className="p-3 text-left">Email</th>
//                   <th className="p-3 text-left">Phone</th>
//                   <th className="p-3 text-left">Role</th>
//                   <th className="p-3 text-left">Properties</th>
//                   <th className="p-3 text-left">City</th>
//                   <th className="p-3 text-left">Contact Method</th>
//                   <th className="p-3 text-left">Comments</th>
//                   <th className="p-3 text-left">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((u) => (
//                   <tr key={u._id} className="border-b border-gray-700 hover:bg-gray-750">
//                     <td className="p-3">{u.name}</td>
//                     <td className="p-3">{u.email}</td>
//                     <td className="p-3">{u.phone || "-"}</td>
//                     <td className="p-3">{u.role || "-"}</td>
//                     <td className="p-3">{u.properties || "-"}</td>
//                     <td className="p-3">{u.city || "-"}</td>
//                     <td className="p-3">{u.contactMethod || "-"}</td>
//                     <td className="p-3">{u.comments || "-"}</td>
//                     <td className="p-3">{new Date(u.createdAt).toLocaleDateString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }
