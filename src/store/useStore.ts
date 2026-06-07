import { create } from 'zustand'

export interface ProjectInfo {
  id: string
  name: string
  code: string
  startDate: string
  endDate: string
  status: string
  budgetTotal: number
  spentTotal: number
}

export interface MaterialPlan {
  id: string
  projectId: string
  materialName: string
  specification: string
  unit: string
  plannedQty: number
  budgetQty: number
  purchasedQty: number
  usedQty: number
  month: string
}

export interface PurchaseRequest {
  id: string
  projectId: string
  planId: string
  materialName: string
  qty: number
  status: '待审批' | '已审批' | '已驳回' | '已采购'
  createdAt: string
  approvedBy: string
}

export interface SupplierQuote {
  id: string
  requestId: string
  supplierName: string
  unitPrice: number
  totalPrice: number
  deliveryDays: number
  quoteDate: string
}

export interface Contract {
  id: string
  projectId: string
  contractNo: string
  supplierName: string
  amount: number
  paidAmount: number
  signDate: string
  status: '履行中' | '已完成' | '已终止'
}

export interface ArrivalAppointment {
  id: string
  contractId: string
  materialName: string
  scheduledDate: string
  scheduledTime: string
  location: string
  status: '待确认' | '已确认' | '已到场'
}

export interface SiteAcceptance {
  id: string
  appointmentId: string
  materialName: string
  orderedQty: number
  receivedQty: number
  qualifiedQty: number
  issue: string
  status: '合格' | '部分合格' | '不合格'
}

export interface WarehouseIssue {
  id: string
  acceptanceId: string
  subcontractorName: string
  materialName: string
  issuedQty: number
  issuedDate: string
  status: '待审核' | '已出库'
}

export interface SubcontractorSign {
  id: string
  issueId: string
  subcontractorName: string
  materialName: string
  signedQty: number
  signedDate: string
  status: '待签收' | '已签收'
}

export interface MaterialReturn {
  id: string
  issueId: string
  materialName: string
  returnQty: number
  reason: string
  returnDate: string
  status: '待验收' | '已入库'
}

export interface LossRecord {
  id: string
  issueId: string
  materialName: string
  lossQty: number
  lossRate: number
  reason: string
  recordedDate: string
}

export interface EquipmentRental {
  id: string
  contractId: string
  equipmentName: string
  rentalStart: string
  rentalEnd: string
  dailyRate: number
  status: '在租' | '已归还' | '逾期未还'
}

export interface Invoice {
  id: string
  contractId: string
  invoiceNo: string
  amount: number
  issueDate: string
  matchedStatus: '未匹配' | '已匹配'
}

export interface PaymentRequest {
  id: string
  contractId: string
  amount: number
  reason: string
  status: '待审批' | '已审批' | '已驳回' | '已支付'
  createdAt: string
}

export interface ApprovalRecord {
  id: string
  relatedType: string
  relatedId: string
  action: '提交' | '审批通过' | '采购推进' | '驳回'
  operator: string
  role: string
  comment: string
  createdAt: string
}

export interface PriceAlert {
  id: string
  materialName: string
  oldPrice: number
  newPrice: number
  changeRate: number
  alertDate: string
  level: '高' | '中' | '低'
}

export interface DocumentArchive {
  id: string
  name: string
  category: '合同' | '发票' | '验收单' | '其他'
  fileSize: string
  uploadDate: string
  relatedId: string
}

export interface MonthlyStat {
  month: string
  value: number
}

export interface CostByCategory {
  name: string
  value: number
}

export interface CostTrend {
  month: string
  budget: number
  actual: number
}

const projects: ProjectInfo[] = [
  { id: 'P001', name: '滨江新城一期工程', code: 'BJ-XC-2025-001', startDate: '2025-03-01', endDate: '2026-12-31', status: '施工中', budgetTotal: 50000000, spentTotal: 32456800 },
  { id: 'P002', name: '翠湖花园住宅项目', code: 'CH-HY-2025-002', startDate: '2025-05-15', endDate: '2027-06-30', status: '施工中', budgetTotal: 38000000, spentTotal: 18520000 },
  { id: 'P003', name: '东方商业广场', code: 'DF-SY-2024-003', startDate: '2024-09-01', endDate: '2026-03-31', status: '收尾中', budgetTotal: 62000000, spentTotal: 58760000 },
  { id: 'P004', name: '科技创新产业园', code: 'KJ-CY-2025-004', startDate: '2025-07-01', endDate: '2027-12-31', status: '筹备中', budgetTotal: 45000000, spentTotal: 3200000 },
  { id: 'P005', name: '城南安置房项目', code: 'CN-AZ-2024-005', startDate: '2024-06-01', endDate: '2026-05-31', status: '施工中', budgetTotal: 28000000, spentTotal: 21350000 },
  { id: 'P006', name: '龙腾大道改造工程', code: 'LT-DD-2025-006', startDate: '2025-01-10', endDate: '2026-08-31', status: '施工中', budgetTotal: 15000000, spentTotal: 9870000 },
]

