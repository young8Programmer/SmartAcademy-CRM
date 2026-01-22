import { useQuery, useMutation, useQueryClient } from 'react-query'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import { Plus, BookOpen, DollarSign, Edit, Trash2, Eye } from 'lucide-react'
import { useState } from 'react'

export default function TeacherExams() {
  const queryClient = useQueryClient()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const { data: exams, isLoading } = useQuery('teacher-exams', () =>
    api.get('/exams').then((res) => res.data)
  )

  const deleteMutation = useMutation(
    (id: string) => api.delete(`/exams/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('teacher-exams')
        toast.success('Imtihon o\'chirildi')
      },
    }
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Imtihonlarim</h1>
          <p className="text-gray-600 mt-1">Mening yaratgan imtihonlarim</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Yangi imtihon</span>
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams?.map((exam: any) => (
            <div key={exam.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{exam.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  exam.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {exam.isPublished ? 'Nashr qilingan' : 'Nashr qilinmagan'}
                </span>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">{exam.description || 'Tavsif yo\'q'}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 mb-4">
                <div className="flex items-center gap-2 text-primary-600 font-semibold">
                  <DollarSign size={18} />
                  <span>{exam.price} so'm</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <BookOpen size={16} />
                  <span>{exam.questions?.length || 0} savol</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
                  <Eye size={18} />
                  <span>Ko'rish</span>
                </button>
                <button className="btn-secondary">
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => deleteMutation.mutate(exam.id)}
                  className="btn-secondary text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
