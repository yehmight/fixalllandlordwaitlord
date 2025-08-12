"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Read the API URL from env variable once
  const apiUrl = process.env.NEXT_PUBLIC_API_LOGIN;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_LOGIN environment variable is not set");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        router.push("/secured/ytrewq123456");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dmle9na5b/image/upload/v1754964109/admin_dgjeik.jpg')`,
      }}
    >
      <div className="max-w-md w-full bg-white bg-opacity-90 rounded-xl shadow-xl p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Admin Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 font-medium">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold rounded-md py-3 hover:bg-indigo-700 transition"
          >
            Log In
          </button>
        </form>
      </div>
    </main>
  );
}

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation"; // for Next.js app router

// export default function AdminLoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
  
//     if (!email || !password) {
//       setError("Please fill in all fields.");
//       return;
//     }
  
//     try {
//       const res = await fetch("http://localhost:4000/api/admin/login", { // ✅ match backend endpoint
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ email, password })
//       });
  
//       const data = await res.json();
  
//       if (data.token) {
//         // ✅ Save token for later requests
//         localStorage.setItem("token", data.token);
  
//         // ✅ Redirect to dashboard
//         router.push("/secured/ytrewq123456"); // ✅ match your dashboard route
//       } else {
//         setError(data.message || "Login failed");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Network error. Please try again.");
//     }
//   };
  

//   return (
//     <main
//       className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
//       style={{
//         backgroundImage: `url('https://res.cloudinary.com/dmle9na5b/image/upload/v1754964109/admin_dgjeik.jpg')`,
//       }}
//     >
//       <div className="max-w-md w-full bg-white bg-opacity-90 rounded-xl shadow-xl p-8">
//         <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
//           Admin Login
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Email address
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               placeholder="admin@example.com"
//               className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               placeholder="••••••••"
//               className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//             />
//           </div>

//           {error && (
//             <p className="text-sm text-red-600 font-medium">{error}</p>
//           )}

//           <button
//             type="submit"
//             className="w-full bg-indigo-600 text-white font-semibold rounded-md py-3 hover:bg-indigo-700 transition"
//           >
//             Log In
//           </button>
//         </form>
//       </div>
//     </main>
//   );
// }


// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation"; // for Next.js app router

// export default function AdminLoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (!email || !password) {
//       setError("Please fill in all fields.");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:4000/api/admin/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || "Login failed");
//         return;
//       }

//       // ✅ Save token in localStorage (or cookies)
//       localStorage.setItem("adminToken", data.token);

//       // ✅ Redirect to dashboard
//       router.push("/secured/ytrewq123456");
//     } catch {
//       setError("Network error. Please try again.");
//     }
//   };

//   return (
//     <main
//       className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
//       style={{
//         backgroundImage: `url('https://res.cloudinary.com/dmle9na5b/image/upload/v1754964109/admin_dgjeik.jpg')`,
//       }}
//     >
//       <div className="max-w-md w-full bg-white bg-opacity-90 rounded-xl shadow-xl p-8">
//         <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
//           Admin Login
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Email address
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               placeholder="admin@example.com"
//               className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               placeholder="••••••••"
//               className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//             />
//           </div>

//           {error && (
//             <p className="text-sm text-red-600 font-medium">{error}</p>
//           )}

//           <button
//             type="submit"
//             className="w-full bg-indigo-600 text-white font-semibold rounded-md py-3 hover:bg-indigo-700 transition"
//           >
//             Log In
//           </button>
//         </form>
//       </div>
//     </main>
//   );
// }




// "use client";

// import { useState } from "react";

// export default function AdminLoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (!email || !password) {
//       setError("Please fill in all fields.");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:4000/api/admin/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!res.ok) {
//         const data = await res.json();
//         setError(data.message || "Login failed");
//         return;
//       }

//       alert("Login successful!");
//     } catch {
//       setError("Network error. Please try again.");
//     }
//   };

//   return (
//     <main
//       className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
//       style={{
//         backgroundImage: `url('https://res.cloudinary.com/dmle9na5b/image/upload/v1754964109/admin_dgjeik.jpg')`,
//       }}
//     >
//       <div className="max-w-md w-full bg-white bg-opacity-90 rounded-xl shadow-xl p-8">
//         <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
//           Admin Login
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Email address
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               placeholder="admin@example.com"
//               className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               placeholder="••••••••"
//               className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//             />
//           </div>

//           {error && (
//             <p className="text-sm text-red-600 font-medium">{error}</p>
//           )}

//           <button
//             type="submit"
//             className="w-full bg-indigo-600 text-white font-semibold rounded-md py-3 hover:bg-indigo-700 transition"
//           >
//             Log In
//           </button>
//         </form>
//       </div>
//     </main>
//   );
// }


// "use client";

// import { useState } from "react";

// export default function AdminLoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (!email || !password) {
//       setError("Please fill in all fields.");
//       return;
//     }

//     try {
//       const res = await fetch("/api/admin/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!res.ok) {
//         const data = await res.json();
//         setError(data.message || "Login failed");
//         return;
//       }

//       alert("Login successful!");
//     } catch {
//       setError("Network error. Please try again.");
//     }
//   };

//   return (
//     <main
//       className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
//       style={{
//         backgroundImage: `url('')`,
//       }}
//     >
//       <div className="max-w-md w-full bg-white bg-opacity-90 rounded-xl shadow-xl p-8">
//         <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
//           Admin Login
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Email address
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               placeholder="admin@example.com"
//               className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               placeholder="••••••••"
//               className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//             />
//           </div>

//           {error && (
//             <p className="text-sm text-red-600 font-medium">{error}</p>
//           )}

//           <button
//             type="submit"
//             className="w-full bg-indigo-600 text-white font-semibold rounded-md py-3 hover:bg-indigo-700 transition"
//           >
//             Log In
//           </button>
//         </form>
//       </div>
//     </main>
//   );
// }

// "use client";

// import { useState } from "react";

// export default function AdminLoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (!email || !password) {
//       setError("Please fill in all fields.");
//       return;
//     }

//     // TODO: Replace with your real login API call
//     try {
//       // example fetch call here
//       const res = await fetch("/api/admin/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!res.ok) {
//         const data = await res.json();
//         setError(data.message || "Login failed");
//         return;
//       }

//       // on success: redirect or update UI
//       alert("Login successful!");
//     } catch {
//       setError("Network error. Please try again.");
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center px-4">
//       <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
//         <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
//           Admin Login
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Email address
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               placeholder="admin@example.com"
//               className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               placeholder="••••••••"
//               className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//             />
//           </div>

//           {error && (
//             <p className="text-sm text-red-600 font-medium">{error}</p>
//           )}

//           <button
//             type="submit"
//             className="w-full bg-indigo-600 text-white font-semibold rounded-md py-3 hover:bg-indigo-700 transition"
//           >
//             Log In
//           </button>
//         </form>
//       </div>
//     </main>
//   );
// }