const materialPlans: MaterialPlan[] = [
  { id: 'MP001', projectId: 'P001', materialName: 'HRB400螺纹钢', specification: 'Φ25', unit: '吨', plannedQty: 1200, budgetQty: 1200, purchasedQty: 980, usedQty: 860, month: '2026-01' },
  { id: 'MP002', projectId: 'P001', materialName: '普通硅酸盐水泥', specification: 'P.O 42.5', unit: '吨', plannedQty: 3500, budgetQty: 3500, purchasedQty: 2800, usedQty: 2650, month: '2026-01' },
  { id: 'MP003', projectId: 'P001', materialName: '商品混凝土', specification: 'C30', unit: 'm³', plannedQty: 8000, budgetQty: 8000, purchasedQty: 6200, usedQty: 5800, month: '2026-02' },
  { id: 'MP004', projectId: 'P001', materialName: '防水卷材', specification: 'SBS 4mm', unit: 'm²', plannedQty: 12000, budgetQty: 12000, purchasedQty: 8500, usedQty: 7200, month: '2026-03' },
  { id: 'MP005', projectId: 'P002', materialName: 'HRB400螺纹钢', specification: 'Φ20', unit: '吨', plannedQty: 800, budgetQty: 800, purchasedQty: 520, usedQty: 480, month: '2026-01' },
  { id: 'MP006', projectId: 'P002', materialName: '加气混凝土砌块', specification: 'A5.0 B07', unit: 'm³', plannedQty: 4500, budgetQty: 4500, purchasedQty: 3200, usedQty: 2800, month: '2026-02' },
  { id: 'MP007', projectId: 'P001', materialName: '电线电缆', specification: 'YJV 3×70', unit: '米', plannedQty: 15000, budgetQty: 15000, purchasedQty: 10000, usedQty: 8500, month: '2026-04' },
  { id: 'MP008', projectId: 'P003', materialName: '钢结构构件', specification: 'H型钢 Q345B', unit: '吨', plannedQty: 600, budgetQty: 600, purchasedQty: 580, usedQty: 560, month: '2026-01' },
]

const purchaseRequests: PurchaseRequest[] = [
  { id: 'PR001', projectId: 'P001', planId: 'MP001', materialName: 'HRB400螺纹钢', qty: 220, status: '待审批', createdAt: '2026-05-28', approvedBy: '' },
  { id: 'PR002', projectId: 'P001', planId: 'MP002', materialName: '普通硅酸盐水泥', qty: 700, status: '已审批', createdAt: '2026-05-25', approvedBy: '王建国' },
  { id: 'PR003', projectId: 'P001', planId: 'MP003', materialName: '商品混凝土', qty: 1800, status: '已采购', createdAt: '2026-05-20', approvedBy: '王建国' },
  { id: 'PR004', projectId: 'P002', planId: 'MP005', materialName: 'HRB400螺纹钢', qty: 280, status: '已驳回', createdAt: '2026-05-22', approvedBy: '李明辉' },
  { id: 'PR005', projectId: 'P001', planId: 'MP004', materialName: '防水卷材', qty: 3500, status: '待审批', createdAt: '2026-06-01', approvedBy: '' },
  { id: 'PR006', projectId: 'P002', planId: 'MP006', materialName: '加气混凝土砌块', qty: 1300, status: '已审批', createdAt: '2026-05-30', approvedBy: '赵德强' },
  { id: 'PR007', projectId: 'P003', planId: 'MP008', materialName: '钢结构构件', qty: 20, status: '已采购', createdAt: '2026-05-15', approvedBy: '王建国' },
  { id: 'PR008', projectId: 'P001', planId: 'MP007', materialName: '电线电缆', qty: 5000, status: '待审批', createdAt: '2026-06-03', approvedBy: '' },
]

const supplierQuotes: SupplierQuote[] = [
  { id: 'SQ001', requestId: 'PR001', supplierName: '中钢集团华东分公司', unitPrice: 3850, totalPrice: 847000, deliveryDays: 7, quoteDate: '2026-05-29' },
  { id: 'SQ002', requestId: 'PR001', supplierName: '沙钢集团贸易有限公司', unitPrice: 3780, totalPrice: 831600, deliveryDays: 10, quoteDate: '2026-05-29' },
  { id: 'SQ003', requestId: 'PR002', supplierName: '海螺水泥销售公司', unitPrice: 420, totalPrice: 294000, deliveryDays: 3, quoteDate: '2026-05-26' },
  { id: 'SQ004', requestId: 'PR002', supplierName: '华润水泥控股有限公司', unitPrice: 435, totalPrice: 304500, deliveryDays: 5, quoteDate: '2026-05-26' },
  { id: 'SQ005', requestId: 'PR003', supplierName: '中建商混科技有限公司', unitPrice: 385, totalPrice: 693000, deliveryDays: 2, quoteDate: '2026-05-21' },
  { id: 'SQ006', requestId: 'PR005', supplierName: '东方雨虹防水技术公司', unitPrice: 32, totalPrice: 112000, deliveryDays: 5, quoteDate: '2026-06-02' },
  { id: 'SQ007', requestId: 'PR005', supplierName: '科顺防水科技股份有限公司', unitPrice: 30, totalPrice: 105000, deliveryDays: 7, quoteDate: '2026-06-02' },
  { id: 'SQ008', requestId: 'PR006', supplierName: '旭建新型材料有限公司', unitPrice: 185, totalPrice: 240500, deliveryDays: 4, quoteDate: '2026-05-31' },
]

const contracts: Contract[] = [
  { id: 'CT001', projectId: 'P001', contractNo: 'BJ-XC-HT-2025-001', supplierName: '中钢集团华东分公司', amount: 4620000, paidAmount: 3773000, signDate: '2025-03-15', status: '履行中' },
  { id: 'CT002', projectId: 'P001', contractNo: 'BJ-XC-HT-2025-002', supplierName: '海螺水泥销售公司', amount: 1470000, paidAmount: 1176000, signDate: '2025-04-01', status: '履行中' },
  { id: 'CT003', projectId: 'P001', contractNo: 'BJ-XC-HT-2025-003', supplierName: '中建商混科技有限公司', amount: 3080000, paidAmount: 2395000, signDate: '2025-04-10', status: '履行中' },
  { id: 'CT004', projectId: 'P002', contractNo: 'CH-HY-HT-2025-001', supplierName: '沙钢集团贸易有限公司', amount: 2268000, paidAmount: 1474000, signDate: '2025-06-20', status: '履行中' },
  { id: 'CT005', projectId: 'P003', contractNo: 'DF-SY-HT-2024-001', supplierName: '宝钢钢结构有限公司', amount: 5400000, paidAmount: 5130000, signDate: '2024-09-25', status: '已完成' },
  { id: 'CT006', projectId: 'P005', contractNo: 'CN-AZ-HT-2024-001', supplierName: '华润水泥控股有限公司', amount: 1890000, paidAmount: 1512000, signDate: '2024-07-10', status: '履行中' },
  { id: 'CT007', projectId: 'P001', contractNo: 'BJ-XC-HT-2025-004', supplierName: '东方雨虹防水技术公司', amount: 384000, paidAmount: 230400, signDate: '2025-08-05', status: '履行中' },
  { id: 'CT008', projectId: 'P006', contractNo: 'LT-DD-HT-2025-001', supplierName: '中建商混科技有限公司', amount: 960000, paidAmount: 672000, signDate: '2025-02-15', status: '已终止' },
]

