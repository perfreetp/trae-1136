import useStore, { useDerived, WarehouseIssue, SubcontractorSign, MaterialReturn, LossRecord, EquipmentRental, InventoryItem, InventoryTransaction } from '@/store/useStore'
import { useState } from 'react'
import { Package, PenLine, RotateCcw, AlertTriangle, Wrench, X, Calendar, Warehouse } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { key: 'warehouse', label: '仓库领料', icon: Package },
  { key: 'sign', label: '分包签收', icon: PenLine },
  { key: 'return', label: '剩余料退库', icon: RotateCcw },
  { key: 'loss', label: '损耗登记', icon: AlertTriangle },
  { key: 'rental', label: '租赁设备归还', icon: Wrench },
  { key: 'inventory', label: '库存明细', icon: Warehouse },
] as const

type TabKey = (typeof tabs)[number]['key']

const badge = (text: string, color: string) => (
  <span className={cn('inline-block px-2 py-0.5 rounded text-xs font-medium text-white', color)}>
    {text}
  </span>
)

const statusBadge = (status: string) => {
  if (status === '待审核' || status === '待签收' || status === '待验收') return badge(status, 'bg-orange-500')
  if (status === '已出库' || status === '已签收' || status === '已入库') return badge(status, 'bg-green-600')
  if (status === '在租') return badge(status, 'bg-blue-600')
  if (status === '已归还') return badge(status, 'bg-green-600')
  if (status === '逾期未还') return badge(status, 'bg-red-600 animate-pulse')
  return badge(status, 'bg-gray-500')
}

const lossRateColor = (rate: number) => {
  if (rate > 5) return 'text-red-600 font-semibold'
  if (rate >= 3) return 'text-orange-500 font-medium'
  return 'text-green-600'
}

const thCls = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200'
const tdCls = 'px-4 py-3 text-sm text-slate-700 border-b border-slate-100'

