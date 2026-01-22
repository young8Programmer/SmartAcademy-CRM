import { useQuery } from 'react-query'
import { api } from '@/lib/api'
import { Calendar, Clock, MapPin } from 'lucide-react'

export default function StudentSchedule() {
  const { data: groups, isLoading } = useQuery('student-groups', () =>
    api.get('/groups').then((res) => res.data)
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dars jadvali</h1>
        <p className="text-gray-600 mt-1">Mening darslarim</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {groups?.map((group: any) => (
            <div key={group.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{group.name}</h3>
                  <p className="text-gray-600 mt-1">{group.description || 'Tavsif yo\'q'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  group.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {group.isActive ? 'Aktiv' : 'Nofaol'}
                </span>
              </div>
              {group.schedule && (
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    <span>Dushanba, Chorshanba, Juma</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={16} />
                    <span>18:00 - 20:00</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
