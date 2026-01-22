import { useQuery } from 'react-query'
import { api } from '@/lib/api'
import { Plus, Users, Calendar } from 'lucide-react'

export default function AdminGroups() {
  const { data: groups, isLoading } = useQuery('groups', () =>
    api.get('/groups').then((res) => res.data)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Guruhlar</h1>
          <p className="text-gray-600 mt-1">Barcha o'quv guruhlarini boshqarish</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          <span>Yangi guruh</span>
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups?.map((group: any) => (
            <div key={group.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{group.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  group.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {group.isActive ? 'Aktiv' : 'Nofaol'}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{group.description || 'Tavsif yo\'q'}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{group.students?.length || 0} talaba</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>Jadval</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