const arrivalAppointments: ArrivalAppointment[] = [
  { id: 'AA001', contractId: 'CT001', materialName: 'HRB400螺纹钢', scheduledDate: '2026-06-05', scheduledTime: '08:00', location: '滨江新城一期工地A区', status: '待确认' },
  { id: 'AA002', contractId: 'CT002', materialName: '普通硅酸盐水泥', scheduledDate: '2026-06-03', scheduledTime: '09:30', location: '滨江新城一期工地B区', status: '已确认' },
  { id: 'AA003', contractId: 'CT003', materialName: '商品混凝土', scheduledDate: '2026-06-02', scheduledTime: '07:00', location: '滨江新城一期工地A区', status: '已到场' },
  { id: 'AA004', contractId: 'CT004', materialName: 'HRB400螺纹钢', scheduledDate: '2026-06-08', scheduledTime: '10:00', location: '翠湖花园工地', status: '待确认' },
  { id: 'AA005', contractId: 'CT006', materialName: '普通硅酸盐水泥', scheduledDate: '2026-05-30', scheduledTime: '08:30', location: '城南安置房工地', status: '已到场' },
  { id: 'AA006', contractId: 'CT001', materialName: 'HRB400螺纹钢', scheduledDate: '2026-05-28', scheduledTime: '09:00', location: '滨江新城一期工地A区', status: '已到场' },
  { id: 'AA007', contractId: 'CT007', materialName: '防水卷材', scheduledDate: '2026-06-10', scheduledTime: '08:00', location: '滨江新城一期工地C区', status: '待确认' },
]

const siteAcceptances: SiteAcceptance[] = [
  { id: 'SA001', appointmentId: 'AA003', materialName: '商品混凝土', orderedQty: 200, receivedQty: 200, qualifiedQty: 198, issue: '', status: '合格' },
  { id: 'SA002', appointmentId: 'AA006', materialName: 'HRB400螺纹钢', orderedQty: 80, receivedQty: 80, qualifiedQty: 80, issue: '', status: '合格' },
  { id: 'SA003', appointmentId: 'AA005', materialName: '普通硅酸盐水泥', orderedQty: 150, receivedQty: 148, qualifiedQty: 142, issue: '2袋包装破损，6袋受潮结块', status: '部分合格' },
  { id: 'SA004', appointmentId: 'AA003', materialName: '商品混凝土', orderedQty: 180, receivedQty: 175, qualifiedQty: 175, issue: '到货量不足5m³，供应商承诺补发', status: '合格' },
  { id: 'SA005', appointmentId: 'AA006', materialName: 'HRB400螺纹钢', orderedQty: 60, receivedQty: 60, qualifiedQty: 58, issue: '2根表面锈蚀严重，已退回', status: '部分合格' },
  { id: 'SA006', appointmentId: 'AA005', materialName: '普通硅酸盐水泥', orderedQty: 200, receivedQty: 200, qualifiedQty: 200, issue: '', status: '合格' },
  { id: 'SA007', appointmentId: 'AA003', materialName: '商品混凝土', orderedQty: 150, receivedQty: 150, qualifiedQty: 148, issue: '2m³坍落度不达标', status: '合格' },
  { id: 'SA008', appointmentId: 'AA006', materialName: 'HRB400螺纹钢', orderedQty: 100, receivedQty: 95, qualifiedQty: 90, issue: '到货不足且5根力学性能不合格', status: '部分合格' },
]

const warehouseIssues: WarehouseIssue[] = [
  { id: 'WI001', acceptanceId: 'SA001', subcontractorName: '中建三局第一分公司', materialName: '商品混凝土', issuedQty: 180, issuedDate: '2026-06-02', status: '已出库' },
  { id: 'WI002', acceptanceId: 'SA002', subcontractorName: '中铁十二局集团', materialName: 'HRB400螺纹钢', issuedQty: 75, issuedDate: '2026-05-29', status: '已出库' },
  { id: 'WI003', acceptanceId: 'SA003', subcontractorName: '江苏华建建设公司', materialName: '普通硅酸盐水泥', issuedQty: 130, issuedDate: '2026-05-31', status: '待审核' },
  { id: 'WI004', acceptanceId: 'SA004', subcontractorName: '中建三局第一分公司', materialName: '商品混凝土', issuedQty: 160, issuedDate: '2026-06-03', status: '已出库' },
  { id: 'WI005', acceptanceId: 'SA005', subcontractorName: '中铁十二局集团', materialName: 'HRB400螺纹钢', issuedQty: 55, issuedDate: '2026-06-01', status: '已出库' },
  { id: 'WI006', acceptanceId: 'SA006', subcontractorName: '江苏华建建设公司', materialName: '普通硅酸盐水泥', issuedQty: 180, issuedDate: '2026-06-02', status: '待审核' },
]

const subcontractorSigns: SubcontractorSign[] = [
  { id: 'SS001', issueId: 'WI001', subcontractorName: '中建三局第一分公司', materialName: '商品混凝土', signedQty: 180, signedDate: '2026-06-02', status: '已签收' },
  { id: 'SS002', issueId: 'WI002', subcontractorName: '中铁十二局集团', materialName: 'HRB400螺纹钢', signedQty: 75, signedDate: '2026-05-29', status: '已签收' },
  { id: 'SS003', issueId: 'WI004', subcontractorName: '中建三局第一分公司', materialName: '商品混凝土', signedQty: 155, signedDate: '2026-06-03', status: '已签收' },
  { id: 'SS004', issueId: 'WI005', subcontractorName: '中铁十二局集团', materialName: 'HRB400螺纹钢', signedQty: 55, signedDate: '2026-06-01', status: '已签收' },
  { id: 'SS005', issueId: 'WI003', subcontractorName: '江苏华建建设公司', materialName: '普通硅酸盐水泥', signedQty: 0, signedDate: '', status: '待签收' },
  { id: 'SS006', issueId: 'WI006', subcontractorName: '江苏华建建设公司', materialName: '普通硅酸盐水泥', signedQty: 0, signedDate: '', status: '待签收' },
]

