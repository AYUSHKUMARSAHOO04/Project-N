// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Facebook, Github } from "lucide-react"

// export default function SignupForm() {
//   const [step, setStep] = useState(1)
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     dob: "",
//     password: "",
//     confirmPassword: "",
//   })

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleNext = (e: React.FormEvent) => {
//     e.preventDefault()
//     setStep(2)
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     // Handle form submission
//     console.log("Form submitted:", formData)
//     // Reset form or redirect
//   }

//   return (
//     <div className="space-y-6">
//       {step === 1 ? (
//         <form onSubmit={handleNext} className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="firstName">First Name</Label>
//               <Input
//                 id="firstName"
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 placeholder="John"
//                 required
//                 className="bg-gray-900/50 border-gray-700"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="lastName">Last Name</Label>
//               <Input
//                 id="lastName"
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 placeholder="Doe"
//                 required
//                 className="bg-gray-900/50 border-gray-700"
//               />
//             </div>
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="your.email@example.com"
//               required
//               className="bg-gray-900/50 border-gray-700"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="dob">Date of Birth</Label>
//             <Input
//               id="dob"
//               name="dob"
//               type="date"
//               value={formData.dob}
//               onChange={handleChange}
//               required
//               className="bg-gray-900/50 border-gray-700"
//             />
//           </div>
//           <Button
//             type="submit"
//             className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
//           >
//             Next
//           </Button>

//           <div className="relative flex items-center justify-center">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-700"></div>
//             </div>
//             <div className="relative px-4 bg-black dark:bg-black text-sm text-gray-400">Or sign up with</div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <Button variant="outline" className="border-gray-700">
//               <Facebook className="mr-2 h-4 w-4 text-blue-500" />
//               Facebook
//             </Button>
//             <Button variant="outline" className="border-gray-700">
//               <Github className="mr-2 h-4 w-4" />
//               Google
//             </Button>
//           </div>
//         </form>
//       ) : (
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="phone">Phone Number</Label>
//             <Input
//               id="phone"
//               name="phone"
//               type="tel"
//               value={formData.phone}
//               onChange={handleChange}
//               placeholder="+1 (555) 123-4567"
//               required
//               className="bg-gray-900/50 border-gray-700"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="password">Password</Label>
//             <Input
//               id="password"
//               name="password"
//               type="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="••••••••"
//               required
//               className="bg-gray-900/50 border-gray-700"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="confirmPassword">Confirm Password</Label>
//             <Input
//               id="confirmPassword"
//               name="confirmPassword"
//               type="password"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               placeholder="••••••••"
//               required
//               className="bg-gray-900/50 border-gray-700"
//             />
//           </div>
//           <div className="flex space-x-4">
//             <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 border-gray-700">
//               Back
//             </Button>
//             <Button
//               type="submit"
//               className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
//             >
//               Create Account
//             </Button>
//           </div>
//         </form>
//       )}
//     </div>
//   )
// }
import React from 'react'
// import {
//   ClerkProvider,
//   SignInButton,
//   SignUpButton,
//   SignedIn,
//   SignedOut,
//   UserButton,
// } from '@clerk/nextjs'

const SignupForm = () => {
  return (
    <div>
        {/* <SignedOut>
              <SignInButton />
              <SignUpButton />
        </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn> */}
    </div>
  )
}

export default SignupForm

