import { useQuery } from 'react-query'
import { api } from '@/lib/api'
import { GraduationCap, BookOpen, Users, ClipboardCheck } from 'lucide-react'

export default function TeacherDashboard() {
  const { data: stats } = useQuery('teacher-stats', async () => {
    const [groups, exams] = await Promise.all([
      api.get('/groups'),
      api.get('/exams'),
    ])
    return {
      groups: groups.data.length,
      exams: exams.data.length,
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">O'qituvchi paneli</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Guruhlarim</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.groups || 0}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Imtihonlarim</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.exams || 0}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