const materialReturns: MaterialReturn[] = [
  { id: 'MR001', issueId: 'WI001', materialName: '商品混凝土', returnQty: 15, reason: '浇筑余料退回', returnDate: '2026-06-03', status: '已入库' },
  { id: 'MR002', issueId: 'WI002', materialName: 'HRB400螺纹钢', returnQty: 8, reason: '下料剩余退库', returnDate: '2026-06-02', status: '已入库' },
  { id: 'MR003', issueId: 'WI005', materialName: 'HRB400螺纹钢', returnQty: 3, reason: '规格不符退库', returnDate: '2026-06-04', status: '待验收' },
  { id: 'MR004', issueId: 'WI004', materialName: '商品混凝土', returnQty: 10, reason: '浇筑余料退回', returnDate: '2026-06-04', status: '待验收' },
  { id: 'MR005', issueId: 'WI002', materialName: 'HRB400螺纹钢', returnQty: 5, reason: '质量不合格退库', returnDate: '2026-05-30', status: '已入库' },
]

const lossRecords: LossRecord[] = [
  { id: 'LR001', issueId: 'WI001', materialName: '商品混凝土', lossQty: 5, lossRate: 2.8, reason: '运输过程坍落度损失', recordedDate: '2026-06-02' },
  { id: 'LR002', issueId: 'WI002', materialName: 'HRB400螺纹钢', lossQty: 2, lossRate: 2.7, reason: '切割损耗', recordedDate: '2026-05-30' },
  { id: 'LR003', issueId: 'WI003', materialName: '普通硅酸盐水泥', lossQty: 8, lossRate: 6.2, reason: '受潮结块报废', recordedDate: '2026-06-01' },
  { id: 'LR004', issueId: 'WI004', materialName: '商品混凝土', lossQty: 3, lossRate: 1.9, reason: '泵送损耗', recordedDate: '2026-06-03' },
  { id: 'LR005', issueId: 'WI005', materialName: 'HRB400螺纹钢', lossQty: 3, lossRate: 5.5, reason: '锈蚀报废', recordedDate: '2026-06-02' },
  { id: 'LR006', issueId: 'WI006', materialName: '普通硅酸盐水泥', lossQty: 5, lossRate: 2.8, reason: '搬运散落损耗', recordedDate: '2026-06-03' },
]

const equipmentRentals: EquipmentRental[] = [
  { id: 'ER001', contractId: 'CT001', equipmentName: '塔式起重机 TC6015', rentalStart: '2025-04-01', rentalEnd: '2026-06-30', dailyRate: 1800, status: '在租' },
  { id: 'ER002', contractId: 'CT003', equipmentName: '混凝土泵车 56米', rentalStart: '2025-05-10', rentalEnd: '2026-05-10', dailyRate: 3200, status: '逾期未还' },
  { id: 'ER003', contractId: 'CT004', equipmentName: '施工电梯 SC200', rentalStart: '2025-07-01', rentalEnd: '2026-10-31', dailyRate: 950, status: '在租' },
  { id: 'ER004', contractId: 'CT005', equipmentName: '履带吊 SCC1000A', rentalStart: '2024-10-01', rentalEnd: '2025-12-31', dailyRate: 4500, status: '已归还' },
  { id: 'ER005', contractId: 'CT001', equipmentName: '物料提升机 SSD100', rentalStart: '2025-06-15', rentalEnd: '2026-08-15', dailyRate: 600, status: '在租' },
  { id: 'ER006', contractId: 'CT006', equipmentName: '塔式起重机 TC5610', rentalStart: '2024-08-01', rentalEnd: '2026-04-30', dailyRate: 1500, status: '逾期未还' },
]

const invoices: Invoice[] = [
  { id: 'IV001', contractId: 'CT001', invoiceNo: 'FP202603001', amount: 3773000, issueDate: '2026-03-20', matchedStatus: '已匹配' },
  { id: 'IV002', contractId: 'CT002', invoiceNo: 'FP202604002', amount: 1176000, issueDate: '2026-04-15', matchedStatus: '已匹配' },
  { id: 'IV003', contractId: 'CT003', invoiceNo: 'FP202605003', amount: 1200000, issueDate: '2026-05-10', matchedStatus: '未匹配' },
  { id: 'IV004', contractId: 'CT004', invoiceNo: 'FP202605004', amount: 800000, issueDate: '2026-05-22', matchedStatus: '未匹配' },
  { id: 'IV005', contractId: 'CT005', invoiceNo: 'FP202601005', amount: 5130000, issueDate: '2026-01-18', matchedStatus: '已匹配' },
  { id: 'IV006', contractId: 'CT006', invoiceNo: 'FP202602006', amount: 1512000, issueDate: '2026-02-25', matchedStatus: '已匹配' },
  { id: 'IV007', contractId: 'CT007', invoiceNo: 'FP202604007', amount: 230400, issueDate: '2026-04-28', matchedStatus: '未匹配' },
]

