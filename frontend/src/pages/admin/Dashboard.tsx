import { useQuery } from 'react-query'
import { api } from '@/lib/api'
import { Users, GraduationCap, BookOpen, DollarSign, TrendingUp, FileText } from 'lucide-react'

export default function AdminDashboard() {
  const { data: stats } = useQuery('admin-stats', async () => {
    const [users, groups, exams, leads] = await Promise.all([
      api.get('/users'),
      api.get('/groups'),
      api.get('/exams'),
      api.get('/leads'),
    ])
    return {
      users: users.data.length,
      groups: groups.data.length,
      exams: exams.data.length,
      leads: leads.data.length,
    }
  })

  const statCards = [
    {
      title: 'Foydalanuvchilar',
      value: stats?.users || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Guruhlar',
      value: stats?.groups || 0,
      icon: GraduationCap,
      color: 'bg-green-500',
    },
    {
      title: 'Imtihonlar',
      value: stats?.exams || 0,
      icon: BookOpen,
      color: 'bg-purple-500',
    },
    {
      title: 'Lidlar',
      value: stats?.leads || 0,
      icon: FileText,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Boshqaruv paneli</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">So'ngi Lidlar</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Ism Familiya</p>
                  <p className="text-sm text-gray-500">+998 90 123 45 67</p>
                </div>
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  Yangi
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Statistika</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Aktiv foydalanuvchilar</span>
                <span className="text-sm font-medium">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Guruhlar to'ldirilganligi</span>
                <span className="text-sm font-medium">72%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
