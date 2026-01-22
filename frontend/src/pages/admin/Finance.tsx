import { useQuery } from 'react-query'
import { api } from '@/lib/api'
import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function AdminFinance() {
  const { data: transactions, isLoading } = useQuery('all-transactions', () =>
    api.get('/finance/transactions').then((res) => res.data)
  )

  const stats = {
    totalRevenue: 5000000,
    monthlyRevenue: 1200000,
    totalTransactions: transactions?.length || 0,
    pendingPayments: 250000,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Moliya</h1>
        <p className="text-gray-600 mt-1">To'lovlar va tranzaksiyalar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Jami daromad</p>
            <DollarSign className="text-green-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.totalRevenue.toLocaleString()} so'm
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Oylik daromad</p>
            <TrendingUp className="text-blue-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.monthlyRevenue.toLocaleString()} so'm
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Tranzaksiyalar</p>
            <ArrowUpRight className="text-purple-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Kutilayotgan to'lovlar</p>
            <ArrowDownRight className="text-orange-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.pendingPayments.toLocaleString()} so'm
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">So'ngi tranzaksiyalar</h2>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sana</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Turi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Summa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions?.slice(0, 10).map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(tx.createdAt).toLocaleDateString('uz-UZ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.type}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.type === 'deposit' ? '+' : '-'}{Number(tx.amount).toLocaleString()} so'm
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.status === 'completed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
