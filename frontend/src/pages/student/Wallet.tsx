import { useQuery, useMutation, useQueryClient } from 'react-query'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import { Wallet, Plus, ArrowDown, ArrowUp, History } from 'lucide-react'
import { useState } from 'react'

export default function StudentWallet() {
  const [amount, setAmount] = useState('')
  const [showDepositModal, setShowDepositModal] = useState(false)
  const queryClient = useQueryClient()

  const { data: wallet, isLoading: walletLoading } = useQuery('wallet', () =>
    api.get('/finance/wallet').then((res) => res.data)
  )

  const { data: transactions, isLoading: transactionsLoading } = useQuery('transactions', () =>
    api.get('/finance/transactions').then((res) => res.data)
  )

  const depositMutation = useMutation(
    (amount: number) => api.post('/finance/deposit', { amount }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('wallet')
        queryClient.invalidateQueries('transactions')
        toast.success('Hamyonga pul qo\'shildi')
        setShowDepositModal(false)
        setAmount('')
      },
    }
  )

  const handleDeposit = () => {
    const numAmount = parseFloat(amount)
    if (numAmount > 0) {
      depositMutation.mutate(numAmount)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hamyon</h1>
          <p className="text-gray-600 mt-1">Balansingiz va tranzaksiyalar</p>
        </div>
        <button
          onClick={() => setShowDepositModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Pul qo'shish</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <Wallet className="w-8 h-8" />
            <span className="text-primary-100 text-sm">Balans</span>
          </div>
          <p className="text-4xl font-bold mb-2">
            {walletLoading ? '...' : Number(wallet?.balance || 0).toLocaleString()} so'm
          </p>
          <p className="text-primary-100 text-sm">
            {wallet?.autoBillingEnabled ? 'Avto-to\'lov faol' : 'Avto-to\'lov o\'chirilgan'}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <ArrowDown className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Kirim</p>
              <p className="text-xl font-bold text-gray-900">
                {transactions
                  ?.filter((t: any) => t.type === 'deposit')
                  .reduce((sum: number, t: any) => sum + Number(t.amount), 0)
                  .toLocaleString() || 0}{' '}
                so'm
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <ArrowUp className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Chiqim</p>
              <p className="text-xl font-bold text-gray-900">
                {transactions
                  ?.filter((t: any) => t.type !== 'deposit')
                  .reduce((sum: number, t: any) => sum + Number(t.amount), 0)
                  .toLocaleString() || 0}{' '}
                so'm
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold">Tranzaksiyalar tarixi</h2>
        </div>
        {transactionsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions?.map((tx: any) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{tx.description || tx.type}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(tx.createdAt).toLocaleString('uz-UZ')}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {tx.type === 'deposit' ? '+' : '-'}
                    {Number(tx.amount).toLocaleString()} so'm
                  </p>
                  <p className="text-sm text-gray-500">
                    Balans: {Number(tx.balanceAfter).toLocaleString()} so'm
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Hamyonga pul qo'shish</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Summa
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="btn-secondary flex-1"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleDeposit}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="btn-primary flex-1"
                >
                  Qo'shish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