function WarehouseTab({ data }: { data: WarehouseIssue[] }) {
  const { approveWarehouseIssue } = useStore()
  return (
    <table className="w-full">
      <thead>
        <tr className="bg-slate-50">
          <th className={thCls}>出库单号</th>
          <th className={thCls}>分包队伍</th>
          <th className={thCls}>材料名称</th>
          <th className={thCls}>出库数量</th>
          <th className={thCls}>出库日期</th>
          <th className={thCls}>状态</th>
          <th className={thCls}>操作</th>
        </tr>
      </thead>
      <tbody>
        {data.map((r) => (
          <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
            <td className={tdCls}>{r.id}</td>
            <td className={tdCls}>{r.subcontractorName}</td>
            <td className={tdCls}>{r.materialName}</td>
            <td className={tdCls}>{r.issuedQty}</td>
            <td className={tdCls}>{r.issuedDate}</td>
            <td className={tdCls}>{statusBadge(r.status)}</td>
            <td className={tdCls}>
              {r.status === '待审核' && (
                <button
                  onClick={() => approveWarehouseIssue(r.id)}
                  className="px-3 py-1 text-xs rounded bg-[#1B3A5C] text-white hover:bg-[#2a4f7a] transition-colors"
                >
                  审核
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function SignTab({ data }: { data: SubcontractorSign[] }) {
  const { signSubcontractor } = useStore()
  const [signingId, setSigningId] = useState<string | null>(null)
  const [signQty, setSignQty] = useState('')

  const handleSign = (id: string) => {
    const qty = Number(signQty)
    if (!signQty || isNaN(qty) || qty <= 0) return
    signSubcontractor(id, qty)
    setSigningId(null)
    setSignQty('')
  }

  return (
    <>
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50">
            <th className={thCls}>签收单号</th>
            <th className={thCls}>分包队伍</th>
            <th className={thCls}>材料名称</th>
            <th className={thCls}>签收数量</th>
            <th className={thCls}>签收日期</th>
            <th className={thCls}>状态</th>
            <th className={thCls}>操作</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.id} className={cn('hover:bg-slate-50/60 transition-colors', r.status === '待签收' && 'font-semibold')}>
              <td className={tdCls}>{r.id}</td>
              <td className={tdCls}>{r.subcontractorName}</td>
              <td className={tdCls}>{r.materialName}</td>
              <td className={tdCls}>{r.signedQty || '-'}</td>
              <td className={tdCls}>{r.signedDate || '-'}</td>
              <td className={tdCls}>{statusBadge(r.status)}</td>
              <td className={tdCls}>
                {r.status === '待签收' && signingId !== r.id && (
                  <button
                    onClick={() => { setSigningId(r.id); setSignQty('') }}
                    className="px-3 py-1 text-xs rounded bg-[#E67E22] text-white hover:bg-[#d35400] transition-colors"
                  >
                    签收
                  </button>
                )}
                {r.status === '待签收' && signingId === r.id && (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={signQty}
                      onChange={e => setSignQty(e.target.value)}
                      placeholder="数量"
                      className="w-16 border border-gray-300 rounded px-1.5 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#E67E22]"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSign(r.id)}
                      className="px-2 py-0.5 text-xs rounded bg-green-600 text-white hover:bg-green-700"
                    >
                      确认
                    </button>
                    <button
                      onClick={() => { setSigningId(null); setSignQty('') }}
                      className="px-2 py-0.5 text-xs rounded bg-gray-300 text-gray-600 hover:bg-gray-400"
                    >
                      取消
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

function ReturnTab({ data }: { data: MaterialReturn[] }) {
  const { acceptMaterialReturn } = useStore()

  return (
    <table className="w-full">
      <thead>
        <tr className="bg-slate-50">
          <th className={thCls}>退库单号</th>
          <th className={thCls}>材料名称</th>
          <th className={thCls}>退库数量</th>
          <th className={thCls}>退库原因</th>
          <th className={thCls}>退库日期</th>
          <th className={thCls}>状态</th>
          <th className={thCls}>操作</th>
        </tr>
      </thead>
      <tbody>
        {data.map((r) => (
          <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
            <td className={tdCls}>{r.id}</td>
            <td className={tdCls}>{r.materialName}</td>
            <td className={tdCls}>{r.returnQty}</td>
            <td className={tdCls}>{r.reason}</td>
            <td className={tdCls}>{r.returnDate}</td>
            <td className={tdCls}>{statusBadge(r.status)}</td>
            <td className={tdCls}>
              {r.status === '待验收' && (
                <button
                  onClick={() => acceptMaterialReturn(r.id)}
                  className="px-3 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  验收
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function LossTab({ data }: { data: LossRecord[] }) {
  return (
    <table className="w-full">
      <thead>
        <tr className="bg-slate-50">
          <th className={thCls}>记录编号</th>
          <th className={thCls}>材料名称</th>
          <th className={thCls}>损耗数量</th>
          <th className={thCls}>损耗率(%)</th>
          <th className={thCls}>损耗原因</th>
          <th className={thCls}>登记日期</th>
        </tr>
      </thead>
      <tbody>
        {data.map((r) => (
          <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
            <td className={tdCls}>{r.id}</td>
            <td className={tdCls}>{r.materialName}</td>
            <td className={tdCls}>{r.lossQty}</td>
            <td className={cn(tdCls, lossRateColor(r.lossRate))}>{r.lossRate}%</td>
            <td className={tdCls}>{r.reason}</td>
            <td className={tdCls}>{r.recordedDate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function RentalTab({ data }: { data: EquipmentRental[] }) {
  const { returnEquipment } = useStore()
  const [returningId, setReturningId] = useState<string | null>(null)
  const [returnDate, setReturnDate] = useState('')

  const handleReturn = (id: string) => {
    if (!returnDate) return
    returnEquipment(id, returnDate)
    setReturningId(null)
    setReturnDate('')
  }

  const calcDays = (start: string, end: string, status: string) => {
    const s = new Date(start)
    const e = status === '在租' || status === '逾期未还' ? new Date() : new Date(end)
    return Math.max(1, Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((r) => {
        const days = calcDays(r.rentalStart, r.rentalEnd, r.status)
        const canReturn = r.status === '在租' || r.status === '逾期未还'
        return (
          <div
            key={r.id}
            className={cn(
              'rounded-lg border p-5 transition-shadow hover:shadow-md',
              r.status === '逾期未还' ? 'border-red-300 bg-red-50/40' : 'border-slate-200 bg-white'
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#1B3A5C]">{r.equipmentName}</h3>
              {statusBadge(r.status)}
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>租期</span>
                <span>{r.rentalStart} → {r.rentalEnd}</span>
              </div>
              <div className="flex justify-between">
                <span>日租金</span>
                <span className="font-medium text-[#1B3A5C]">¥{r.dailyRate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>租赁天数</span>
                <span className="font-medium">{days} 天</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2">
                <span>累计费用</span>
                <span className="font-bold text-[#E67E22]">¥{(days * r.dailyRate).toLocaleString()}</span>
              </div>
            </div>
            {canReturn && returningId !== r.id && (
              <button
                onClick={() => { setReturningId(r.id); setReturnDate(new Date().toISOString().slice(0, 10)) }}
                className="mt-3 w-full px-3 py-2 text-xs rounded bg-[#1B3A5C] text-white hover:bg-[#2a4f7a] transition-colors flex items-center justify-center gap-1"
              >
                <Calendar className="w-3.5 h-3.5" />
                办理归还
              </button>
            )}
            {canReturn && returningId === r.id && (
              <div className="mt-3 space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <label className="block text-xs text-slate-600">归还日期</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={e => setReturnDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#E67E22]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReturn(r.id)}
                    disabled={!returnDate}
                    className={cn(
                      'flex-1 px-2 py-1.5 text-xs rounded font-medium transition-colors',
                      returnDate ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    )}
                  >
                    确认归还
                  </button>
                  <button
                    onClick={() => { setReturningId(null); setReturnDate('') }}
                    className="px-2 py-1.5 text-xs rounded bg-gray-200 text-gray-600 hover:bg-gray-300"
                  >
                    取消
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function InventoryTab() {
  const { inventoryItems, inventoryTransactions } = useDerived()
  const totalMaterials = inventoryItems.length
  const totalInbound = inventoryItems.reduce((a, i) => a + i.inboundQty, 0)
  const totalOutbound = inventoryItems.reduce((a, i) => a + i.outboundQty, 0)
  const totalCurrent = inventoryItems.reduce((a, i) => a + i.currentQty, 0)
  const recentTransactions = inventoryTransactions.slice(0, 10)

  const transactionBadge = (type: InventoryTransaction['type']) => {
    if (type === '验收入库') return badge(type, 'bg-green-600')
    if (type === '领料出库') return badge(type, 'bg-blue-600')
    if (type === '退库入库') return badge(type, 'bg-orange-500')
    return badge(type, 'bg-gray-500')
  }

  const summaryCards = [
    { label: '材料种类', value: totalMaterials, color: 'text-[#1B3A5C]' },
    { label: '总入库量', value: totalInbound, color: 'text-green-600' },
    { label: '总出库量', value: totalOutbound, color: 'text-blue-600' },
    { label: '当前库存', value: totalCurrent, color: totalCurrent < 0 ? 'text-red-600' : 'text-[#E67E22]' },
  ]

  return (
    <div className="p-5 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <div className="text-xs text-slate-500 mb-1">{card.label}</div>
            <div className={cn('text-xl font-bold', card.color)}>{card.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[#1B3A5C] mb-3">库存汇总</h3>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className={thCls}>材料名称</th>
              <th className={thCls}>单位</th>
              <th className={thCls}>入库量</th>
              <th className={thCls}>出库量</th>
              <th className={thCls}>退库量</th>
              <th className={thCls}>当前余量</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.map((item) => (
              <tr key={item.materialName} className="hover:bg-slate-50/60 transition-colors">
                <td className={tdCls}>{item.materialName}</td>
                <td className={tdCls}>{item.unit}</td>
                <td className={tdCls}>{item.inboundQty.toLocaleString()}</td>
                <td className={tdCls}>{item.outboundQty.toLocaleString()}</td>
                <td className={tdCls}>{item.returnQty.toLocaleString()}</td>
                <td className={cn(tdCls, item.currentQty < 0 && 'text-red-600 font-semibold')}>
                  {item.currentQty.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[#1B3A5C] mb-3">最近交易</h3>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className={thCls}>日期</th>
              <th className={thCls}>类型</th>
              <th className={thCls}>材料名称</th>
              <th className={thCls}>数量</th>
              <th className={thCls}>关联单号</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                <td className={tdCls}>{tx.date}</td>
                <td className={tdCls}>{transactionBadge(tx.type)}</td>
                <td className={tdCls}>{tx.materialName}</td>
                <td className={tdCls}>{tx.qty.toLocaleString()}</td>
                <td className={tdCls}>{tx.relatedId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function Material() {
  const [activeTab, setActiveTab] = useState<TabKey>('warehouse')
  const { warehouseIssues, subcontractorSigns, materialReturns, lossRecords, equipmentRentals } = useStore()

  const renderContent = () => {
    switch (activeTab) {
      case 'warehouse': return <WarehouseTab data={warehouseIssues} />
      case 'sign': return <SignTab data={subcontractorSigns} />
      case 'return': return <ReturnTab data={materialReturns} />
      case 'loss': return <LossTab data={lossRecords} />
      case 'rental': return <RentalTab data={equipmentRentals} />
      case 'inventory': return <InventoryTab />
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1B3A5C]">领退料管理</h1>
        <p className="text-sm text-slate-500 mt-1">材料出库、签收、退库及设备归还全流程管理</p>
      </div>

      <div className="flex gap-1 border-b border-slate-200 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors relative',
                isActive ? 'text-[#E67E22]' : 'text-slate-500 hover:text-slate-700'
              )}
            >
              <Icon size={16} />
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E67E22]" />
              )}
            </button>
          )
        })}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {activeTab !== 'rental' && activeTab !== 'inventory' ? (
          <div className="overflow-x-auto">{renderContent()}</div>
        ) : (
          <div className="p-4">{renderContent()}</div>
        )}
      </div>
    </div>
  )
}