const paymentRequests: PaymentRequest[] = [
  { id: 'PY001', contractId: 'CT001', amount: 462000, reason: '5月份螺纹钢到货付款', status: '待审批', createdAt: '2026-06-01' },
  { id: 'PY002', contractId: 'CT002', amount: 294000, reason: '5月份水泥到货付款', status: '已审批', createdAt: '2026-05-28' },
  { id: 'PY003', contractId: 'CT003', amount: 693000, reason: '5月份商混到货付款', status: '已支付', createdAt: '2026-05-20' },
  { id: 'PY004', contractId: 'CT004', amount: 453600, reason: '4月份钢材到货付款', status: '已驳回', createdAt: '2026-05-15' },
  { id: 'PY005', contractId: 'CT006', amount: 378000, reason: '4月份水泥到货付款', status: '已支付', createdAt: '2026-05-10' },
  { id: 'PY006', contractId: 'CT007', amount: 153600, reason: '4月份防水卷材到货付款', status: '待审批', createdAt: '2026-06-03' },
  { id: 'PY007', contractId: 'CT001', amount: 847000, reason: '6月份螺纹钢到货付款', status: '待审批', createdAt: '2026-06-05' },
]

const approvalRecords: ApprovalRecord[] = [
  { id: 'AR001', relatedType: '采购申请', relatedId: 'PR001', action: '提交', operator: '张伟', role: '材料员', comment: '项目A区6月钢筋需求', createdAt: '2026-05-28 09:15' },
  { id: 'AR002', relatedType: '采购申请', relatedId: 'PR002', action: '审批通过', operator: '王建国', role: '项目经理', comment: '同意采购，注意到货时间', createdAt: '2026-05-26 14:30' },
  { id: 'AR003', relatedType: '采购申请', relatedId: 'PR004', action: '驳回', operator: '李明辉', role: '采购总监', comment: '库存充足，暂不需要采购', createdAt: '2026-05-23 10:45' },
  { id: 'AR004', relatedType: '付款申请', relatedId: 'PY001', action: '提交', operator: '刘芳', role: '财务专员', comment: '5月份螺纹钢到货结算', createdAt: '2026-06-01 11:00' },
  { id: 'AR005', relatedType: '付款申请', relatedId: 'PY004', action: '驳回', operator: '陈志远', role: '财务总监', comment: '发票未到，暂不支付', createdAt: '2026-05-16 16:20' },
  { id: 'AR006', relatedType: '付款申请', relatedId: 'PY002', action: '审批通过', operator: '陈志远', role: '财务总监', comment: '同意支付', createdAt: '2026-05-29 09:00' },
  { id: 'AR007', relatedType: '采购申请', relatedId: 'PR005', action: '提交', operator: '张伟', role: '材料员', comment: '6月防水卷材需求', createdAt: '2026-06-01 08:30' },
  { id: 'AR008', relatedType: '付款申请', relatedId: 'PY006', action: '提交', operator: '刘芳', role: '财务专员', comment: '4月防水卷材结算', createdAt: '2026-06-03 10:15' },
]

const priceAlerts: PriceAlert[] = [
  { id: 'PA001', materialName: 'HRB400螺纹钢', oldPrice: 3850, newPrice: 4120, changeRate: 7.0, alertDate: '2026-06-01', level: '高' },
  { id: 'PA002', materialName: '普通硅酸盐水泥', oldPrice: 420, newPrice: 445, changeRate: 6.0, alertDate: '2026-06-02', level: '中' },
  { id: 'PA003', materialName: '商品混凝土', oldPrice: 385, newPrice: 378, changeRate: -1.8, alertDate: '2026-05-30', level: '低' },
  { id: 'PA004', materialName: '防水卷材', oldPrice: 32, newPrice: 35, changeRate: 9.4, alertDate: '2026-06-03', level: '高' },
  { id: 'PA005', materialName: '电线电缆', oldPrice: 85, newPrice: 91, changeRate: 7.1, alertDate: '2026-06-04', level: '高' },
  { id: 'PA006', materialName: '加气混凝土砌块', oldPrice: 185, newPrice: 192, changeRate: 3.8, alertDate: '2026-05-28', level: '低' },
  { id: 'PA007', materialName: '钢结构构件', oldPrice: 8500, newPrice: 8880, changeRate: 4.5, alertDate: '2026-06-05', level: '中' },
]

const documentArchives: DocumentArchive[] = [
  { id: 'DA001', name: '滨江新城钢材采购合同.pdf', category: '合同', fileSize: '2.4MB', uploadDate: '2025-03-15', relatedId: 'CT001' },
  { id: 'DA002', name: '水泥采购合同.pdf', category: '合同', fileSize: '1.8MB', uploadDate: '2025-04-01', relatedId: 'CT002' },
  { id: 'DA003', name: '3月螺纹钢发票.pdf', category: '发票', fileSize: '560KB', uploadDate: '2026-03-20', relatedId: 'IV001' },
  { id: 'DA004', name: '商品混凝土验收记录.pdf', category: '验收单', fileSize: '1.2MB', uploadDate: '2026-06-02', relatedId: 'SA001' },
  { id: 'DA005', name: '防水卷材技术参数表.xlsx', category: '其他', fileSize: '340KB', uploadDate: '2026-05-18', relatedId: 'MP004' },
  { id: 'DA006', name: '钢结构采购合同.pdf', category: '合同', fileSize: '3.1MB', uploadDate: '2024-09-25', relatedId: 'CT005' },
  { id: 'DA007', name: '水泥到货验收单.pdf', category: '验收单', fileSize: '890KB', uploadDate: '2026-05-31', relatedId: 'SA003' },
  { id: 'DA008', name: '4月水泥发票.pdf', category: '发票', fileSize: '420KB', uploadDate: '2026-04-15', relatedId: 'IV002' },
]

const monthlyArrival: MonthlyStat[] = [
  { month: '2026-01', value: 2860000 },
  { month: '2026-02', value: 3120000 },
  { month: '2026-03', value: 3580000 },
  { month: '2026-04', value: 4210000 },
  { month: '2026-05', value: 3950000 },
  { month: '2026-06', value: 1736000 },
]

const monthlyIssue: MonthlyStat[] = [
  { month: '2026-01', value: 2520000 },
  { month: '2026-02', value: 2890000 },
  { month: '2026-03', value: 3310000 },
  { month: '2026-04', value: 3870000 },
  { month: '2026-05', value: 3680000 },
  { month: '2026-06', value: 1185000 },
]

