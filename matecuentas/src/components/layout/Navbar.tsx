import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><Link href="/groups">Groups</Link></li>
        <li><Link href="/expenses">Expenses</Link></li>
        <li><Link href="/savings">Savings</Link></li>
        <li><Link href="/reports">Reports</Link></li>
      </ul>
    </nav>
  )
}