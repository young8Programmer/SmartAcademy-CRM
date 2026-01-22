import { useQuery, useMutation, useQueryClient } from 'react-query'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import { BookOpen, DollarSign, Play, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function StudentExams() {
  const [selectedExam, setSelectedExam] = useState<any>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const queryClient = useQueryClient()

  const { data: exams, isLoading } = useQuery('student-exams', () =>
    api.get('/exams').then((res) => res.data)
  )

  const { data: results } = useQuery('exam-results', () =>
    api.get('/exams/results/my').then((res) => res.data)
  )

  const takeExamMutation = useMutation(
    ({ examId, answers }: { examId: string; answers: Record<string, number> }) =>
      api.post(`/exams/${examId}/take`, { answers }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('exam-results')
        queryClient.invalidateQueries('wallet')
        toast.success('Imtihon yakunlandi!')
        setSelectedExam(null)
        setAnswers({})
      },
    }
  )

  const handleTakeExam = () => {
    if (selectedExam) {
      takeExamMutation.mutate({ examId: selectedExam.id, answers })
    }
  }

  const hasTakenExam = (examId: string) => {
    return results?.some((r: any) => r.examId === examId)
  }

  const getExamResult = (examId: string) => {
    return results?.find((r: any) => r.examId === examId)
  }

  if (selectedExam) {
    return (
      <div className="space-y-6">
        <div>
          <button
            onClick={() => {
              setSelectedExam(null)
              setAnswers({})
            }}
            className="text-primary-600 hover:underline mb-4"
          >
            ← Orqaga
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{selectedExam.title}</h1>
        </div>

        <div className="card space-y-6">
          {selectedExam.questions?.map((question: any, index: number) => (
            <div key={question.id} className="border-b border-gray-200 pb-6 last:border-0">
              <p className="text-lg font-medium mb-4">
                {index + 1}. {question.text}
              </p>
              <div className="space-y-2">
                {question.options.map((option: string, optIndex: number) => (
                  <label
                    key={optIndex}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={optIndex}
                      checked={answers[question.id] === optIndex}
                      onChange={() => setAnswers({ ...answers, [question.id]: optIndex })}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button onClick={handleTakeExam} className="btn-primary w-full py-3">
            Imtihonni yakunlash
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Imtihonlar</h1>
        <p className="text-gray-600 mt-1">Mavjud imtihonlar va natijalar</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams?.map((exam: any) => {
            const taken = hasTakenExam(exam.id)
            const result = getExamResult(exam.id)

            return (
              <div key={exam.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{exam.title}</h3>
                  {taken && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
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
                {taken && result ? (
                  <div className="p-3 bg-gray-50 rounded-lg mb-4">
                    <p className="text-sm text-gray-600">Natija:</p>
                    <p className="text-lg font-bold text-primary-600">
                      {result.score} / {result.totalPoints} ({result.percentage.toFixed(1)}%)
                    </p>
                    <p className={`text-sm font-medium ${result.isPassed ? 'text-green-600' : 'text-red-600'}`}>
                      {result.isPassed ? 'O\'tdi' : 'O\'tmadi'}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedExam(exam)}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <Play size={18} />
                    <span>Imtihonni boshlash</span>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
