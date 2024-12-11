'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaUsers, FaMoneyBillWave, FaChartBar, FaHome, FaSignOutAlt } from 'react-icons/fa'
import { supabase } from '@/lib/supabase'
import Logo from './Logo'

const NavItem = ({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <li>
    <Link href={href} className="flex items-center space-x-2 text-yerba hover:text-madera transition-colors duration-200">
      {icon}
      <span>{children}</span>
    </Link>
  </li>
)

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
    }
    checkAuth()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center space-x-2">
              <Logo />
              <span className="font-handwriting text-2xl text-yerba">MateCuentas</span>
            </Link>
          </div>
          {isAuthenticated && (
            <div className="flex items-center">
              <ul className="flex space-x-4">
                <NavItem href="/" icon={<FaHome className="w-5 h-5" />}>
                  Inicio
                </NavItem>
                <NavItem href="/groups" icon={<FaUsers className="w-5 h-5" />}>
                  Grupos
                </NavItem>
                <NavItem href="/expenses" icon={<FaMoneyBillWave className="w-5 h-5" />}>
                  Gastos
                </NavItem>
                <NavItem href="/reports" icon={<FaChartBar className="w-5 h-5" />}>
                  Reportes
                </NavItem>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-yerba hover:text-madera transition-colors duration-200"
                  >
                    <FaSignOutAlt className="w-5 h-5" />
                    <span>Cerrar sesión</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

