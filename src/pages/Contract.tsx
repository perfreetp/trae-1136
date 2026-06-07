import useStore from '@/store/useStore'
import { useState } from 'react'
import { FileText, Receipt, CreditCard, Plus, X, Link2, Unlink } from 'lucide-react'
import { cn } from '@/lib/utils'

const fmt = (v: number) => (v / 10000).toFixed(2) + '万'

const statusColor: Record<string, string> = {
  '履行中': 'bg-blue-100 text-blue-700',
  '已完成': 'bg-green-100 text-green-700',
  '已终止': 'bg-red-100 text-red-700',
  '待审批': 'bg-orange-100 text-orange-700',
  '已审批': 'bg-blue-100 text-blue-700',
  '已驳回': 'bg-red-100 text-red-700',
  '已支付': 'bg-green-100 text-green-700',
}

const tabs = [
  { key: 'ledger', label: '合同台账', icon: FileText },
  { key: 'invoice', label: '发票匹配', icon: Receipt },
  { key: 'payment', label: '付款申请', icon: CreditCard },
] as const

type TabKey = (typeof tabs)[number]['key']

export default function Contract() {
  const { contracts, invoices, paymentRequests, addPaymentRequest, updateInvoiceMatch } = useStore()
  const [activeTab, setActiveTab] = useState<TabKey>('ledger')
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null)
  const [invoiceContractMap, setInvoiceContractMap] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    invoices.forEach(inv => {
      if (inv.matchedStatus === '已匹配') init[inv.id] = inv.contractId
    })
    return init
  })
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ contractId: '', amount: '', reason: '' })
  const [formError, setFormError] = useState('')

  const totalAmount = contracts.reduce((s, c) => s + c.amount, 0)
  const totalPaid = contracts.reduce((s, c) => s + c.paidAmount, 0)
  const totalPending = totalAmount - totalPaid

  const progressColor = (ratio: number) =>
    ratio > 0.8 ? 'bg-green-500' : ratio > 0.5 ? 'bg-blue-500' : 'bg-orange-500'

  const unmatchedInvoices = invoices.filter(inv => !(inv.id in invoiceContractMap))
  const matchedInvoices = invoices.filter(inv => inv.id in invoiceContractMap)

  const handleMatch = (invoiceId: string, contractId: string) => {
    setInvoiceContractMap(prev => ({ ...prev, [invoiceId]: contractId }))
    updateInvoiceMatch(invoiceId, contractId)
    setSelectedInvoice(null)
  }

  const handleUnmatch = (invoiceId: string) => {
    setInvoiceContractMap(prev => {
      const next = { ...prev }
      delete next[invoiceId]
      return next
    })
    updateInvoiceMatch(invoiceId, null)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors',
              activeTab === tab.key
                ? 'text-[#1B3A5C] border-b-2 border-[#E67E22]'
                : 'text-gray-500 hover:text-[#1B3A5C]'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'ledger' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: '合同总额', value: fmt(totalAmount), icon: FileText, color: 'text-[#1B3A5C]' },
              { label: '已付总额', value: fmt(totalPaid), icon: CreditCard, color: 'text-green-600' },
              { label: '待付余额', value: fmt(totalPending), icon: Receipt, color: 'text-[#E67E22]' },
            ].map((card) => (
              <div key={card.label} className="bg-white rounded-lg border border-gray-200 p-5 flex items-center gap-4">
                <div className={cn('p-3 rounded-lg bg-gray-50', card.color)}>
                  <card.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className={cn('text-xl font-bold', card.color)}>{card.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#1B3A5C] text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">合同编号</th>
                  <th className="px-4 py-3 text-left font-medium">供应商名称</th>
                  <th className="px-4 py-3 text-right font-medium">合同金额(万元)</th>
                  <th className="px-4 py-3 text-right font-medium">已付金额(万元)</th>
                  <th className="px-4 py-3 text-center font-medium">付款进度</th>
                  <th className="px-4 py-3 text-left font-medium">签订日期</th>
                  <th className="px-4 py-3 text-center font-medium">状态</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((c) => {
                  const ratio = c.amount > 0 ? c.paidAmount / c.amount : 0
                  return (
                    <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs">{c.contractNo}</td>
                      <td className="px-4 py-3">{c.supplierName}</td>
                      <td className="px-4 py-3 text-right">{fmt(c.amount)}</td>
                      <td className="px-4 py-3 text-right">{fmt(c.paidAmount)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={cn('h-full rounded-full', progressColor(ratio))}
                              style={{ width: `${Math.min(ratio * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-10 text-right">
                            {(ratio * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{c.signDate}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusColor[c.status])}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'invoice' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
              <h3 className="text-sm font-semibold text-[#1B3A5C]">发票列表（未匹配）</h3>
              {unmatchedInvoices.length === 0 && (
                <p className="text-sm text-gray-400 py-4 text-center">暂无未匹配发票</p>
              )}
              {unmatchedInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg border transition-colors',
                    selectedInvoice === inv.id
                      ? 'border-[#E67E22] bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div>
                    <p className="text-sm font-medium">{inv.invoiceNo}</p>
                    <p className="text-xs text-gray-500">
                      {fmt(inv.amount)} · {inv.issueDate}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedInvoice(selectedInvoice === inv.id ? null : inv.id)}
                    className={cn(
                      'px-3 py-1 rounded text-xs font-medium transition-colors',
                      selectedInvoice === inv.id
                        ? 'bg-[#E67E22] text-white'
                        : 'bg-[#1B3A5C] text-white hover:bg-[#2a4f7a]'
                    )}
                  >
                    <Link2 className="w-3 h-3 inline mr-1" />
                    匹配
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
              <h3 className="text-sm font-semibold text-[#1B3A5C]">合同列表</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-500 border-b">
                    <th className="pb-2 text-left font-medium">合同编号</th>
                    <th className="pb-2 text-left font-medium">供应商</th>
                    <th className="pb-2 text-right font-medium">金额</th>
                    <th className="pb-2 text-center font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((c) => (
                    <tr key={c.id} className="border-b border-gray-50">
                      <td className="py-2 font-mono text-xs">{c.contractNo}</td>
                      <td className="py-2 text-xs">{c.supplierName}</td>
                      <td className="py-2 text-right text-xs">{fmt(c.amount)}</td>
                      <td className="py-2 text-center">
                        <button
                          onClick={() => selectedInvoice && handleMatch(selectedInvoice, c.id)}
                          disabled={!selectedInvoice}
                          className={cn(
                            'px-2 py-0.5 rounded text-xs font-medium transition-colors',
                            selectedInvoice
                              ? 'bg-[#1B3A5C] text-white hover:bg-[#2a4f7a]'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          )}
                        >
                          关联
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-[#1B3A5C] mb-3">已匹配记录</h3>
            {matchedInvoices.length === 0 && (
              <p className="text-sm text-gray-400 py-4 text-center">暂无匹配记录</p>
            )}
            {matchedInvoices.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-500 border-b">
                    <th className="pb-2 text-left font-medium">发票号</th>
                    <th className="pb-2 text-right font-medium">金额</th>
                    <th className="pb-2 text-left font-medium">关联合同</th>
                    <th className="pb-2 text-left font-medium">开票日期</th>
                    <th className="pb-2 text-center font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {matchedInvoices.map((inv) => {
                    const contractId = invoiceContractMap[inv.id]
                    const contract = contracts.find(c => c.id === contractId)
                    return (
                      <tr key={inv.id} className="border-b border-gray-50">
                        <td className="py-2 font-mono text-xs">{inv.invoiceNo}</td>
                        <td className="py-2 text-right text-xs">{fmt(inv.amount)}</td>
                        <td className="py-2 text-xs">{contract?.contractNo || '-'}</td>
                        <td className="py-2 text-xs">{inv.issueDate}</td>
                        <td className="py-2 text-center">
                          <button
                            onClick={() => handleUnmatch(inv.id)}
                            className="px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100"
                          >
                            <Unlink className="w-3 h-3 inline mr-1" />
                            取消匹配
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'payment' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1 px-4 py-2 bg-[#1B3A5C] text-white text-sm rounded-lg hover:bg-[#2a4f7a] transition-colors"
            >
              <Plus className="w-4 h-4" />
              新建付款申请
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#1B3A5C] text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">申请编号</th>
                  <th className="px-4 py-3 text-left font-medium">关联合同</th>
                  <th className="px-4 py-3 text-right font-medium">申请金额(万元)</th>
                  <th className="px-4 py-3 text-left font-medium">申请原因</th>
                  <th className="px-4 py-3 text-center font-medium">状态</th>
                  <th className="px-4 py-3 text-left font-medium">申请日期</th>
                </tr>
              </thead>
              <tbody>
                {paymentRequests.map((pr) => {
                  const contract = contracts.find((c) => c.id === pr.contractId)
                  return (
                    <tr key={pr.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs">{pr.id}</td>
                      <td className="px-4 py-3 text-xs">{contract?.contractNo || '-'}</td>
                      <td className="px-4 py-3 text-right">{fmt(pr.amount)}</td>
                      <td className="px-4 py-3">{pr.reason}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusColor[pr.status])}>
                          {pr.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{pr.createdAt}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[440px] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#1B3A5C]">新建付款申请</h3>
              <button onClick={() => { setShowModal(false); setFormError('') }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">关联合同 <span className="text-red-500">*</span></label>
                <select
                  value={form.contractId}
                  onChange={(e) => { setForm({ ...form, contractId: e.target.value }); setFormError('') }}
                  className={cn('w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B3A5C]', formError && !form.contractId ? 'border-red-400' : 'border-gray-300')}
                >
                  <option value="">请选择合同</option>
                  {contracts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.contractNo} - {c.supplierName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">申请金额(元) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => { setForm({ ...form, amount: e.target.value }); setFormError('') }}
                  className={cn('w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B3A5C]', formError && !form.amount ? 'border-red-400' : 'border-gray-300')}
                  placeholder="请输入金额"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">申请原因 <span className="text-red-500">*</span></label>
                <textarea
                  value={form.reason}
                  onChange={(e) => { setForm({ ...form, reason: e.target.value }); setFormError('') }}
                  className={cn('w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B3A5C] resize-none', formError && !form.reason ? 'border-red-400' : 'border-gray-300')}
                  rows={3}
                  placeholder="请输入申请原因"
                />
              </div>
              {formError && <p className="text-red-500 text-xs">{formError}</p>}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => { setShowModal(false); setFormError('') }}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (!form.contractId) { setFormError('请选择关联合同'); return }
                  const amount = Number(form.amount)
                  if (!form.amount || isNaN(amount) || amount <= 0) { setFormError('请填写有效金额'); return }
                  if (!form.reason.trim()) { setFormError('请填写申请原因'); return }
                  addPaymentRequest({ contractId: form.contractId, amount, reason: form.reason.trim() })
                  setForm({ contractId: '', amount: '', reason: '' })
                  setFormError('')
                  setShowModal(false)
                }}
                className="px-4 py-2 text-sm text-white bg-[#1B3A5C] rounded-lg hover:bg-[#2a4f7a]"
              >
                提交
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
