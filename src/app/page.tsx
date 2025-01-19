'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import Link from 'next/link'
import { ChevronRight, BarChart2, Clock, Users, FileText, ShieldCheck, Search, Menu } from 'lucide-react'
import { LoginDialog } from '@/components/LoginDialog'
import { SignUpDialog } from '@/components/SignupDialog'
import { motion } from 'framer-motion'
import { getUser } from '@/utils/auth'

type IconProps = React.ComponentProps<'svg'>;

export default function HomePage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const user = await getUser()
      if (user) {
        if (user.account_type === 'procurement') {
          router.push('/procurement/dashboard')
        } else if (user.account_type === 'admin') {
          router.push('/admin/dashboard')
        }
        else {
          router.push(`${user.account_type}/dashboard`)
        }  
      }
    }

    checkSession()
  }, [router])

  const showLogin = () => {
    setIsSignUpOpen(false);
    setIsLoginOpen(true);
  }

  const showSignUp = () => {
    setIsLoginOpen(false);
    setIsSignUpOpen(true);
  }

  return (
    <div className="min-h-screen bg-[#f8faf8] flex flex-col">
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pms-logo-WKQhYflzTjlSrGI3gkWDtII5c1jzeK.png" 
                alt="Procurement Monitoring System Logo" 
                className="h-12 w-auto sm:h-14" 
              />
              <h1 className="ml-2 sm:ml-3 text-xl sm:text-2xl font-bold text-[#2E8B57] truncate">
                <span className="hidden sm:inline">Procurement Monitoring System</span>
                <span className="sm:hidden">PMS</span>
              </h1>
            </div>
            
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-[#2E8B57]">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetTitle className="text-[#2E8B57]">Menu</SheetTitle>
                <nav className="flex flex-col space-y-4 mt-6">
                  <Link href="#features" className="text-[#2E8B57] hover:text-[#1a5235]">Features</Link>
                  <Link href="#about" className="text-[#2E8B57] hover:text-[#1a5235]">About</Link>
                  <Link href="#contact" className="text-[#2E8B57] hover:text-[#1a5235]">Contact</Link>
                  <hr className="my-4" />
                  <button onClick={() => setIsLoginOpen(true)} className="text-[#2E8B57] hover:text-[#1a5235]">Log In</button>
                  <button onClick={showSignUp} className="text-[#2E8B57] hover:text-[#1a5235]">Sign Up</button>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="#features" className="text-[#2E8B57] hover:text-[#1a5235] transition-colors">Features</Link>
              <Link href="#about" className="text-[#2E8B57] hover:text-[#1a5235] transition-colors">About</Link>
              <Link href="#contact" className="text-[#2E8B57] hover:text-[#1a5235] transition-colors">Contact</Link>
            </nav>
            
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" onClick={() => setIsLoginOpen(true)} 
                className="border-[#2E8B57] text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white">
                Log In
              </Button>
              <Button onClick={showSignUp} 
                className="bg-[#2E8B57] text-white hover:bg-[#1a5235]">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow mt-16">
        <section className="bg-[#2E8B57] text-white py-20 sm:py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNHMtNi4yNjggMTQtMTQgMTR6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-10" />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
          >
            <div className="text-center">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight"
              >
                Streamline Your Procurement <br className="hidden sm:inline" />
                Monitoring Process
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="mt-6 max-w-md mx-auto text-lg sm:text-xl md:text-2xl text-white/90"
              >
                The ultimate solution for efficient procurement tracking and management.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="mt-10 sm:mt-12 flex justify-center"
              >
                <Button 
                  size="lg" 
                  onClick={showSignUp} 
                  className="rounded-full bg-white hover:bg-white/90 text-[#2E8B57] font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="py-20 sm:py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-[#2E8B57] mb-12">
              Powerful Features for Procurement Excellence
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: BarChart2, title: "Real-time Analytics", description: "Get instant insights into your procurement processes with our advanced analytics dashboard." },
                { icon: Clock, title: "Efficient Workflows", description: "Streamline approvals and reduce bottlenecks with our intuitive workflow management system." },
                { icon: Users, title: "Multi-role Support", description: "Tailor access and permissions for various roles including end-users, admins, and directors." },
                { icon: FileText, title: "Document Management", description: "Centralize all your procurement documents for easy access and improved organization." },
                { icon: ShieldCheck, title: "Compliance Tracking", description: "Ensure adherence to regulations and internal policies with built-in compliance features." },
                { icon: Search, title: "Advanced Search", description: "Quickly find the information you need with our powerful search and filtering capabilities." },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 border-transparent hover:border-[#2E8B57]/20">
                    <CardHeader>
                      <feature.icon className="h-8 w-8 text-[#2E8B57] mb-2" />
                      <CardTitle className="text-[#2E8B57]">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-slate-600">
                      {feature.description}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="bg-[#f0f7f0] py-20 sm:py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNHMtNi4yNjggMTQtMTQgMTR6IiBmaWxsPSIjMkU4QjU3IiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-20" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="lg:text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2E8B57] mb-6">
                About Procurement Monitoring System
              </h2>
              <p className="mt-4 max-w-2xl text-lg sm:text-xl text-slate-600 lg:mx-auto">
                Our Procurement Monitoring System is designed to revolutionize the way organizations handle their procurement processes. 
                We combine cutting-edge technology with user-friendly interfaces to provide a comprehensive 
                solution for all your procurement monitoring needs.
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 sm:py-24 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-[#2E8B57] sm:text-4xl mb-6">
                Get in Touch
              </h2>
              <p className="mt-4 text-lg text-slate-600 mb-8">
                Have questions or ready to transform your procurement monitoring process? Contact us today!
              </p>
              <Button 
                size="lg" 
                asChild 
                className="bg-[#2E8B57] hover:bg-[#1a5235] text-white"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#1a5235] text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FFD700]">Solutions</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors">Procurement Management</a></li>
                <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors">Supplier Management</a></li>
                <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors">Contract Management</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FFD700]">Support</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors">API Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FFD700]">Company</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FFD700]">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-white/80 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-[#2E8B57] pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              {[
                { name: 'Facebook', icon: (props: IconProps) => (
                  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                ) },
                { name: 'Twitter', icon: (props: IconProps) => (
                  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                ) },
                { name: 'GitHub', icon: (props: IconProps) => (
                  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                ) },
              ].map((item) => (
                <a key={item.name} href="#" className="text-white/60 hover:text-white/90 transition-colors">
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
            <p className="mt-8 text-base text-white/60 md:mt-0 md:order-1">
              © 2025 Procurement Monitoring System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <LoginDialog isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onShowSignUp={showSignUp} />
      <SignUpDialog isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} onShowLogin={showLogin} />
    </div>
  )
}

