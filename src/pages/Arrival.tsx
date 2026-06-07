import useStore from '@/store/useStore'
import { useState } from 'react'
import { Calendar, CheckCircle, XCircle, AlertCircle, Clock, MapPin, Truck } from 'lucide-react'
import { cn } from '@/lib/utils'

type TabKey = 'appointment' | 'acceptance'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'appointment', label: '到场预约' },
  { key: 'acceptance', label: '现场验收' },
]

const apptStatusConfig: Record<string, { bg: string; text: string }> = {
  待确认: { bg: 'bg-orange-100', text: 'text-orange-700' },
  已确认: { bg: 'bg-blue-100', text: 'text-blue-700' },
  已到场: { bg: 'bg-green-100', text: 'text-green-700' },
}

const acceptStatusConfig: Record<string, { bg: string; text: string }> = {
  合格: { bg: 'bg-green-100', text: 'text-green-700' },
  部分合格: { bg: 'bg-orange-100', text: 'text-orange-700' },
  不合格: { bg: 'bg-red-100', text: 'text-red-700' },
}

export default function Arrival() {
  const { arrivalAppointments, siteAcceptances } = useStore()
  const [activeTab, setActiveTab] = useState<TabKey>('appointment')
  const [appointments, setAppointments] = useState(arrivalAppointments)

  const apptCounts = {
    待确认: appointments.filter(a => a.status === '待确认').length,
    已确认: appointments.filter(a => a.status === '已确认').length,
    已到场: appointments.filter(a => a.status === '已到场').length,
  }

  const acceptCounts = {
    合格: siteAcceptances.filter(a => a.status === '合格').length,
    部分合格: siteAcceptances.filter(a => a.status === '部分合格').length,
    不合格: siteAcceptances.filter(a => a.status === '不合格').length,
  }

  const handleApptAction = (id: string) => {
    setAppointments(prev =>
      prev.map(a => {
        if (a.id !== id) return a
        if (a.status === '待确认') return { ...a, status: '已确认' as const }
        if (a.status === '已确认') return { ...a, status: '已到场' as const }
        return a
      })
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-0 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-6 py-3 text-sm font-medium transition-colors relative',
              activeTab === tab.key ? 'text-[#1B3A5C]' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E67E22]" />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'appointment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: '待确认', count: apptCounts.待确认, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
              { label: '已确认', count: apptCounts.已确认, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
              { label: '已到场', count: apptCounts.已到场, icon: Truck, color: 'text-green-500', bg: 'bg-green-50' },
            ].map(card => (
              <div key={card.label} className="rounded-lg border border-gray-200 bg-white p-4 flex items-center gap-4">
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', card.bg)}>
                  <card.icon className={cn('w-5 h-5', card.color)} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1B3A5C]">{card.count}</p>
                  <p className="text-xs text-gray-500">{card.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 text-gray-600 font-medium">预约编号</th>
                  <th className="px-4 py-3 text-gray-600 font-medium">材料名称</th>
                  <th className="px-4 py-3 text-gray-600 font-medium">预约日期</th>
                  <th className="px-4 py-3 text-gray-600 font-medium">预约时间</th>
                  <th className="px-4 py-3 text-gray-600 font-medium">卸货位置</th>
                  <th className="px-4 py-3 text-gray-600 font-medium">状态</th>
                  <th className="px-4 py-3 text-gray-600 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-[#1B3A5C] font-medium">{a.id}</td>
                    <td className="px-4 py-3">{a.materialName}</td>
                    <td className="px-4 py-3">{a.scheduledDate}</td>
                    <td className="px-4 py-3">{a.scheduledTime}</td>
                    <td className="px-4 py-3 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400" />{a.location}</td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', apptStatusConfig[a.status].bg, apptStatusConfig[a.status].text)}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {a.status === '待确认' && (
                        <button onClick={() => handleApptAction(a.id)} className="px-3 py-1 rounded text-xs font-medium text-white bg-green-600 hover:bg-green-700">
                          确认
                        </button>
                      )}
                      {a.status === '已确认' && (
                        <button onClick={() => handleApptAction(a.id)} className="px-3 py-1 rounded text-xs font-medium text-white bg-blue-600 hover:bg-blue-700">
                          到场
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'acceptance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: '合格', count: acceptCounts.合格, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
              { label: '部分合格', count: acceptCounts.部分合格, icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
              { label: '不合格', count: acceptCounts.不合格, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
            ].map(card => (
              <div key={card.label} className="rounded-lg border border-gray-200 bg-white p-4 flex items-center gap-4">
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', card.bg)}>
                  <card.icon className={cn('w-5 h-5', card.color)} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1B3A5C]">{card.count}</p>
                  <p className="text-xs text-gray-500">{card.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 text-gray-600 font-medium">验收编号</th>
                  <th className="px-4 py-3 text-gray-600 font-medium">材料名称</th>
                  <th className="px-4 py-3 text-gray-600 font-medium">订货量</th>
                  <th className="px-4 py-3 text-gray-600 font-medium">到货量</th>
                  <th className="px-4 py-3 text-gray-600 font-medium">合格量</th>
                  <th className="px-4 py-3 text-gray-600 font-medium">问题描述</th>
                  <th className="px-4 py-3 text-gray-600 font-medium">验收结果</th>
                </tr>
              </thead>
              <tbody>
                {siteAcceptances.map(a => (
                  <tr key={a.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-[#1B3A5C] font-medium">{a.id}</td>
                    <td className="px-4 py-3">{a.materialName}</td>
                    <td className="px-4 py-3">{a.orderedQty}</td>
                    <td className={cn('px-4 py-3', a.receivedQty < a.orderedQty && 'text-red-600 font-medium')}>{a.receivedQty}</td>
                    <td className={cn('px-4 py-3', a.qualifiedQty < a.orderedQty && 'text-orange-600 font-medium')}>{a.qualifiedQty}</td>
                    <td className="px-4 py-3 max-w-[200px]">
                      {a.issue ? (
                        <span title={a.issue} className="truncate block cursor-help text-gray-600">{a.issue}</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', acceptStatusConfig[a.status].bg, acceptStatusConfig[a.status].text)}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
