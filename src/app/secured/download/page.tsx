"use client";

import React from "react";

export default function OwnerDownloadPage() {
  // Read API URL from env, throw if missing
  const downloadUrl = process.env.NEXT_PUBLIC_API_DOWNLOAD;
  if (!downloadUrl) {
    throw new Error("NEXT_PUBLIC_API_DOWNLOAD environment variable is not set");
  }

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in.");
        return;
      }

      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "waitlist.csv";
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download CSV.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Owner Dashboard</h1>
        <p className="mb-4 text-gray-600">
          Click the button below to download the waitlist CSV.
        </p>
        <button
          onClick={handleDownload}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Download Waitlist CSV
        </button>
      </div>
    </main>
  );
}


// "use client";

// import React from "react";

// export default function OwnerDownloadPage() {
//   const handleDownload = async () => {
//     try {
//       const token = localStorage.getItem("token"); // Make sure you stored this at login
//       if (!token) {
//         alert("You are not logged in.");
//         return;
//       }

//       const response = await fetch("http://localhost:4000/api/admin/download", {
//         method: "GET",
//         headers: {
//           "Authorization": `Bearer ${token}`, // Change to x-api-key if that's what backend uses
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Error: ${response.status}`);
//       }

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);

//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "waitlist.csv";
//       document.body.appendChild(a);
//       a.click();

//       a.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Download failed:", error);
//       alert("Failed to download CSV.");
//     }
//   };

//   return (
//     <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
//       <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
//         <h1 className="text-2xl font-bold mb-4">Owner Dashboard</h1>
//         <p className="mb-4 text-gray-600">
//           Click the button below to download the waitlist CSV.
//         </p>
//         <button
//           onClick={handleDownload}
//           className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Download Waitlist CSV
//         </button>
//       </div>
//     </main>
//   );
// }
