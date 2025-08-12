'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function RegisterPage() {
  // Removed submitted and setSubmitted
  // const [formData, setFormData] = useState({
  //   name: '',
  //   email: '',
  //   phone: '',
  //   role: '',
  //   properties: '',
  //   city: '',
  //   contactMethod: '',
  //   comments: '',
  // })

  // Removed handleChange and handleSubmit

  return (
    <main className="relative min-h-screen text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dmle9na5b/image/upload/v1754662099/photo-1529506711032-973f0b98912b_mbhca6.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-[#0F254F]/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between px-4 py-6">
        {/* Header */}
        <header className="w-full flex items-center justify-between px-6 py-4 bg-white/80 shadow-sm">
          <div>
            <Image
              src="https://res.cloudinary.com/dmle9na5b/image/upload/v1754661934/FIXALL_LANDLORD_LOGO_yyvtuy.png"
              alt="Company Logo"
              width={150}
              height={150}
            />
          </div>
          <nav className="space-x-6 text-gray-700 text-sm font-medium">
            <Link href="/register" className="hover:text-blue-500">Join Waitlist</Link>
          </nav>
        </header>

        <div className="relative min-h-screen bg-[#0F254F] text-white px-4 py-16 flex items-center justify-center">
          {/* Background Image Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage:
                "url('https://res.cloudinary.com/dmle9na5b/image/upload/v1754662099/photo-1529506711032-973f0b98912b_mbhca6.jpg')",
            }}
          >
            <div className="absolute inset-0 bg-[#0F254F]/90"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-3xl text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-6">About FixAll Landlord</h1>

            <p className="text-white text-base sm:text-lg">
              For this Nigeria, house agents dey give wahala ,dem go chop rent, hide bills, leave house to
              spoil, or give tenant wey no get sense. If you dey abroad, wahala go double because you no fit
              check wetin dey happen. But with FixAll Landlord, everything go change. This platform na
              FixAll Africa build am. We go: Help you list your house clean and straight Connect you with
              verified tenants Use 3D preview so tenant fit see house before rent Make sure you go dey
              collect your rent and bills directly ,no middleman Help you see your house anytime,
              from anywhere you dey And we go maintain the house using our trusted artisans across
              Nigeria This one no be normal agent setup o. FixAll Africa go stand in as your caretaker. We
              dey responsible for your house like say na our own. If you wan peace of mind and full control,
              join the waitlist today.
            </p> <br></br>
            <Link
              href="/register"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200"
            >
              Join Early Access Waitlist
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-[#0F254F] text-white py-4 text-center text-sm mt-6">
          &copy; 2025 Powered by{' '}
          <a href="https://fixallafrica.com" className="underline hover:text-blue-400">
            Fixall Africa
          </a>
          . All rights reserved.
        </footer>
      </div>
    </main>
  )
}




// 'use client';

// import { useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';


// export default function WaitlistLandingPage() {
//   const [showMore, setShowMore] = useState(false);

//   const fullText = `For this Nigeria, house agents dey give wahala — dem go chop rent, hide bills, leave house to spoil, or give tenant wey no get sense. If you dey abroad, wahala go double because you no fit check wetin dey happen. But with FixAll Landlord, everything go change. This platform na FixAll Africa build am. We go: Help you list your house clean and straight Connect you with verified tenants Use 3D preview so tenant fit see house before rent Make sure you go dey collect your rent and bills directly — no middleman Help you see your house anytime, from anywhere you dey And we go maintain the house using our trusted artisans across Nigeria This one no be normal agent setup o. FixAll Africa go stand in as your caretaker. We dey responsible for your house like say na our own. If you wan peace of mind and full control, join the waitlist today.`;

//   const shortText = `For this Nigeria, house agents dey give wahala — dem go chop rent, hide bills, leave house to spoil, or give tenant wey no get sense. If you dey abroad, wahala go double because you no fit check wetin dey happen. But with FixAll Landlord, everything go change...`;

//   return (
//     <div className="relative min-h-screen flex flex-col justify-between">
//       {/* Background Image */}
//       <div
//         className="absolute inset-0 bg-cover bg-center z-0"
//         style={{
//           backgroundImage:
//             "url('https://res.cloudinary.com/dmle9na5b/image/upload/v1754662099/photo-1529506711032-973f0b98912b_mbhca6.jpg')",
//         }}
//       >
//         <div className="absolute inset-0 bg-[#0F254F]/90"></div>
//       </div>

//       {/* Page Content */}
//       <div className="relative z-10 flex flex-col justify-between h-full">
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
//             <Link href="/about" className="hover:text-blue-500">
//               About
//             </Link>
//             <Link href="/register" className="hover:text-blue-500">
//               Contact
//             </Link>
//           </nav>
//         </header>

//         {/* Hero Section */}
//         <main className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 md:py-32 bg-white/90 rounded-lg shadow-lg mx-4 md:mx-20 mt-6">
//           {/* Left Text Content */}
//           <div className="text-center md:text-left md:w-1/2 space-y-6">
//             <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-[#0F254F] drop-shadow-md">
//               No More Agent Wahala. Na You Go Control Your House Anywhere You Dey.
//             </h1>

//             <p className="text-gray-700 text-base sm:text-lg max-w-md mx-auto md:mx-0">
//               {showMore ? fullText : shortText}
//             </p>

//             <button
//               onClick={() => setShowMore(!showMore)}
//               className="text-blue-600 hover:underline focus:outline-none"
//             >
//               {showMore ? 'Read Less' : 'Read More'}
//             </button>

//             {/* <Link
//               href="/register"
//               className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200"
//             >
//               Join Early Access Waitlist
//             </Link> */}
//           </div>

//           {/* Illustration */}
//           <div className="mt-10 md:mt-0 md:w-1/2 flex justify-center">
//             <Image
//               src="https://res.cloudinary.com/dmle9na5b/image/upload/v1754662099/photo-1529506711032-973f0b98912b_mbhca6.jpg"
//               alt="Illustration"
//               width={384}
//               height={384}
//               className="rounded-lg object-contain"
//             />
//           </div>
//         </main>
//         <div className="flex justify-center mt-6">
//   <Link
//     href="/register"
//     className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 text-sm sm:text-base"
//   >
//     Join Early Access Waitlist
//   </Link>
// </div>

//         {/* Footer */}
//         <footer className="bg-[#0F254F] text-white py-4 text-center text-sm mt-6">
//           &copy; 2025 Powered by{' '}
//           <a
//             href="https://fixallafrica.com"
//             className="underline hover:text-blue-400"
//           >
//             Fixall Africa
//           </a>
//           . All rights reserved.
//         </footer>
//       </div>
//     </div>
//   );
// }




// import Image from 'next/image';
// import Link from 'next/link';

// export default function WaitlistLandingPage() {
//   return (
//     <div className="relative min-h-screen flex flex-col justify-between">
//       {/* Background Image */}
//       <div
//         className="absolute inset-0 bg-cover bg-center z-0"
//         style={{ backgroundImage: "url('https://res.cloudinary.com/dmle9na5b/image/upload/v1754662099/photo-1529506711032-973f0b98912b_mbhca6.jpg')" }}
//       >
//         <div className="absolute inset-0 bg-[#0F254F]/90"></div>
//       </div>

//       {/* Page Content */}
//       <div className="relative z-10 flex flex-col justify-between h-full">
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
//             <Link href="/about" className="hover:text-blue-500">About</Link>
//             <Link href="/register" className="hover:text-blue-500">Contact</Link>
//           </nav>
//         </header>

//         {/* Hero Section */}
//         <main className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 md:py-32 bg-white/90 rounded-lg shadow-lg mx-4 md:mx-20 mt-6">
//           {/* Left Text Content */}
//           <div className="text-center md:text-left md:w-1/2 space-y-6">
//           <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-[#0F254F] drop-shadow-md">
//             No More Agent Wahala. Na You Go Control Your House Anywhere You Dey.
//           </h1>
//             <p className="text-gray-700 text-base sm:text-lg max-w-md mx-auto md:mx-0">
//               For this Nigeria, house agents dey give wahala — dem go chop rent, hide bills, leave house to
//               spoil, or give tenant wey no get sense. If you dey abroad, wahala go double because you no fit
//               check wetin dey happen. But with FixAll Landlord, everything go change...
//             </p>
//             <Link
//               href="/register"
//               className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200"
//             >
//               Join Early Access Waitlist
//             </Link>
//           </div>

//           {/* Illustration */}
//           <div className="mt-10 md:mt-0 md:w-1/2 flex justify-center">
//             <Image
//               src="https://res.cloudinary.com/dmle9na5b/image/upload/v1754662099/photo-1529506711032-973f0b98912b_mbhca6.jpg"
//               alt="Illustration"
//               width={384}
//               height={384}
//               className="rounded-lg object-contain"
//             />
//           </div>
//         </main>

//         {/* Footer */}
//         <footer className="bg-[#0F254F] text-white py-4 text-center text-sm mt-6">
//           &copy; 2025 Powered by{' '}
//           <a href="https://fixallafrica.com" className="underline hover:text-blue-400">
//             Fixall Africa
//           </a>
//           . All rights reserved.
//         </footer>
//       </div>
//     </div>
//   );
// }


