import useStore from '@/store/useStore'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, FileCheck, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = ['材料需求计划', '预算对比', '采购申请', '供应商报价']

const statusColors: Record<string, string> = {
  '待审批': 'bg-orange-100 text-orange-700',
  '已审批': 'bg-blue-100 text-blue-700',
  '已驳回': 'bg-red-100 text-red-700',
  '已采购': 'bg-green-100 text-green-700',
}

const fmt = (n: number) => n.toLocaleString()

export default function Plan() {
  const { materialPlans, purchaseRequests, supplierQuotes, addPurchaseRequest, approvePurchaseRequest, rejectPurchaseRequest, progressToPurchased, currentRole } = useStore()
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tabParam === 'purchase' ? 2 : 0)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ materialName: '', qty: '' })
  const [formError, setFormError] = useState('')

  const groupedQuotes = supplierQuotes.reduce<Record<string, typeof supplierQuotes>>((acc, q) => {
    ;(acc[q.requestId] ??= []).push(q)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={cn(
              'px-6 py-3 text-sm transition-colors relative',
              activeTab === i
                ? 'font-bold text-[#1B3A5C] border-b-2 border-[#E67E22]'
                : 'text-gray-400 hover:text-gray-600'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1B3A5C] text-white">
                <th className="px-4 py-3 text-left font-medium">材料名称</th>
                <th className="px-4 py-3 text-left font-medium">规格</th>
                <th className="px-4 py-3 text-left font-medium">单位</th>
                <th className="px-4 py-3 text-right font-medium">计划量</th>
                <th className="px-4 py-3 text-right font-medium">已采购量</th>
                <th className="px-4 py-3 text-right font-medium">已使用量</th>
                <th className="px-4 py-3 text-left font-medium">月份</th>
                <th className="px-4 py-3 text-left font-medium w-40">采购进度</th>
              </tr>
            </thead>
            <tbody>
              {materialPlans.map((m) => {
                const pct = Math.round((m.purchasedQty / m.plannedQty) * 100)
                return (
                  <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-[#1B3A5C]">{m.materialName}</td>
                    <td className="px-4 py-3 text-gray-600">{m.specification}</td>
                    <td className="px-4 py-3 text-gray-600">{m.unit}</td>
                    <td className="px-4 py-3 text-right">{fmt(m.plannedQty)}</td>
                    <td className="px-4 py-3 text-right">{fmt(m.purchasedQty)}</td>
                    <td className="px-4 py-3 text-right">{fmt(m.usedQty)}</td>
                    <td className="px-4 py-3 text-gray-600">{m.month}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#E67E22] rounded-full"
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-9 text-right">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 1 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1B3A5C] text-white">
                <th className="px-4 py-3 text-left font-medium">材料名称</th>
                <th className="px-4 py-3 text-left font-medium">规格</th>
                <th className="px-4 py-3 text-right font-medium">预算量</th>
                <th className="px-4 py-3 text-right font-medium">计划量</th>
                <th className="px-4 py-3 text-right font-medium">已采购量</th>
                <th className="px-4 py-3 text-right font-medium">差异</th>
                <th className="px-4 py-3 text-center font-medium">状态</th>
              </tr>
            </thead>
            <tbody>
              {materialPlans.map((m) => {
                const diff = m.plannedQty - m.budgetQty
                const over = diff > 0
                return (
                  <tr
                    key={m.id}
                    className={cn(
                      'border-b border-gray-100 hover:bg-gray-50',
                      over && 'bg-red-50 hover:bg-red-50'
                    )}
                  >
                    <td className="px-4 py-3 font-medium text-[#1B3A5C]">{m.materialName}</td>
                    <td className="px-4 py-3 text-gray-600">{m.specification}</td>
                    <td className="px-4 py-3 text-right">{fmt(m.budgetQty)}</td>
                    <td className="px-4 py-3 text-right">{fmt(m.plannedQty)}</td>
                    <td className="px-4 py-3 text-right">{fmt(m.purchasedQty)}</td>
                    <td className={cn('px-4 py-3 text-right font-medium', over ? 'text-red-600' : 'text-green-600')}>
                      {over ? `+${fmt(diff)}` : fmt(diff)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {over ? (
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                          超预算
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                          正常
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 2 && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#E67E22] text-white text-sm font-medium rounded-lg hover:bg-[#d35400] transition-colors"
            >
              <Plus className="w-4 h-4" />
              新建采购申请
            </button>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1B3A5C] text-white">
                  <th className="px-4 py-3 text-left font-medium">编号</th>
                  <th className="px-4 py-3 text-left font-medium">材料名称</th>
                  <th className="px-4 py-3 text-right font-medium">数量</th>
                  <th className="px-4 py-3 text-center font-medium">状态</th>
                  <th className="px-4 py-3 text-left font-medium">申请日期</th>
                  <th className="px-4 py-3 text-left font-medium">审批人</th>
                  <th className="px-4 py-3 text-center font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {purchaseRequests.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-[#1B3A5C]">{r.id}</td>
                    <td className="px-4 py-3">{r.materialName}</td>
                    <td className="px-4 py-3 text-right">{fmt(r.qty)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn('inline-block px-2 py-0.5 rounded text-xs font-medium', statusColors[r.status])}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{r.createdAt}</td>
                    <td className="px-4 py-3 text-gray-600">{r.approvedBy || '—'}</td>
                    <td className="px-4 py-3 text-center">
                      {r.status === '待审批' ? (
                        currentRole === '物资经理' ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => approvePurchaseRequest(r.id)}
                              className="px-2 py-0.5 text-xs font-medium rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
                            >
                              通过
                            </button>
                            <button
                              onClick={() => rejectPurchaseRequest(r.id, '审批驳回')}
                              className="px-2 py-0.5 text-xs font-medium rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                            >
                              驳回
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">无权限</span>
                        )
                      ) : r.status === '已审批' ? (
                        currentRole === '物资经理' ? (
                          <button
                            onClick={() => progressToPurchased(r.id)}
                            className="px-2 py-0.5 text-xs font-medium rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                          >
                            推进采购
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">无权限</span>
                        )
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#1B3A5C]">新建采购申请</h3>
                  <button onClick={() => { setShowModal(false); setFormError('') }} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">材料名称 <span className="text-red-500">*</span></label>
                    <input
                      value={form.materialName}
                      onChange={(e) => { setForm({ ...form, materialName: e.target.value }); setFormError('') }}
                      className={cn('w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]', formError && !form.materialName ? 'border-red-400' : 'border-gray-300')}
                      placeholder="请输入材料名称"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">数量 <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      value={form.qty}
                      onChange={(e) => { setForm({ ...form, qty: e.target.value }); setFormError('') }}
                      className={cn('w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]', formError && !form.qty ? 'border-red-400' : 'border-gray-300')}
                      placeholder="请输入数量"
                    />
                  </div>
                  {formError && <p className="text-red-500 text-xs">{formError}</p>}
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => { setShowModal(false); setFormError('') }}
                    className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => {
                      if (!form.materialName.trim()) { setFormError('请填写材料名称'); return }
                      const qty = Number(form.qty)
                      if (!form.qty || isNaN(qty) || qty <= 0) { setFormError('请填写有效数量'); return }
                      addPurchaseRequest({ projectId: 'P001', planId: '', materialName: form.materialName.trim(), qty })
                      setForm({ materialName: '', qty: '' })
                      setFormError('')
                      setShowModal(false)
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm text-white bg-[#1B3A5C] rounded-lg hover:bg-[#142d49]"
                  >
                    <FileCheck className="w-4 h-4" />
                    提交
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 3 && (
        <div className="space-y-8">
          {Object.entries(groupedQuotes).map(([requestId, quotes]) => {
            const minPrice = Math.min(...quotes.map((q) => q.unitPrice))
            const req = purchaseRequests.find((r) => r.id === requestId)
            return (
              <div key={requestId}>
                <h3 className="text-sm font-bold text-[#1B3A5C] mb-3">
                  采购申请 {requestId}
                  {req ? ` — ${req.materialName}` : ''}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {quotes.map((q) => {
                    const isLowest = q.unitPrice === minPrice
                    return (
                      <div
                        key={q.id}
                        className={cn(
                          'rounded-lg border p-4 space-y-2',
                          isLowest
                            ? 'border-green-400 bg-green-50/50 ring-1 ring-green-400'
                            : 'border-gray-200 bg-white'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[#1B3A5C]">{q.supplierName}</span>
                          {isLowest && (
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-500 text-white">
                              最低价
                            </span>
                          )}
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-[#E67E22]">¥{fmt(q.unitPrice)}</span>
                          <span className="text-xs text-gray-500">/单价</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>总价: ¥{fmt(q.totalPrice)}</span>
                          <span>交货: {q.deliveryDays}天</span>
                          <span>报价日: {q.quoteDate}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