const monthlyReturn: MonthlyStat[] = [
  { month: '2026-01', value: 120000 },
  { month: '2026-02', value: 95000 },
  { month: '2026-03', value: 150000 },
  { month: '2026-04', value: 180000 },
  { month: '2026-05', value: 135000 },
  { month: '2026-06', value: 51000 },
]


export interface InventoryItem {
  materialName: string
  unit: string
  inboundQty: number
  outboundQty: number
  returnQty: number
  currentQty: number
}

export interface InventoryTransaction {
  id: string
  date: string
  type: '验收入库' | '领料出库' | '退库入库'
  materialName: string
  qty: number
  relatedId: string
}

export interface CostBreakdownItem {
  source: string
  label: string
  amount: number
  detail: string
}

export interface TodoItem {
  id: string
  type: '采购审批' | '付款审批' | '出库审核' | '物资签收'
  title: string
  date: string
  path: string
}

interface StoreState {
  projects: ProjectInfo[]
  materialPlans: MaterialPlan[]
  purchaseRequests: PurchaseRequest[]
  supplierQuotes: SupplierQuote[]
  contracts: Contract[]
  arrivalAppointments: ArrivalAppointment[]
  siteAcceptances: SiteAcceptance[]
  warehouseIssues: WarehouseIssue[]
  subcontractorSigns: SubcontractorSign[]
  materialReturns: MaterialReturn[]
  lossRecords: LossRecord[]
  equipmentRentals: EquipmentRental[]
  invoices: Invoice[]
  paymentRequests: PaymentRequest[]
  approvalRecords: ApprovalRecord[]
  priceAlerts: PriceAlert[]
  documentArchives: DocumentArchive[]
  monthlyArrival: MonthlyStat[]
  monthlyIssue: MonthlyStat[]
  monthlyReturn: MonthlyStat[]
  currentRole: string
  setCurrentRole: (role: string) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  addPurchaseRequest: (req: Omit<PurchaseRequest, 'id' | 'status' | 'createdAt' | 'approvedBy'>) => void
  addPaymentRequest: (req: Omit<PaymentRequest, 'id' | 'status' | 'createdAt'>) => void
  updateInvoiceMatch: (invoiceId: string, contractId: string | null) => void
  signSubcontractor: (id: string, qty: number) => void
  acceptMaterialReturn: (id: string) => void
  returnEquipment: (id: string, returnDate: string) => void
  approvePurchaseRequest: (id: string) => void
  rejectPurchaseRequest: (id: string, comment: string) => void
  progressToPurchased: (id: string) => void
  approvePaymentRequest: (id: string) => void
  rejectPaymentRequest: (id: string, comment: string) => void
  approveWarehouseIssue: (id: string) => void
}

interface DerivedState {
  pendingTodoCount: number
  pendingPurchaseCount: number
  pendingPaymentCount: number
  pendingIssueCount: number
  pendingSignCount: number
  budgetExecutionRate: number
  purchaseCompletionRate: number
  acceptancePassRate: number
  inventoryTurnoverRate: number
  todoItems: TodoItem[]
  inventoryItems: InventoryItem[]
  inventoryTransactions: InventoryTransaction[]
  costByCategory: CostByCategory[]
  costTrend: CostTrend[]
  totalContractAmount: number
  totalPaidAmount: number
  totalPendingPayment: number
  costBreakdown: CostBreakdownItem[]
}

