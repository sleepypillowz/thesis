import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-[100dvh] items-center">
      <div className="flex w-full justify-center">
        <div className="relative z-10">
          <div className="container py-10 lg:py-16">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-lg font-medium text-gray-500">
                Your Health, Our Priority
              </p>
              {/* Title */}
              <div className="mt-5 flex max-w-2xl justify-center">
                <h1 className="flex scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  Malibiran Medical Clinic
                </h1>
              </div>
              {/* End Title */}
              <div className="mt-5 max-w-3xl">
                <p className="text-xl text-gray-600">
                  Providing quality healthcare services with compassion and
                  expertise. Visit our clinic to experience personalized care
                  for all your medical needs.
                </p>
              </div>
              {/* Buttons */}
              <div className="mt-8 flex justify-center gap-3">
                <Link
                  className={buttonVariants({ variant: "default" })}
                  href="/patient"
                >
                  Patient
                </Link>
                <Link
                  className={buttonVariants({ variant: "secondary" })}
                  href="/admin"
                >
                  Admin
                </Link>
                <Link
                  className={buttonVariants({ variant: "secondary" })}
                  href="/user//login"
                >
                  Login
                </Link>
                <Link
                  className={buttonVariants({ variant: "secondary" })}
                  href="/user/register"
                >
                  Register
                </Link>
              </div>
              {/* End Buttons */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
// import { useState, useEffect } from "react";
// import { Plus, Phone, Calendar, MapPin, ChevronRight, Users, Shield, Clock } from "lucide-react";

// // Simulated button variant function since we can't import the actual one
// const buttonVariants = ({ variant }) => {
//   const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background px-4 py-2";
  
//   if (variant === "default") {
//     return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`;
//   } else if (variant === "secondary") {
//     return `${baseClasses} bg-gray-100 text-gray-900 hover:bg-gray-200`;
//   } else if (variant === "outline") {
//     return `${baseClasses} border border-gray-300 hover:bg-gray-100`;
//   }
//   return baseClasses;
// };

// // Custom Link component since we can't import Next.js Link
// const Link = ({ href, className, children }) => {
//   return (
//     <a href={href} className={className}>
//       {children}
//     </a>
//   );
// };

// export default function Home() {
//   const [isVisible, setIsVisible] = useState(false);
//   const [activeService, setActiveService] = useState(0);

//   useEffect(() => {
//     setIsVisible(true);
    
//     const interval = setInterval(() => {
//       setActiveService(prev => (prev + 1) % 3);
//     }, 5000);
    
//     return () => clearInterval(interval);
//   }, []);

//   const services = [
//     {
//       title: "Family Medicine",
//       description: "Comprehensive healthcare for patients of all ages, focusing on prevention and treatment of common illnesses.",
//       icon: <Users className="h-8 w-8 text-blue-500" />
//     },
//     {
//       title: "Preventive Care",
//       description: "Regular check-ups and screenings to maintain your health and detect issues before they become serious.",
//       icon: <Shield className="h-8 w-8 text-blue-500" />
//     },
//     {
//       title: "Urgent Care",
//       description: "Immediate treatment for non-life-threatening injuries and illnesses when you need it most.",
//       icon: <Clock className="h-8 w-8 text-blue-500" />
//     }
//   ];

//   return (
//     <main className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white">
//       {/* Navigation */}
//       <nav className="bg-white shadow-sm py-4 px-6">
//         <div className="container mx-auto flex justify-between items-center">
//           <div className="flex items-center">
//             <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-3">
//               M
//             </div>
//             <span className="font-bold text-xl text-gray-900">Malibiran Clinic</span>
//           </div>
//           <div className="hidden md:flex items-center space-x-6">
//             <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
//             <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Services</a>
//             <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Doctors</a>
//             <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
//             <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
//           </div>
//           <div className="hidden md:block">
//             <Link href="/user/login" className={buttonVariants({ variant: "default" })}>
//               Login
//             </Link>
//           </div>
//           <button className="md:hidden text-gray-600">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
//             </svg>
//           </button>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <div className={`flex-1 pt-16 pb-24 px-6 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
//         <div className="container mx-auto">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//             <div className="md:w-1/2 mb-12 md:mb-0">
//               <p className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-medium text-sm mb-6">
//                 Your Health, Our Priority
//               </p>
//               <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
//                 Malibiran <br />
//                 <span className="text-blue-600">Medical Clinic</span>
//               </h1>
//               <p className="text-lg text-gray-600 mb-8 max-w-lg">
//                 Providing quality healthcare services with compassion and expertise. Visit our clinic to experience personalized care for all your medical needs.
//               </p>
//               <div className="flex flex-wrap gap-4">
//                 <Link href="/appointment" className={buttonVariants({ variant: "default" }) + " group"}>
//                   <Calendar className="h-4 w-4 mr-2" />
//                   Book Appointment
//                   <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
//                 </Link>
//                 <Link href="/services" className={buttonVariants({ variant: "outline" })}>
//                   Our Services
//                 </Link>
//               </div>
              
//               <div className="mt-12 flex items-center">
//                 <div className="flex -space-x-2">
//                   {[1, 2, 3].map((i) => (
//                     <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
//                       <img src={`/api/placeholder/40/40`} alt="Patient" className="w-full h-full object-cover" />
//                     </div>
//                   ))}
//                 </div>
//                 <div className="ml-4">
//                   <div className="flex items-center">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
//                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                       </svg>
//                     ))}
//                   </div>
//                   <p className="text-sm text-gray-600">Trusted by 2,000+ patients</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="md:w-1/2 relative">
//               <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//                 <img src="/api/placeholder/600/400" alt="Medical Professional" className="w-full h-64 object-cover" />
//                 <div className="p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <div>
//                       <h3 className="font-bold text-lg">Medical Services</h3>
//                       <p className="text-gray-600 text-sm">Available 24/7</p>
//                     </div>
//                     <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Open Now</span>
//                   </div>
                  
//                   <div className="space-y-3">
//                     {services.map((service, index) => (
//                       <div 
//                         key={index} 
//                         className={`flex items-start p-3 rounded-lg transition-all duration-300 ${activeService === index ? 'bg-blue-50 shadow-sm' : 'hover:bg-gray-50'}`}
//                         onMouseEnter={() => setActiveService(index)}
//                       >
//                         <div className="shrink-0 mr-4">
//                           {service.icon}
//                         </div>
//                         <div>
//                           <h4 className="font-medium text-gray-900">{service.title}</h4>
//                           <p className="text-sm text-gray-600">{service.description}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
                  
//                   <div className="mt-6 pt-6 border-t border-gray-100">
//                     <div className="flex justify-between items-center">
//                       <Link href="/services" className="text-blue-600 font-medium flex items-center hover:text-blue-700 transition-colors">
//                         View all services
//                         <ChevronRight className="h-4 w-4 ml-1" />
//                       </Link>
//                       <Link href="/appointment" className={buttonVariants({ variant: "default" })}>
//                         Book Now
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-lg flex items-center md:hidden lg:flex">
//                 <div className="bg-blue-100 rounded-full p-2 mr-3">
//                   <Phone className="h-5 w-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500">Call us now</p>
//                   <p className="font-bold text-gray-900">+1 (555) 123-4567</p>
//                 </div>
//               </div>
              
//               <div className="absolute -top-4 -right-4 bg-white p-4 rounded-lg shadow-lg flex items-center md:hidden lg:flex">
//                 <div className="bg-blue-100 rounded-full p-2 mr-3">
//                   <MapPin className="h-5 w-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500">Our location</p>
//                   <p className="font-bold text-gray-900">123 Health St.</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Quick Access Links */}
//       <div className="bg-white py-8 border-t border-gray-100">
//         <div className="container mx-auto px-6">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             <Link 
//               href="/patient" 
//               className="flex flex-col items-center p-6 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors border border-gray-100 hover:border-blue-100"
//             >
//               <Users className="h-8 w-8 text-blue-600 mb-3" />
//               <span className="font-medium text-gray-900">Patient Portal</span>
//             </Link>
//             <Link 
//               href="/admin" 
//               className="flex flex-col items-center p-6 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors border border-gray-100 hover:border-blue-100"
//             >
//               <Shield className="h-8 w-8 text-blue-600 mb-3" />
//               <span className="font-medium text-gray-900">Admin Access</span>
//             </Link>
//             <Link 
//               href="/user/login" 
//               className="flex flex-col items-center p-6 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors border border-gray-100 hover:border-blue-100"
//             >
//               <svg className="h-8 w-8 text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
//               </svg>
//               <span className="font-medium text-gray-900">Login</span>
//             </Link>
//             <Link 
//               href="/user/register" 
//               className="flex flex-col items-center p-6 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors border border-gray-100 hover:border-blue-100"
//             >
//               <Plus className="h-8 w-8 text-blue-600 mb-3" />
//               <span className="font-medium text-gray-900">Register</span>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }