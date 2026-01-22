import { useQuery, useMutation, useQueryClient } from 'react-query'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import { Phone, Mail, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useState } from 'react'

export default function AdminLeads() {
  const [filter, setFilter] = useState<string>('all')
  const queryClient = useQueryClient()

  const { data: leads, isLoading } = useQuery('leads', () =>
    api.get('/leads').then((res) => res.data)
  )

  const updateStatusMutation = useMutation(
    ({ id, status }: { id: string; status: string }) =>
      api.patch(`/leads/${id}/status`, { status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('leads')
        toast.success('Status yangilandi')
      },
    }
  )

  const filteredLeads = filter === 'all' 
    ? leads 
    : leads?.filter((lead: any) => lead.status === filter)

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; icon: any; color: string }> = {
      new: { label: 'Yangi', icon: Clock, color: 'bg-blue-100 text-blue-700' },
      contacted: { label: 'Bog\'langan', icon: MessageSquare, color: 'bg-yellow-100 text-yellow-700' },
      qualified: { label: 'Sifatli', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
      converted: { label: 'Aylantirilgan', icon: CheckCircle, color: 'bg-purple-100 text-purple-700' },
      lost: { label: 'Yo\'qotilgan', icon: XCircle, color: 'bg-red-100 text-red-700' },
    }
    const config = configs[status] || configs.new
    const Icon = config.icon
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}>
        <Icon size={14} />
        {config.label}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Lidlar</h1>
        <p className="text-gray-600 mt-1">Telegram va boshqa manbalardan kelgan murojaatlar</p>
      </div>

      <div className="flex gap-2">
        {['all', 'new', 'contacted', 'qualified', 'converted', 'lost'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === status
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {status === 'all' ? 'Barchasi' : getStatusBadge(status).props.children[1]}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads?.map((lead: any) => (
            <div key={lead.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {lead.firstName} {lead.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(lead.createdAt).toLocaleDateString('uz-UZ')}
                  </p>
                </div>
                {getStatusBadge(lead.status)}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={16} />
                  <span>{lead.phone}</span>
                </div>
                {lead.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={16} />
                    <span>{lead.email}</span>
                  </div>
                )}
                {lead.message && (
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MessageSquare size={16} className="mt-0.5" />
                    <span className="line-clamp-2">{lead.message}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <select
                  value={lead.status}
                  onChange={(e) => updateStatusMutation.mutate({ id: lead.id, status: e.target.value })}
                  className="flex-1 input text-sm"
                >
                  <option value="new">Yangi</option>
                  <option value="contacted">Bog'langan</option>
                  <option value="qualified">Sifatli</option>
                  <option value="converted">Aylantirilgan</option>
                  <option value="lost">Yo'qotilgan</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
