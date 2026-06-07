import useStore, { useDerived } from '@/store/useStore'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Wallet, ShoppingCart, CheckCircle, RefreshCw, AlertTriangle, Clock, ArrowRight, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const statusColors: Record<string, string> = {
  '施工中': 'bg-green-500',
  '筹备中': 'bg-orange-400',
  '收尾中': 'bg-yellow-500',
}

const fmt = (v: number) => (v / 10000).toFixed(1)

const accentColor = (v: number) =>
  v > 80 ? 'bg-green-500' : v >= 60 ? 'bg-orange-500' : 'bg-red-500'

const alertLevelColor: Record<string, string> = {
  '高': 'bg-red-500 text-white',
  '中': 'bg-orange-500 text-white',
  '低': 'bg-yellow-400 text-gray-800',
}

export default function Overview() {
  const {
    projects, monthlyArrival, monthlyIssue, monthlyReturn,
    purchaseRequests, warehouseIssues, subcontractorSigns, paymentRequests,
    priceAlerts,
  } = useStore()
  const { budgetExecutionRate, purchaseCompletionRate, acceptancePassRate, inventoryTurnoverRate } = useDerived()

  const project = projects[0]

  const chartData = monthlyArrival.map((a, i) => ({
    month: a.month.slice(5),
    到场: Number(fmt(a.value)),
    出库: Number(fmt(monthlyIssue[i].value)),
    退库: Number(fmt(monthlyReturn[i].value)),
  }))

  const budgetPercent = ((project.spentTotal / project.budgetTotal) * 100).toFixed(1)

  const todoItems = [
    ...purchaseRequests.filter(r => r.status === '待审批').map(r => ({
      type: '采购审批', color: 'bg-blue-500', title: `${r.materialName} x${r.qty}`, date: r.createdAt,
    })),
    ...warehouseIssues.filter(w => w.status === '待审核').map(w => ({
      type: '出库审核', color: 'bg-purple-500', title: `${w.materialName} → ${w.subcontractorName}`, date: w.issuedDate,
    })),
    ...subcontractorSigns.filter(s => s.status === '待签收').map(s => ({
      type: '物资签收', color: 'bg-teal-500', title: `${s.materialName} → ${s.subcontractorName}`, date: s.signedDate || '—',
    })),
    ...paymentRequests.filter(p => p.status === '待审批').map(p => ({
      type: '付款审批', color: 'bg-amber-500', title: p.reason, date: p.createdAt,
    })),
  ].slice(0, 6)

  const kpiCards = [
    { label: '预算执行率', value: budgetExecutionRate, icon: Wallet, color: '#1B3A5C' },
    { label: '采购完成率', value: purchaseCompletionRate, icon: ShoppingCart, color: '#E67E22' },
    { label: '验收合格率', value: acceptancePassRate, icon: CheckCircle, color: '#27AE60' },
    { label: '库存周转率', value: inventoryTurnoverRate, icon: RefreshCw, color: '#8E44AD' },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">

      <div className="col-span-2 rounded-lg p-5 text-white" style={{ background: '#1B3A5C' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">{project.name}</h2>
            <p className="text-sm opacity-70 mt-1">{project.code}</p>
          </div>
          <span className={cn('px-3 py-1 rounded-full text-xs font-medium', statusColors[project.status] || 'bg-gray-500')}>
            {project.status}
          </span>
        </div>
        <div className="flex gap-6 text-sm opacity-80 mb-4">
          <span className="flex items-center gap-1"><Clock size={14} /> {project.startDate}</span>
          <span>至</span>
          <span>{project.endDate}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div><p className="text-xs opacity-60">预算总额</p><p className="text-lg font-semibold">{fmt(project.budgetTotal)} 万元</p></div>
          <div><p className="text-xs opacity-60">已执行</p><p className="text-lg font-semibold">{fmt(project.spentTotal)} 万元</p></div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2.5">
          <div className="bg-[#E67E22] h-2.5 rounded-full" style={{ width: `${Math.min(Number(budgetPercent), 100)}%` }} />
        </div>
        <p className="text-xs opacity-60 mt-1 text-right">执行率 {budgetPercent}%</p>
      </div>

      <div className="col-span-2 grid grid-cols-4 gap-3">
        {kpiCards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow overflow-hidden">
            <div className={cn('h-1', accentColor(card.value))} />
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <card.icon size={16} style={{ color: card.color }} />
                <span className="text-xs text-gray-500">{card.label}</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#1B3A5C' }}>{card.value}%</p>
            </div>
          </div>
        ))}
      </div>

      <div className="col-span-2 bg-white rounded-lg shadow p-5">
        <div className="mb-1">
          <h3 className="text-base font-semibold" style={{ color: '#1B3A5C' }}>物资流转概况</h3>
          <p className="text-xs text-gray-400">近6个月数据统计</p>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} unit="万" />
            <Tooltip />
            <Legend />
            <Bar dataKey="到场" fill="#1B3A5C" radius={[2, 2, 0, 0]} />
            <Bar dataKey="出库" fill="#E67E22" radius={[2, 2, 0, 0]} />
            <Bar dataKey="退库" fill="#95A5A6" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="col-span-2 bg-white rounded-lg shadow p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold" style={{ color: '#1B3A5C' }}>待办事项</h3>
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{todoItems.length}</span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </div>
        <div className="space-y-2">
          {todoItems.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors">
              <span className={cn('text-xs px-2 py-0.5 rounded text-white', item.color)}>{item.type}</span>
              <span className="text-sm flex-1 truncate" style={{ color: '#2C3E50' }}>{item.title}</span>
              <span className="text-xs text-gray-400">{item.date}</span>
              <ChevronRight size={14} className="text-gray-300" />
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-4 bg-white rounded-lg shadow p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={16} className="text-orange-500" />
          <h3 className="text-base font-semibold" style={{ color: '#1B3A5C' }}>预警提醒</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {priceAlerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                'flex-shrink-0 w-52 border rounded-lg p-3',
                alert.level === '高' && 'animate-pulse'
              )}
              style={{ borderColor: alert.level === '高' ? '#EF4444' : alert.level === '中' ? '#E67E22' : '#FACC15' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: '#2C3E50' }}>{alert.materialName}</span>
                <span className={cn('text-xs px-1.5 py-0.5 rounded', alertLevelColor[alert.level])}>{alert.level}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-gray-400">¥{alert.oldPrice}</span>
                <ArrowRight size={12} className="text-gray-400" />
                <span className="font-semibold" style={{ color: alert.changeRate > 0 ? '#EF4444' : '#27AE60' }}>¥{alert.newPrice}</span>
              </div>
              <p className={cn('text-xs mt-1 font-medium', alert.changeRate > 0 ? 'text-red-500' : 'text-green-500')}>
                {alert.changeRate > 0 ? '↑' : '↓'} {Math.abs(alert.changeRate)}%
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