const computeDerived = (s: StoreState): DerivedState => {
  const totalBudget = s.projects.reduce((a, p) => a + p.budgetTotal, 0)
  const totalSpent = s.projects.reduce((a, p) => a + p.spentTotal, 0)
  const totalPlanned = s.materialPlans.reduce((a, m) => a + m.plannedQty, 0)
  const totalPurchased = s.materialPlans.reduce((a, m) => a + m.purchasedQty, 0)
  const totalOrdered = s.siteAcceptances.reduce((a, x) => a + x.orderedQty, 0)
  const totalQualified = s.siteAcceptances.reduce((a, x) => a + x.qualifiedQty, 0)
  const totalIssued = s.warehouseIssues.filter(w => w.status === '已出库').reduce((a, w) => a + w.issuedQty, 0)
  const totalUsed = s.materialPlans.reduce((a, m) => a + m.usedQty, 0)

  const pendingPurchase = s.purchaseRequests.filter(r => r.status === '待审批')
  const pendingPayment = s.paymentRequests.filter(r => r.status === '待审批')
  const pendingIssue = s.warehouseIssues.filter(w => w.status === '待审核')
  const pendingSign = s.subcontractorSigns.filter(x => x.status === '待签收')

  const todoItems: TodoItem[] = [
    ...pendingPurchase.map(r => ({ id: r.id, type: '采购审批' as const, title: `${r.materialName} x${r.qty}`, date: r.createdAt, path: '/plan?tab=purchase' })),
    ...pendingPayment.map(p => ({ id: p.id, type: '付款审批' as const, title: p.reason, date: p.createdAt, path: '/contract?tab=payment' })),
    ...pendingIssue.map(w => ({ id: w.id, type: '出库审核' as const, title: `${w.materialName} → ${w.subcontractorName}`, date: w.issuedDate, path: '/material?tab=issue' })),
    ...pendingSign.map(x => ({ id: x.id, type: '物资签收' as const, title: `${x.materialName} → ${x.subcontractorName}`, date: x.signedDate || '—', path: '/material?tab=sign' })),
  ]

  const planMap: Record<string, { unit: string }> = {}
  s.materialPlans.forEach(m => { planMap[m.materialName] = { unit: m.unit } })

  const qualifiedByMat: Record<string, number> = {}
  s.siteAcceptances.filter(a => a.status === '合格' || a.status === '部分合格').forEach(a => {
    qualifiedByMat[a.materialName] = (qualifiedByMat[a.materialName] || 0) + a.qualifiedQty
  })
  const issuedByMat: Record<string, number> = {}
  s.warehouseIssues.filter(w => w.status === '已出库').forEach(w => {
    issuedByMat[w.materialName] = (issuedByMat[w.materialName] || 0) + w.issuedQty
  })
  const returnedByMat: Record<string, number> = {}
  s.materialReturns.filter(r => r.status === '已入库').forEach(r => {
    returnedByMat[r.materialName] = (returnedByMat[r.materialName] || 0) + r.returnQty
  })
  const allMaterials = new Set([...Object.keys(qualifiedByMat), ...Object.keys(issuedByMat), ...Object.keys(returnedByMat)])
  const inventoryItems: InventoryItem[] = Array.from(allMaterials).map(name => {
    const inbound = qualifiedByMat[name] || 0
    const outbound = issuedByMat[name] || 0
    const ret = returnedByMat[name] || 0
    return { materialName: name, unit: planMap[name]?.unit || '', inboundQty: inbound, outboundQty: outbound, returnQty: ret, currentQty: inbound - outbound + ret }
  })

  const transactions: InventoryTransaction[] = [
    ...s.siteAcceptances.filter(a => a.status === '合格' || a.status === '部分合格').map(a => ({
      id: a.id, date: new Date().toISOString().slice(0, 10), type: '验收入库' as const, materialName: a.materialName, qty: a.qualifiedQty, relatedId: a.id
    })),
    ...s.warehouseIssues.filter(w => w.status === '已出库').map(w => ({
      id: w.id, date: w.issuedDate, type: '领料出库' as const, materialName: w.materialName, qty: w.issuedQty, relatedId: w.id
    })),
    ...s.materialReturns.filter(r => r.status === '已入库').map(r => ({
      id: r.id, date: r.returnDate, type: '退库入库' as const, materialName: r.materialName, qty: r.returnQty, relatedId: r.id
    })),
  ].sort((a, b) => b.date.localeCompare(a.date))

  const catMap: Record<string, number> = {}
  s.contracts.forEach(c => { catMap[c.supplierName] = (catMap[c.supplierName] || 0) + c.amount })
  const costByCategory: CostByCategory[] = Object.entries(catMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const totalContractAmount = s.contracts.reduce((a, c) => a + c.amount, 0)
  const totalPaidAmount = s.contracts.reduce((a, c) => a + c.paidAmount, 0)
  const totalPendingPayment = totalContractAmount - totalPaidAmount

  const costTrend: CostTrend[] = [
    { month: '2026-01', budget: 4500000, actual: Math.min(4500000, totalPaidAmount * 0.18) },
    { month: '2026-02', budget: 4800000, actual: Math.min(4800000, totalPaidAmount * 0.28) },
    { month: '2026-03', budget: 5200000, actual: Math.min(5200000, totalPaidAmount * 0.42) },
    { month: '2026-04', budget: 5100000, actual: Math.min(5100000, totalPaidAmount * 0.62) },
    { month: '2026-05', budget: 4900000, actual: Math.min(4900000, totalPaidAmount * 0.82) },
    { month: '2026-06', budget: 4600000, actual: totalPaidAmount },
  ]

  const quoteMap: Record<string, number> = {}
  s.supplierQuotes.forEach(q => {
    if (!quoteMap[q.requestId]) quoteMap[q.requestId] = q.totalPrice
    else if (q.totalPrice < quoteMap[q.requestId]) quoteMap[q.requestId] = q.totalPrice
  })
  const requestUnitMap: Record<string, number> = {}
  s.purchaseRequests.forEach(r => {
    const price = quoteMap[r.id]
    if (price && r.qty > 0) requestUnitMap[r.id] = price / r.qty
  })
  const materialPriceMap: Record<string, number> = {}
  s.purchaseRequests.forEach(r => {
    const up = requestUnitMap[r.id]
    if (up && (!materialPriceMap[r.materialName] || up < materialPriceMap[r.materialName])) {
      materialPriceMap[r.materialName] = up
    }
  })

  const purchasePending = s.purchaseRequests
    .filter(r => r.status === '已审批')
    .reduce((a, r) => a + (quoteMap[r.id] || r.qty * (materialPriceMap[r.materialName] || 0)), 0)
  const paymentPaid = s.paymentRequests
    .filter(r => r.status === '已审批' || r.status === '已支付')
    .reduce((a, r) => a + r.amount, 0)
  const issueConsume = s.warehouseIssues
    .filter(w => w.status === '已出库')
    .reduce((a, w) => a + w.issuedQty * (materialPriceMap[w.materialName] || 0), 0)
  const returnDeduct = s.materialReturns
    .filter(r => r.status === '已入库')
    .reduce((a, r) => a + r.returnQty * (materialPriceMap[r.materialName] || 0), 0)

  const costBreakdown: CostBreakdownItem[] = [
    { source: 'purchase', label: '采购待发生', amount: purchasePending, detail: '审批通过待采购的采购申请估算金额' },
    { source: 'payment', label: '付款已发生', amount: paymentPaid, detail: '审批通过及已支付的付款申请金额' },
    { source: 'issue', label: '出库消耗', amount: issueConsume, detail: '仓库出库材料折算金额' },
    { source: 'return', label: '退库冲减', amount: returnDeduct, detail: '退库入库材料折算冲减金额' },
  ]

  return {
    pendingTodoCount: pendingPurchase.length + pendingPayment.length + pendingIssue.length + pendingSign.length,
    pendingPurchaseCount: pendingPurchase.length,
    pendingPaymentCount: pendingPayment.length,
    pendingIssueCount: pendingIssue.length,
    pendingSignCount: pendingSign.length,
    budgetExecutionRate: totalBudget > 0 ? Number(((totalSpent / totalBudget) * 100).toFixed(1)) : 0,
    purchaseCompletionRate: totalPlanned > 0 ? Number(((totalPurchased / totalPlanned) * 100).toFixed(1)) : 0,
    acceptancePassRate: totalOrdered > 0 ? Number(((totalQualified / totalOrdered) * 100).toFixed(1)) : 0,
    inventoryTurnoverRate: totalIssued > 0 ? Number(((totalUsed / totalIssued) * 100).toFixed(1)) : 0,
    todoItems,
    inventoryItems,
    inventoryTransactions: transactions,
    costByCategory,
    costTrend,
    totalContractAmount,
    totalPaidAmount,
    totalPendingPayment,
    costBreakdown,
  }
}

let idCounter = 1000
const nextId = (prefix: string) => `${prefix}${String(++idCounter)}`

const addApproval = (s: StoreState, relatedType: string, relatedId: string, action: '提交' | '审批通过' | '驳回', comment: string): ApprovalRecord[] => {
  const rec: ApprovalRecord = {
    id: nextId('AR'),
    relatedType,
    relatedId,
    action,
    operator: s.currentRole,
    role: s.currentRole,
    comment,
    createdAt: new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 5),
  }
  return [...s.approvalRecords, rec]
}

