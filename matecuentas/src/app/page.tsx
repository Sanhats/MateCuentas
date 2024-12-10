import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Welcome to Expense Sharing App</h1>
      <div className="space-x-4">
        <Link href="/auth/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Login
        </Link>
        <Link href="/auth/register" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Register
        </Link>
      </div>
    </div>
  )
}