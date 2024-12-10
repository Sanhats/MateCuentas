import Link from 'next/link'
import { FaUsers, FaMoneyBillWave, FaChartBar, FaHome } from 'react-icons/fa'
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
          <div className="flex items-center">
            <ul className="flex space-x-4">
              <NavItem href="/dashboard" icon={<FaHome className="w-5 h-5" />}>
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
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}

