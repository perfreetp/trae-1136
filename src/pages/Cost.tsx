import useStore, { useDerived, CostBreakdownItem } from '@/store/useStore'
import { useState } from 'react'
import {
  LineChart, Line, ComposedChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { TrendingUp, TrendingDown, AlertTriangle, FileCheck, Archive, Search, Filter, File, FileText, Receipt } from 'lucide-react'
import { cn } from '@/lib/utils'

const priceTrendData = [
  { month: '1月', 'HRB400螺纹钢': 3680, '普通硅酸盐水泥': 398, '商品混凝土': 380, '防水卷材': 29, '电线电缆': 78, '加气混凝土砌块': 178, '钢结构构件': 8200 },
  { month: '2月', 'HRB400螺纹钢': 3740, '普通硅酸盐水泥': 405, '商品混凝土': 382, '防水卷材': 30, '电线电缆': 80, '加气混凝土砌块': 180, '钢结构构件': 8350 },
  { month: '3月', 'HRB400螺纹钢': 3790, '普通硅酸盐水泥': 412, '商品混凝土': 383, '防水卷材': 30, '电线电缆': 82, '加气混凝土砌块': 182, '钢结构构件': 8500 },
  { month: '4月', 'HRB400螺纹钢': 3850, '普通硅酸盐水泥': 418, '商品混凝土': 384, '防水卷材': 31, '电线电缆': 83, '加气混凝土砌块': 183, '钢结构构件': 8600 },
  { month: '5月', 'HRB400螺纹钢': 3920, '普通硅酸盐水泥': 425, '商品混凝土': 382, '防水卷材': 33, '电线电缆': 86, '加气混凝土砌块': 186, '钢结构构件': 8700 },
  { month: '6月', 'HRB400螺纹钢': 4120, '普通硅酸盐水泥': 445, '商品混凝土': 378, '防水卷材': 35, '电线电缆': 91, '加气混凝土砌块': 192, '钢结构构件': 8880 },
]

const PIE_COLORS = ['#1B3A5C', '#E67E22', '#2ECC71', '#3498DB', '#9B59B6', '#E74C3C', '#1ABC9C', '#F39C12']
const LINE_COLORS = ['#E74C3C', '#E67E22', '#2ECC71', '#3498DB', '#9B59B6', '#1ABC9C', '#F39C12']
const MATERIALS = ['HRB400螺纹钢', '普通硅酸盐水泥', '商品混凝土', '防水卷材', '电线电缆', '加气混凝土砌块', '钢结构构件']
const tabs = ['价格波动提醒', '项目成本看板', '审批记录', '资料归档']
const docCategories = ['全部', '合同', '发票', '验收单', '其他']
const actionColors: Record<string, string> = { '提交': 'bg-blue-100 text-blue-700', '审批通过': 'bg-green-100 text-green-700', '驳回': 'bg-red-100 text-red-700' }
const categoryIcons: Record<string, typeof File> = { '合同': FileText, '发票': Receipt, '验收单': FileCheck, '其他': File }
const formatWan = (v: number) => (v / 10000).toFixed(1)

export default function Cost() {
  const [activeTab, setActiveTab] = useState(0)
  const { priceAlerts, approvalRecords, documentArchives } = useStore()
  const { costByCategory, costTrend, totalContractAmount, totalPaidAmount, totalPendingPayment, costBreakdown } = useDerived()
  const [docCategory, setDocCategory] = useState('全部')
  const [docSearch, setDocSearch] = useState('')
  const avgPrice = Math.round(priceTrendData.reduce((s, d) => s + d['HRB400螺纹钢'], 0) / priceTrendData.length)
  const filteredDocs = documentArchives.filter(d =>
    (docCategory === '全部' || d.category === docCategory) &&
    d.name.toLowerCase().includes(docSearch.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={cn(
              'px-6 py-3 text-sm font-medium transition-colors relative',
              activeTab === i ? 'text-[#1B3A5C]' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab}
            {activeTab === i && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E67E22]" />}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-sm font-medium text-[#1B3A5C] mb-4">材料价格走势</h3>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={priceTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <ReferenceLine y={avgPrice} stroke="#E67E22" strokeDasharray="5 5" label={{ value: '均价', position: 'insideTopRight', fill: '#E67E22', fontSize: 12 }} />
                {MATERIALS.map((m, i) => (
                  <Line key={m} type="monotone" dataKey={m} stroke={LINE_COLORS[i]} strokeWidth={2} dot={{ r: 3 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#1B3A5C] text-white">
                <tr>
                  <th className="px-4 py-3 text-left">材料名称</th>
                  <th className="px-4 py-3 text-right">原价</th>
                  <th className="px-4 py-3 text-right">现价</th>
                  <th className="px-4 py-3 text-right">变动幅度(%)</th>
                  <th className="px-4 py-3 text-center">预警日期</th>
                  <th className="px-4 py-3 text-center">预警等级</th>
                </tr>
              </thead>
              <tbody>
                {priceAlerts.map((a, i) => (
                  <tr key={a.id} className={cn('border-b', i % 2 === 0 ? 'bg-gray-50' : 'bg-white')}>
                    <td className="px-4 py-3 font-medium">{a.materialName}</td>
                    <td className="px-4 py-3 text-right">¥{a.oldPrice.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">¥{a.newPrice.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={cn('inline-flex items-center gap-1 font-medium', a.changeRate > 0 ? 'text-red-600' : 'text-green-600')}>
                        {a.changeRate > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {a.changeRate > 0 ? '+' : ''}{a.changeRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">{a.alertDate}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                        a.level === '高' ? 'bg-red-100 text-red-700' :
                        a.level === '中' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      )}>
                        {a.level === '高' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1 animate-pulse" />}
                        {a.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-[#1B3A5C] mb-3">成本来源明细</h3>
            <div className="grid grid-cols-4 gap-4">
              {costBreakdown.map(item => {
                const accentMap: Record<string, string> = {
                  purchase: '#3B82F6',
                  payment: '#22C55E',
                  issue: '#E67E22',
                  return: '#8B5CF6',
                }
                return (
                  <div
                    key={item.source}
                    className="bg-white rounded-lg border p-4"
                    style={{ borderLeftWidth: 4, borderLeftColor: accentMap[item.source] || '#3B82F6' }}
                  >
                    <p className="text-sm font-medium text-gray-700">{item.label}</p>
                    <p className="text-lg font-bold text-[#1B3A5C] mt-1">{formatWan(item.amount)}万元</p>
                    <p className="text-xs text-gray-400 mt-1">{item.detail}</p>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-gray-400 mt-2">采购待发生 + 付款已发生 = 项目总发生成本，出库消耗为库存折算，退库冲减为退库折算</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 bg-white rounded-lg border p-6">
              <h3 className="text-sm font-medium text-[#1B3A5C] mb-4">预算与实际支出趋势</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={costTrend.map(c => ({
                  month: c.month.slice(5) + '月',
                  budget: +(c.budget / 10000).toFixed(1),
                  actual: +(c.actual / 10000).toFixed(1)
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} unit="万" />
                  <Tooltip formatter={(v: number) => `${v}万元`} />
                  <Legend />
                  <Bar dataKey="budget" name="预算" fill="#1B3A5C" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="actual" name="实际支出" stroke="#E67E22" strokeWidth={2} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-sm font-medium text-[#1B3A5C] mb-4">成本分类占比</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={costByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {costByCategory.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => `${formatWan(v)}万元`} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-sm font-medium text-[#1B3A5C] mb-3">成本汇总</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">合同总额</span>
                    <span className="text-[#1B3A5C] font-semibold">{formatWan(totalContractAmount)}万元</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">已付金额</span>
                    <span className="text-[#E67E22] font-semibold">{formatWan(totalPaidAmount)}万元</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="text-gray-500 text-sm">待付余额</span>
                    <span className="text-[#E67E22] font-semibold">
                      {formatWan(totalPendingPayment)}万元
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">数据随审批和付款实时更新</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 2 && (
        <div className="bg-white rounded-lg border p-6">
          <div className="relative">
            {approvalRecords.map((r, i) => (
              <div key={r.id} className="flex gap-4 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className={cn('w-3 h-3 rounded-full border-2 shrink-0',
                    r.action === '提交' ? 'bg-blue-500 border-blue-300' :
                    r.action === '审批通过' ? 'bg-green-500 border-green-300' :
                    'bg-red-500 border-red-300'
                  )} />
                  {i < approvalRecords.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 mt-1" />}
                </div>
                <div className="flex-1 -mt-0.5">
                  <div className="text-xs text-gray-400 mb-1">{r.createdAt}</div>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn('px-2 py-0.5 rounded text-xs font-medium', actionColors[r.action])}>
                        {r.action}
                      </span>
                      <span className="text-sm font-medium text-[#1B3A5C]">{r.operator}</span>
                      <span className="text-xs text-gray-400">{r.role}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{r.comment}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <FileCheck className="w-3 h-3" />
                      {r.relatedType} - {r.relatedId}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 3 && (
        <div className="space-y-4">
          <div className="flex gap-3 items-center">
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={docCategory}
                onChange={e => setDocCategory(e.target.value)}
                className="pl-9 pr-8 py-2 border rounded-lg text-sm bg-white appearance-none"
              >
                {docCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={docSearch}
                onChange={e => setDocSearch(e.target.value)}
                placeholder="搜索资料..."
                className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredDocs.map(d => {
              const Icon = categoryIcons[d.category] || File
              return (
                <div key={d.id} className="bg-white rounded-lg border p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-[#1B3A5C]/5 rounded-lg">
                      <Icon className="w-5 h-5 text-[#1B3A5C]" />
                    </div>
                    <span className={cn('px-2 py-0.5 rounded text-xs font-medium',
                      d.category === '合同' ? 'bg-blue-100 text-blue-700' :
                      d.category === '发票' ? 'bg-orange-100 text-orange-700' :
                      d.category === '验收单' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    )}>
                      {d.category}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[#1B3A5C] truncate mb-2">{d.name}</p>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{d.fileSize}</span>
                    <span>{d.uploadDate}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