export const useStore = create<StoreState>((set, get) => ({
  projects,
  materialPlans,
  purchaseRequests,
  supplierQuotes,
  contracts,
  arrivalAppointments,
  siteAcceptances,
  warehouseIssues,
  subcontractorSigns,
  materialReturns,
  lossRecords,
  equipmentRentals,
  invoices,
  paymentRequests,
  approvalRecords,
  priceAlerts,
  documentArchives,
  monthlyArrival,
  monthlyIssue,
  monthlyReturn,
  currentRole: '物资经理',
  setCurrentRole: (role: string) => set({ currentRole: role }),
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),
  addPurchaseRequest: (req) => {
    const newReq: PurchaseRequest = {
      ...req,
      id: nextId('PR'),
      status: '待审批',
      createdAt: new Date().toISOString().slice(0, 10),
      approvedBy: '',
    }
    set(s => ({ purchaseRequests: [...s.purchaseRequests, newReq], approvalRecords: addApproval(s, '采购申请', newReq.id, '提交', `提交采购申请：${req.materialName} x${req.qty}`) }))
  },
  addPaymentRequest: (req) => {
    const newReq: PaymentRequest = {
      ...req,
      id: nextId('PY'),
      status: '待审批',
      createdAt: new Date().toISOString().slice(0, 10),
    }
    set(s => ({ paymentRequests: [...s.paymentRequests, newReq], approvalRecords: addApproval(s, '付款申请', newReq.id, '提交', `提交付款申请：¥${req.amount.toLocaleString()}`) }))
  },
  updateInvoiceMatch: (invoiceId, contractId) => {
    set(s => ({
      invoices: s.invoices.map(inv =>
        inv.id === invoiceId
          ? { ...inv, matchedStatus: contractId ? '已匹配' as const : '未匹配' as const, contractId: contractId || inv.contractId }
          : inv
      ),
    }))
  },
  signSubcontractor: (id, qty) => {
    set(s => ({
      subcontractorSigns: s.subcontractorSigns.map(sign =>
        sign.id === id
          ? { ...sign, status: '已签收' as const, signedQty: qty, signedDate: new Date().toISOString().slice(0, 10) }
          : sign
      ),
    }))
  },
  acceptMaterialReturn: (id) => {
    set(s => ({
      materialReturns: s.materialReturns.map(ret =>
        ret.id === id ? { ...ret, status: '已入库' as const } : ret
      ),
    }))
  },
  returnEquipment: (id, returnDate) => {
    set(s => ({
      equipmentRentals: s.equipmentRentals.map(eq =>
        eq.id === id
          ? { ...eq, status: '已归还' as const, rentalEnd: returnDate }
          : eq
      ),
    }))
  },
  approvePurchaseRequest: (id) => {
    set(s => ({
      purchaseRequests: s.purchaseRequests.map(r =>
        r.id === id ? { ...r, status: '已审批' as const, approvedBy: s.currentRole } : r
      ),
      approvalRecords: addApproval(s, '采购申请', id, '审批通过', '审批通过，待推进采购'),
    }))
  },
  rejectPurchaseRequest: (id, comment) => {
    set(s => ({
      purchaseRequests: s.purchaseRequests.map(r =>
        r.id === id ? { ...r, status: '已驳回' as const, approvedBy: s.currentRole } : r
      ),
      approvalRecords: addApproval(s, '采购申请', id, '驳回', comment || '审批驳回'),
    }))
  },
  progressToPurchased: (id) => {
    set(s => ({
      purchaseRequests: s.purchaseRequests.map(r =>
        r.id === id ? { ...r, status: '已采购' as const } : r
      ),
      approvalRecords: addApproval(s, '采购申请', id, '采购推进', '采购结果确认，进入已采购'),
    }))
  },
  approvePaymentRequest: (id) => {
    const payment = get().paymentRequests.find(p => p.id === id)
    set(s => ({
      paymentRequests: s.paymentRequests.map(p =>
        p.id === id ? { ...p, status: '已审批' as const } : p
      ),
      contracts: payment ? s.contracts.map(c =>
        c.id === payment.contractId ? { ...c, paidAmount: c.paidAmount + payment.amount } : c
      ) : s.contracts,
      approvalRecords: addApproval(s, '付款申请', id, '审批通过', `审批通过，付款金额 ¥${payment?.amount.toLocaleString() || 0}`),
    }))
  },
  rejectPaymentRequest: (id, comment) => {
    set(s => ({
      paymentRequests: s.paymentRequests.map(p =>
        p.id === id ? { ...p, status: '已驳回' as const } : p
      ),
      approvalRecords: addApproval(s, '付款申请', id, '驳回', comment || '审批驳回'),
    }))
  },
  approveWarehouseIssue: (id) => {
    set(s => ({
      warehouseIssues: s.warehouseIssues.map(w =>
        w.id === id ? { ...w, status: '已出库' as const } : w
      ),
      approvalRecords: addApproval(s, '出库审核', id, '审批通过', '审核通过，准予出库'),
    }))
  },
}))

export function useDerived() {
  const state = useStore()
  return computeDerived(state)
}

export default useStore
