import { useQuery, useMutation, useQueryClient } from 'react-query'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import { Calendar, CheckCircle, XCircle } from 'lucide-react'
import { useState } from 'react'
import { format } from 'date-fns'

export default function TeacherAttendance() {
  const [selectedGroup, setSelectedGroup] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const queryClient = useQueryClient()

  const { data: groups } = useQuery('teacher-groups', () =>
    api.get('/groups').then((res) => res.data)
  )

  const { data: attendance, isLoading } = useQuery(
    ['attendance', selectedGroup, selectedDate],
    () => api.get(`/groups/${selectedGroup}/attendance?date=${selectedDate}`).then((res) => res.data),
    { enabled: !!selectedGroup }
  )

  const markAttendanceMutation = useMutation(
    ({ groupId, studentId, date, isPresent }: any) =>
      api.post(`/groups/${groupId}/attendance`, { studentId, date, isPresent }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['attendance', selectedGroup, selectedDate])
        toast.success('Davomat belgilandi')
      },
    }
  )

  const selectedGroupData = groups?.find((g: any) => g.id === selectedGroup)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Davomat</h1>
        <p className="text-gray-600 mt-1">Talabalar davomatini belgilash</p>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Guruh</label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="input"
            >
              <option value="">Guruhni tanlang</option>
              {groups?.map((group: any) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sana</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input"
            />
          </div>
        </div>

        {selectedGroup && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {selectedGroupData?.name} - {format(new Date(selectedDate), 'dd.MM.yyyy')}
            </h2>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedGroupData?.students?.map((gs: any) => {
                  const student = gs.student
                  const attendanceRecord = attendance?.find(
                    (a: any) => a.studentId === student.id
                  )
                  const isPresent = attendanceRecord?.isPresent ?? null

                  return (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            markAttendanceMutation.mutate({
                              groupId: selectedGroup,
                              studentId: student.id,
                              date: selectedDate,
                              isPresent: true,
                            })
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            isPresent === true
                              ? 'bg-green-500 text-white'
                              : 'bg-white text-gray-600 hover:bg-green-50'
                          }`}
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button
                          onClick={() =>
                            markAttendanceMutation.mutate({
                              groupId: selectedGroup,
                              studentId: student.id,
                              date: selectedDate,
                              isPresent: false,
                            })
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            isPresent === false
                              ? 'bg-red-500 text-white'
                              : 'bg-white text-gray-600 hover:bg-red-50'
                          }`}
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
