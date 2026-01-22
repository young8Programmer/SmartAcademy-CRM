import { useQuery } from 'react-query'
import { api } from '@/lib/api'
import { Wallet, BookOpen, Calendar, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function StudentDashboard() {
  const { data: wallet } = useQuery('wallet', () =>
    api.get('/finance/wallet').then((res) => res.data)
  )

  const { data: exams } = useQuery('student-exams', () =>
    api.get('/exams').then((res) => res.data)
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Talaba paneli</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/student/wallet" className="card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Hamyon balansi</p>
              <p className="text-3xl font-bold text-gray-900">
                {Number(wallet?.balance || 0).toLocaleString()} so'm
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
        </Link>

        <Link to="/student/exams" className="card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Mavjud imtihonlar</p>
              <p className="text-3xl font-bold text-gray-900">{exams?.length || 0}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </Link>

        <Link to="/student/schedule" className="card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Dars jadvali</p>
              <p className="text-3xl font-bold text-gray-900">-</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </Link>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">So'ngi faoliyat</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Hamyonga pul qo'shildi</p>
              <p className="text-sm text-gray-500">Bugun, 14:30</p>
            </div>
            <span className="text-green-600 font-semibold">+50 000 so'm</span>
          </div>
        </div>
      </div>
    </div>
  )
}
