import type { NodeDetail } from "@/data/diagram-types";

/**
 * V2.0 统一教学数据模型（Unified Enterprise Scenario Model）。
 *
 * 全站新增专题、交互工具、血缘图、语义层、数字孪生共用这一份实体与关系定义。
 * - ID 规范沿用 V1 `data/itops.ts`：大写类型前缀 + 序号，例如 SVC-002 / INC-001。
 * - 关系方向统一为「主语 → 宾语」，谓语为大写蛇形，与 V1 Cypher 示例一致。
 * - 所有实体与关系都带来源、证据、置信度、有效时间、事务时间、版本与安全分级。
 *
 * 全部数据均为教学模拟数据，不代表任何真实企业、真实设备或真实指标口径。
 */

export type Domain = "IT Operations" | "Manufacturing" | "Shared";
export type Classification = "Public" | "Internal" | "Confidential" | "Restricted";
export type ApprovalStatus = "Approved" | "Pending" | "Rejected" | "Expired";

/** 知识对象统一元数据契约（实体与关系共用）。 */
export interface KnowledgeProvenance {
  /** 来源 ID。刻意不叫 source：EnterpriseRelation 的 source/target 表示图边端点。 */
  sourceRef: string;
  evidence: string;
  /** LLM 抽取/规则匹配的置信度，不等于来源权威性。 */
  confidence: number;
  /** 业务生效时间（Valid Time）。 */
  validTime: string;
  /** 系统写入时间（Transaction Time）。 */
  transactionTime: string;
  version: string;
  classification: Classification;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
}

export interface EnterpriseEntity extends KnowledgeProvenance {
  id: string;
  type: string;
  label: string;
  domain: Domain;
  properties: NodeDetail[];
}

export interface EnterpriseRelation extends KnowledgeProvenance {
  id: string;
  source: string;
  target: string;
  predicate: string;
  note?: string;
}

const SIM_TIME = "2026-04-18T09:20:00Z";

function provenance(
  source: string,
  evidence: string,
  confidence: number,
  classification: Classification = "Internal",
  approvalStatus: ApprovalStatus = "Approved",
  version = "v1.3",
): KnowledgeProvenance {
  return {
    sourceRef: source,
    evidence,
    confidence,
    validTime: "2026-01-01/..",
    transactionTime: SIM_TIME,
    version,
    classification,
    approvalStatus,
    approvedBy: approvalStatus === "Approved" ? "knowledge-governance-team (模拟)" : undefined,
  };
}

const p = (label: string, value: string): NodeDetail => ({ label, value });

/**
 * IT Operations 场景：沿用 V1 的 OrderSystem / PaymentService / Incident-001 主线。
 * 原有 ID 与 data/itops.ts 完全一致，避免重复定义同一业务概念。
 */
export const itOpsEntities: EnterpriseEntity[] = [
  { id: "BIZ-001", type: "Business", label: "Online Order Business", domain: "IT Operations",
    properties: [p("Owner", "Digital Commerce (模拟)"), p("Criticality", "Tier-1"), p("SLA", "99.9% (演示假设)")],
    ...provenance("SRC-ITSM-01", "EVD-BIZ-001", 0.94, "Internal") },
  { id: "SYS-001", type: "System", label: "OrderSystem", domain: "IT Operations",
    properties: [p("Status", "Degraded (模拟)"), p("Owner Team", "TEAM-001"), p("Environment", "ENV-PROD")],
    ...provenance("SRC-CMDB-01", "EVD-SYS-001", 0.97, "Internal") },
  { id: "SVC-001", type: "Service", label: "OrderService", domain: "IT Operations",
    properties: [p("Runtime", "Java 21 (演示假设)"), p("Status", "Running")],
    ...provenance("SRC-CMDB-01", "EVD-SVC-001", 0.96) },
  { id: "SVC-002", type: "Service", label: "PaymentService", domain: "IT Operations",
    properties: [p("Status", "Degraded (模拟)"), p("Owner Team", "TEAM-001"), p("P95 Latency", "1.8s (模拟)")],
    ...provenance("SRC-CMDB-01", "EVD-SVC-002", 0.98, "Confidential") },
  { id: "API-001", type: "API", label: "POST /payments", domain: "IT Operations",
    properties: [p("Protocol", "HTTPS"), p("Auth", "OAuth2 (演示假设)")],
    ...provenance("SRC-API-REG-01", "EVD-API-001", 0.91) },
  { id: "DB-001", type: "Database", label: "PaymentDB", domain: "IT Operations",
    properties: [p("Engine", "PostgreSQL (演示假设)"), p("Region", "Primary")],
    ...provenance("SRC-CMDB-01", "EVD-DB-001", 0.95, "Confidential") },
  { id: "TEAM-001", type: "Team", label: "Payments Platform Team", domain: "IT Operations",
    properties: [p("On-call", "24×7 (演示假设)"), p("Escalation", "L2 → L3")],
    ...provenance("SRC-HR-01", "EVD-TEAM-001", 0.9) },
  { id: "ENV-PROD", type: "Environment", label: "Production", domain: "IT Operations",
    properties: [p("Region", "Primary (模拟)"), p("Change Window", "Sun 02:00 UTC")],
    ...provenance("SRC-CMDB-01", "EVD-ENV-001", 0.99) },
  { id: "INC-001", type: "Incident", label: "Payment Timeout Incident", domain: "IT Operations",
    properties: [p("Severity", "P1 (模拟)"), p("Detected", "2026-04-18T08:42Z"), p("Status", "Mitigating")],
    ...provenance("SRC-ITSM-01", "EVD-INC-001", 0.96, "Confidential") },
  { id: "INC-002", type: "Incident", label: "Historical Payment DB Saturation", domain: "IT Operations",
    properties: [p("Severity", "P2 (模拟)"), p("Detected", "2026-02-03T14:05Z"), p("Status", "Closed")],
    ...provenance("SRC-ITSM-01", "EVD-INC-002", 0.93, "Confidential", "Approved", "v1.1") },
  { id: "RB-001", type: "Runbook", label: "Payment Degradation Runbook", domain: "IT Operations",
    properties: [p("Owner", "TEAM-001"), p("Review Cycle", "90 days (演示假设)")],
    ...provenance("SRC-DOC-01", "EVD-RB-001", 0.89, "Internal") },
  { id: "CHK-001", type: "Change", label: "CHG-2026-0417 Connection Pool", domain: "IT Operations",
    properties: [p("Risk", "Medium (模拟)"), p("Applied", "2026-04-17T22:10Z")],
    ...provenance("SRC-ITSM-01", "EVD-CHK-001", 0.92, "Internal") },
  { id: "DOC-001", type: "Document", label: "Incident Postmortem INC-001", domain: "IT Operations",
    properties: [p("Format", "PDF"), p("Language", "zh-CN"), p("Retention", "3 years (演示策略)")],
    ...provenance("SRC-DOC-01", "EVD-DOC-001", 0.88, "Confidential", "Pending", "v1.0") },
  { id: "DOC-002", type: "Document", label: "Payment Architecture Design", domain: "IT Operations",
    properties: [p("Format", "Confluence"), p("Last Reviewed", "2026-03-30")],
    ...provenance("SRC-DOC-01", "EVD-DOC-002", 0.9, "Internal") },
];

/** Manufacturing 场景：Factory-A / Line-01 / Machine-001 主线，V2 新增但 ID 稳定且方向统一。 */
export const manufacturingEntities: EnterpriseEntity[] = [
  { id: "FAC-A", type: "Factory", label: "Factory-A", domain: "Manufacturing",
    properties: [p("Site", "Demo Plant (模拟)"), p("Shifts", "2"), p("Timezone", "UTC+8")],
    ...provenance("SRC-MES-01", "EVD-FAC-A", 0.97) },
  { id: "LINE-01", type: "ProductionLine", label: "Line-01", domain: "Manufacturing",
    properties: [p("State", "Running (模拟)"), p("Target OEE", "85% (演示目标)")],
    ...provenance("SRC-MES-01", "EVD-LINE-01", 0.96) },
  { id: "MCH-001", type: "Machine", label: "Machine-001", domain: "Manufacturing",
    properties: [p("State", "Warning (模拟)"), p("Installed", "2023-06-01"), p("Nominal Temp", "68 °C")],
    ...provenance("SRC-MES-01", "EVD-MCH-001", 0.98, "Internal") },
  { id: "CMP-001", type: "Component", label: "Motor-001", domain: "Manufacturing",
    properties: [p("Type", "Induction Motor"), p("Rated RPM", "1480 (模拟)"), p("Serial", "SN-MTR-0001")],
    ...provenance("SRC-EAM-01", "EVD-CMP-001", 0.95) },
  { id: "SNS-001", type: "Sensor", label: "Sensor-001", domain: "Manufacturing",
    properties: [p("Measures", "Temperature / Vibration"), p("Sampling", "1 Hz (模拟)"), p("Unit", "°C / mm·s⁻¹")],
    ...provenance("SRC-IOT-01", "EVD-SNS-001", 0.99) },
  { id: "TLM-001", type: "Telemetry", label: "Telemetry Stream-001", domain: "Manufacturing",
    properties: [p("Store", "Time-series DB (模拟)"), p("Retention", "180 days (演示策略)")],
    ...provenance("SRC-IOT-01", "EVD-TLM-001", 0.99) },
  { id: "MEV-001", type: "MaintenanceEvent", label: "High Vibration Alert", domain: "Manufacturing",
    properties: [p("Severity", "Warning (模拟)"), p("Raised", "2026-04-18T08:55Z")],
    ...provenance("SRC-IOT-01", "EVD-MEV-001", 0.93, "Internal", "Pending", "v1.0") },
  { id: "WO-001", type: "WorkOrder", label: "WO-2026-0418-01", domain: "Manufacturing",
    properties: [p("State", "Proposed (模拟)"), p("Priority", "Medium"), p("Requires", "Human approval")],
    ...provenance("SRC-EAM-01", "EVD-WO-001", 0.9, "Internal", "Pending", "v1.0") },
  { id: "TEAM-MNT-01", type: "Technician", label: "Maintenance-Team", domain: "Manufacturing",
    properties: [p("Shift", "Day (模拟)"), p("Skills", "Rotating equipment")],
    ...provenance("SRC-HR-01", "EVD-TEAM-MNT", 0.92) },
];

export const enterpriseEntities: EnterpriseEntity[] = [...itOpsEntities, ...manufacturingEntities];
export const entityById: Record<string, EnterpriseEntity> = Object.fromEntries(
  enterpriseEntities.map((e) => [e.id, e]),
);

export const itOpsRelations: EnterpriseRelation[] = [
  { id: "REL-IT-001", source: "BIZ-001", target: "SYS-001", predicate: "CONTAINS", note: "业务包含系统", ...provenance("SRC-CMDB-01", "EVD-REL-001", 0.95) },
  { id: "REL-IT-002", source: "SYS-001", target: "SVC-001", predicate: "CONTAINS", ...provenance("SRC-CMDB-01", "EVD-REL-002", 0.96) },
  { id: "REL-IT-003", source: "SYS-001", target: "SVC-002", predicate: "CONTAINS", ...provenance("SRC-CMDB-01", "EVD-REL-003", 0.96) },
  { id: "REL-IT-004", source: "SVC-001", target: "SVC-002", predicate: "CALLS", note: "调用方 → 被调用方，与 V1 一致", ...provenance("SRC-APM-01", "EVD-REL-004", 0.94) },
  { id: "REL-IT-005", source: "SVC-002", target: "API-001", predicate: "EXPOSES", ...provenance("SRC-API-REG-01", "EVD-REL-005", 0.9) },
  { id: "REL-IT-006", source: "SVC-002", target: "DB-001", predicate: "CONNECTS_TO", ...provenance("SRC-CMDB-01", "EVD-REL-006", 0.97) },
  { id: "REL-IT-007", source: "SVC-002", target: "TEAM-001", predicate: "OWNED_BY", ...provenance("SRC-CMDB-01", "EVD-REL-007", 0.95) },
  { id: "REL-IT-008", source: "SVC-002", target: "ENV-PROD", predicate: "DEPLOYED_IN", ...provenance("SRC-CMDB-01", "EVD-REL-008", 0.96) },
  { id: "REL-IT-009", source: "INC-001", target: "SVC-002", predicate: "AFFECTS", note: "故障传播起点", ...provenance("SRC-ITSM-01", "EVD-REL-009", 0.97, "Confidential") },
  { id: "REL-IT-010", source: "INC-001", target: "BIZ-001", predicate: "IMPACTS", ...provenance("SRC-ITSM-01", "EVD-REL-010", 0.88, "Confidential", "Pending", "v1.0") },
  { id: "REL-IT-011", source: "INC-001", target: "RB-001", predicate: "RESOLVED_BY", ...provenance("SRC-ITSM-01", "EVD-REL-011", 0.9) },
  { id: "REL-IT-012", source: "RB-001", target: "DOC-002", predicate: "DOCUMENTED_BY", ...provenance("SRC-DOC-01", "EVD-REL-012", 0.87) },
  { id: "REL-IT-013", source: "INC-001", target: "DOC-001", predicate: "DOCUMENTED_BY", ...provenance("SRC-DOC-01", "EVD-REL-013", 0.89, "Confidential") },
  { id: "REL-IT-014", source: "CHK-001", target: "SVC-002", predicate: "CHANGED", note: "变更关联，用于根因候选", ...provenance("SRC-ITSM-01", "EVD-REL-014", 0.93) },
  { id: "REL-IT-015", source: "INC-002", target: "DB-001", predicate: "AFFECTS", note: "历史相似故障", ...provenance("SRC-ITSM-01", "EVD-REL-015", 0.91) },
  { id: "REL-IT-016", source: "INC-001", target: "INC-002", predicate: "SIMILAR_TO", note: "相似度由规则+向量计算（模拟）", ...provenance("SRC-ITSM-01", "EVD-REL-016", 0.72, "Confidential", "Pending", "v1.0") },
];

export const manufacturingRelations: EnterpriseRelation[] = [
  { id: "REL-MF-001", source: "FAC-A", target: "LINE-01", predicate: "CONTAINS", ...provenance("SRC-MES-01", "EVD-MF-001", 0.98) },
  { id: "REL-MF-002", source: "LINE-01", target: "MCH-001", predicate: "CONTAINS", ...provenance("SRC-MES-01", "EVD-MF-002", 0.98) },
  { id: "REL-MF-003", source: "MCH-001", target: "CMP-001", predicate: "HAS_COMPONENT", ...provenance("SRC-EAM-01", "EVD-MF-003", 0.96) },
  { id: "REL-MF-004", source: "CMP-001", target: "SNS-001", predicate: "MONITORED_BY", ...provenance("SRC-EAM-01", "EVD-MF-004", 0.97) },
  { id: "REL-MF-005", source: "SNS-001", target: "TLM-001", predicate: "EMITS", ...provenance("SRC-IOT-01", "EVD-MF-005", 0.99) },
  { id: "REL-MF-006", source: "TLM-001", target: "MEV-001", predicate: "TRIGGERS", note: "阈值规则触发（模拟）", ...provenance("SRC-IOT-01", "EVD-MF-006", 0.94, "Internal", "Pending", "v1.0") },
  { id: "REL-MF-007", source: "MEV-001", target: "WO-001", predicate: "PROPOSES", note: "工单为建议，需人工审批", ...provenance("SRC-EAM-01", "EVD-MF-007", 0.86, "Internal", "Pending", "v1.0") },
  { id: "REL-MF-008", source: "WO-001", target: "TEAM-MNT-01", predicate: "ASSIGNED_TO", ...provenance("SRC-EAM-01", "EVD-MF-008", 0.9, "Internal", "Pending", "v1.0") },
  { id: "REL-MF-009", source: "INC-001", target: "LINE-01", predicate: "IMPACTS", note: "跨领域关联：IT 故障影响产线（演示假设）", ...provenance("SRC-KG-FUSION", "EVD-MF-009", 0.61, "Confidential", "Pending", "v1.0") },
];

export const enterpriseRelations: EnterpriseRelation[] = [...itOpsRelations, ...manufacturingRelations];

/* ------------------------------------------------------------------ *
 * 企业语义层演示指标：全部是「演示定义」，不是任何真实企业的标准口径。
 * ------------------------------------------------------------------ */
export interface SemanticMetric {
  id: string;
  name: string;
  cn: string;
  businessDefinition: string;
  formula: string;
  dimensions: string[];
  measures: string[];
  businessRules: string[];
  sourceTable: string;
  sourceField: string;
  physicalMapping: string;
  entities: string[];
  owner: string;
  permission: string;
  updatedAt: string;
  grain: string;
  version: string;
  caveat: string;
}

export const semanticMetrics: SemanticMetric[] = [
  {
    id: "MET-001", name: "Incident Count", cn: "事件总数",
    businessDefinition: "统计周期内，状态不为 Draft、且严重级别达到纳入阈值的事件去重计数。演示定义中纳入 P1/P2/P3，排除测试事件。",
    formula: "COUNT(DISTINCT incident_id) WHERE severity IN ('P1','P2','P3') AND is_test = false",
    dimensions: ["Time (day/week/month)", "Service", "Environment", "Team", "Severity"],
    measures: ["incident_id (COUNT DISTINCT)"],
    businessRules: ["同一事件多次状态流转只计一次", "跨天事件按首次发现时间归属", "演练事件标记为 is_test 后排除"],
    sourceTable: "itsm.fact_incident", sourceField: "incident_id, severity, detected_at, is_test, service_id",
    physicalMapping: "itsm.fact_incident → svc.dim_service (service_id) → cmdb.dim_environment (env_id)",
    entities: ["INC-001", "SVC-002", "ENV-PROD", "TEAM-001"], owner: "IT Service Management (模拟)",
    permission: "role: it-ops-analyst / classification: Internal", updatedAt: "2026-04-18T09:00:00Z",
    grain: "一行 = 一个事件", version: "v1.2",
    caveat: "演示定义。真实口径需由 IT 服务管理团队审批，并与事件等级标准对齐。",
  },
  {
    id: "MET-002", name: "Mean Time to Recovery", cn: "平均恢复时间 (MTTR)",
    businessDefinition: "从事件被确认（acknowledged_at）到服务恢复（recovered_at）的时长均值。演示定义不含检测延迟，且不截断长尾。",
    formula: "AVG(recovered_at - acknowledged_at) / 60  [minutes]",
    dimensions: ["Time", "Service", "Severity", "Team"],
    measures: ["recovery_minutes (AVG)", "incident_id (COUNT)"],
    businessRules: ["未恢复事件不计入分子", "计划内维护不计入", "超过 24h 的事件保留但单独标记"],
    sourceTable: "itsm.fact_incident_timeline", sourceField: "incident_id, acknowledged_at, recovered_at",
    physicalMapping: "itsm.fact_incident_timeline → itsm.fact_incident → svc.dim_service",
    entities: ["INC-001", "INC-002", "SVC-002"], owner: "SRE Lead (模拟)",
    permission: "role: sre-lead / classification: Internal", updatedAt: "2026-04-18T09:00:00Z",
    grain: "一行 = 一次状态流转", version: "v2.0",
    caveat: "演示定义。是否纳入检测时间（MTTD）是常见口径分歧，必须由业务方明确。",
  },
  {
    id: "MET-003", name: "Service Availability", cn: "服务可用率",
    businessDefinition: "统计周期内服务可用分钟数除以应服务分钟数。演示定义以 5 分钟探针为准，计划维护窗口从分母剔除。",
    formula: "(scheduled_minutes - excluded_minutes - unavailable_minutes) / (scheduled_minutes - excluded_minutes) × 100%",
    dimensions: ["Time", "Service", "Environment", "Region"],
    measures: ["probe_ok (SUM)", "scheduled_minutes (SUM)"],
    businessRules: ["连续 2 个探针失败才计为不可用", "维护窗口需变更单号才可剔除", "部分降级按权重折算（演示简化为二值）"],
    sourceTable: "obs.fact_probe_minute", sourceField: "service_id, ts_minute, probe_ok, maintenance_id",
    physicalMapping: "obs.fact_probe_minute → svc.dim_service → itsm.dim_change (maintenance_id)",
    entities: ["SVC-002", "ENV-PROD", "SYS-001"], owner: "Observability Team (模拟)",
    permission: "role: it-ops-analyst / classification: Internal", updatedAt: "2026-04-18T09:05:00Z",
    grain: "一行 = 服务 × 分钟", version: "v3.1",
    caveat: "演示定义。SLA 合同口径通常与监控口径不同，不能混用。",
  },
  {
    id: "MET-004", name: "Change Failure Rate", cn: "变更失败率",
    businessDefinition: "统计周期内引发 P1/P2 事件的变更数除以已实施变更总数。演示定义以 72 小时关联窗口判定因果候选，需人工复核。",
    formula: "COUNT(DISTINCT change_id WITH incident) / COUNT(DISTINCT deployed_change_id) × 100%",
    dimensions: ["Time", "Service", "Team", "Change Type"],
    measures: ["change_id (COUNT DISTINCT)", "failed_change_id (COUNT DISTINCT)"],
    businessRules: ["仅统计已部署到生产环境的变更", "关联窗口 72h", "「引发」需值班经理确认，不能仅凭时间接近自动判定"],
    sourceTable: "itsm.fact_change + itsm.fact_incident", sourceField: "change_id, deployed_at, service_id, incident_id",
    physicalMapping: "itsm.fact_change → itsm.fact_incident (service_id + 72h window) → svc.dim_service",
    entities: ["CHK-001", "INC-001", "SVC-002"], owner: "Change Advisory Board (模拟)",
    permission: "role: change-manager / classification: Confidential", updatedAt: "2026-04-18T08:30:00Z",
    grain: "一行 = 一个已部署变更", version: "v1.4",
    caveat: "演示定义。时间相关不等于因果；自动归因是典型的语义层误用。",
  },
  {
    id: "MET-005", name: "Critical Incident Rate", cn: "重大事件占比",
    businessDefinition: "统计周期内 P1 事件数占全部纳入事件数的比例。演示定义中 P1 由事件单 severity 字段决定。",
    formula: "COUNT(incident_id WHERE severity='P1') / COUNT(incident_id) × 100%",
    dimensions: ["Time", "Service", "Business Process"],
    measures: ["incident_id (COUNT)", "p1_incident_id (COUNT)"],
    businessRules: ["分母与 Incident Count 使用同一纳入规则", "升级为 P1 的事件按最终级别归属"],
    sourceTable: "itsm.fact_incident", sourceField: "incident_id, severity, final_severity, business_id",
    physicalMapping: "itsm.fact_incident → biz.dim_business_process (business_id)",
    entities: ["INC-001", "BIZ-001", "SVC-002"], owner: "IT Service Management (模拟)",
    permission: "role: it-ops-lead / classification: Confidential", updatedAt: "2026-04-18T09:10:00Z",
    grain: "一行 = 一个事件", version: "v1.1",
    caveat: "演示定义。若分母口径与 Incident Count 不一致，两个指标会互相矛盾。",
  },
];

export interface SemanticEntity {
  id: string;
  name: string;
  cn: string;
  definition: string;
  keys: string;
  relatedMetrics: string[];
  classification: Classification;
}

export const semanticEntities: SemanticEntity[] = [
  { id: "SEM-SYSTEM", name: "System", cn: "系统", definition: "一组共同交付业务能力的服务与数据资产的集合，是发布与归属的上层边界。", keys: "system_id", relatedMetrics: ["MET-001", "MET-003"], classification: "Internal" },
  { id: "SEM-SERVICE", name: "Service", cn: "服务", definition: "可独立部署、具备明确 SLO 与负责团队的运行单元。", keys: "service_id", relatedMetrics: ["MET-001", "MET-002", "MET-003", "MET-004", "MET-005"], classification: "Internal" },
  { id: "SEM-INCIDENT", name: "Incident", cn: "事件", definition: "导致或可能导致服务中断/降级的非计划事件，有唯一编号与状态流转记录。", keys: "incident_id", relatedMetrics: ["MET-001", "MET-002", "MET-004", "MET-005"], classification: "Confidential" },
  { id: "SEM-TEAM", name: "Team", cn: "团队", definition: "对服务或事件负运维责任的组织单元，用于归属与升级路径。", keys: "team_id", relatedMetrics: ["MET-001", "MET-002", "MET-004"], classification: "Internal" },
  { id: "SEM-ENV", name: "Environment", cn: "环境", definition: "服务部署的运行环境（Production / Staging 等），影响可用率分母与权限边界。", keys: "env_id", relatedMetrics: ["MET-001", "MET-003"], classification: "Internal" },
  { id: "SEM-PROCESS", name: "Business Process", cn: "业务流程", definition: "企业经营活动链路，用于把技术事件映射到业务影响。", keys: "business_id", relatedMetrics: ["MET-005"], classification: "Confidential" },
];

/* ------------------------------------------------------------------ *
 * 知识血缘与质量评分（Governance Explorer 共享数据）
 * ------------------------------------------------------------------ */
export interface LineageNode {
  id: string;
  label: string;
  stage: string;
  sourceId: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  evidence: string;
  confidence: number;
  approvalStatus: ApprovalStatus;
  accessPolicy: string;
  description: string;
  parent?: string;
}

export const lineageNodes: LineageNode[] = [
  { id: "LN-DOC", label: "Document", stage: "Source", sourceId: "DOC-001", version: "v1.0", createdAt: "2026-04-18T09:12Z", updatedAt: "2026-04-18T09:40Z", evidence: "EVD-DOC-001", confidence: 1, approvalStatus: "Pending", accessPolicy: "classification <= Confidential", description: "故障复盘原文 PDF；来源权威性由文档所有者与审核状态决定，不由 LLM 置信度决定。", parent: undefined },
  { id: "LN-CHUNK", label: "Chunk #07", stage: "Ingestion", sourceId: "DOC-001#C07", version: "v1.0", createdAt: "2026-04-18T09:13Z", updatedAt: "2026-04-18T09:40Z", evidence: "EVD-CHK-007", confidence: 1, approvalStatus: "Pending", accessPolicy: "inherit DOC-001", description: "按标题切分的第 7 个片段，继承原文密级与保留策略。", parent: "LN-DOC" },
  { id: "LN-EXT", label: "Extracted Entity", stage: "Extraction", sourceId: "EXT-E-0912", version: "v1.0", createdAt: "2026-04-18T09:15Z", updatedAt: "2026-04-18T09:40Z", evidence: "EVD-EXT-0912", confidence: 0.93, approvalStatus: "Pending", accessPolicy: "inherit DOC-001", description: "LLM 抽取出的 PaymentService 提及；0.93 是抽取置信度，不代表事实正确。", parent: "LN-CHUNK" },
  { id: "LN-CANON", label: "Canonical Entity", stage: "Entity Resolution", sourceId: "SVC-002", version: "v1.3", createdAt: "2026-01-04T10:00Z", updatedAt: "2026-04-18T09:40Z", evidence: "EVD-ER-002", confidence: 0.97, approvalStatus: "Approved", accessPolicy: "Confidential", description: "与 CMDB 主记录消歧合并后的规范实体，是企业主数据 ID。", parent: "LN-EXT" },
  { id: "LN-REL", label: "Relationship", stage: "Knowledge Fusion", sourceId: "REL-IT-009", version: "v1.2", createdAt: "2026-04-18T09:18Z", updatedAt: "2026-04-18T09:40Z", evidence: "EVD-REL-009", confidence: 0.88, approvalStatus: "Pending", accessPolicy: "Confidential", description: "INC-001 -[:AFFECTS]-> SVC-002；与 CMDB 依赖冲突时按来源权威性裁决。", parent: "LN-CANON" },
  { id: "LN-GRAPH", label: "Graph Record", stage: "Publication", sourceId: "NEO://SVC-002", version: "v1.3", createdAt: "2026-04-18T09:20Z", updatedAt: "2026-04-18T09:40Z", evidence: "EVD-GRAPH-002", confidence: 1, approvalStatus: "Approved", accessPolicy: "role: graph-reader + ABAC", description: "图数据库落库记录；权限标签随节点与关系一起存储。", parent: "LN-REL" },
  { id: "LN-INDEX", label: "Search Index", stage: "Indexing", sourceId: "IDX://DOC-001#C07", version: "v1.0", createdAt: "2026-04-18T09:21Z", updatedAt: "2026-04-18T09:40Z", evidence: "EVD-IDX-007", confidence: 1, approvalStatus: "Approved", accessPolicy: "ACL + security filter", description: "向量与关键词索引项；检索阶段必须应用安全过滤，不能只在生成阶段遮掩。", parent: "LN-GRAPH" },
  { id: "LN-ANSWER", label: "Generated Answer", stage: "Consumption", sourceId: "ANS-2026-0418-01", version: "v1.0", createdAt: "2026-04-18T09:22Z", updatedAt: "2026-04-18T09:40Z", evidence: "EVD-ANS-001", confidence: 0.81, approvalStatus: "Pending", accessPolicy: "session subject + audit", description: "带引用的回答；引用校验与权限复核失败时不出答案。", parent: "LN-INDEX" },
];

export interface QualityMetric {
  id: string;
  name: string;
  cn: string;
  value: number;
  unit: string;
  target: number;
  direction: "higher" | "lower";
  definition: string;
  formula: string;
  source: string;
}

/** 演示数据，不是行业基准，不可用于对比任何真实系统。 */
export const qualityMetrics: QualityMetric[] = [
  { id: "Q1", name: "Source Coverage", cn: "来源覆盖率", value: 82, unit: "%", target: 90, direction: "higher", definition: "已登记来源且具备责任人的知识对象占比。", formula: "objects_with_registered_source / all_objects", source: "Catalog (模拟)" },
  { id: "Q2", name: "Entity Completeness", cn: "实体完整度", value: 76, unit: "%", target: 85, direction: "higher", definition: "必填属性非空的规范实体占比。", formula: "entities_with_mandatory_props / canonical_entities", source: "SHACL 校验 (模拟)" },
  { id: "Q3", name: "Relationship Validity", cn: "关系有效率", value: 91, unit: "%", target: 95, direction: "higher", definition: "通过类型/方向/时态规则校验的关系占比。", formula: "valid_relations / sampled_relations", source: "规则引擎 (模拟)" },
  { id: "Q4", name: "Duplicate Entity Rate", cn: "重复实体率", value: 4.2, unit: "%", target: 2, direction: "lower", definition: "疑似重复且未合并的实体占比，越低越好。", formula: "suspected_duplicates / canonical_entities", source: "ER 候选队列 (模拟)" },
  { id: "Q5", name: "Provenance Coverage", cn: "血缘覆盖率", value: 88, unit: "%", target: 98, direction: "higher", definition: "能追溯到原文片段与来源的事实占比。", formula: "facts_with_evidence / facts", source: "Lineage Store (模拟)" },
  { id: "Q6", name: "Validation Pass Rate", cn: "校验通过率", value: 93, unit: "%", target: 97, direction: "higher", definition: "入库前自动校验一次通过的知识对象占比。", formula: "passed_first_try / submitted_objects", source: "Ingestion (模拟)" },
  { id: "Q7", name: "Stale Knowledge Rate", cn: "过期知识率", value: 9.6, unit: "%", target: 5, direction: "lower", definition: "超过复核周期仍标记为有效的知识对象占比。", formula: "expired_but_active / active_objects", source: "Retention Job (模拟)" },
  { id: "Q8", name: "Access Policy Coverage", cn: "权限策略覆盖率", value: 97, unit: "%", target: 100, direction: "higher", definition: "具备明确 ACL/ABAC 策略的向量、图与文档对象占比。", formula: "objects_with_policy / all_objects", source: "Policy Registry (模拟)" },
];

/* ------------------------------------------------------------------ *
 * 数字孪生模拟数据：确定性序列，全部标注为模拟，不连接任何真实 IoT。
 * ------------------------------------------------------------------ */
export interface TwinAsset {
  id: string;
  label: string;
  type: string;
  state: "Running" | "Warning" | "Stopped";
  props: NodeDetail[];
  parent?: string;
}

export const twinAssets: TwinAsset[] = [
  { id: "FAC-A", label: "Factory-A", type: "Factory", state: "Running", props: [p("Lines", "1 (演示)"), p("Shift", "Day")] },
  { id: "LINE-01", label: "Line-01", type: "ProductionLine", state: "Warning", parent: "FAC-A", props: [p("Throughput", "82% of target (模拟)"), p("State source", "MES simulated feed")] },
  { id: "MCH-001", label: "Machine-001", type: "Machine", state: "Warning", parent: "LINE-01", props: [p("Temperature", "79.4 °C (模拟)"), p("Vibration", "6.8 mm/s (模拟)"), p("State", "Derated")] },
  { id: "CMP-001", label: "Motor-001", type: "Component", state: "Warning", parent: "MCH-001", props: [p("Bearing temp", "81.1 °C (模拟)"), p("RPM", "1420 (模拟)"), p("Last service", "2026-02-11")] },
  { id: "SNS-001", label: "Sensor-001", type: "Sensor", state: "Running", parent: "CMP-001", props: [p("Measures", "Temp / Vibration"), p("Sampling", "1 Hz (模拟)"), p("Calibrated", "2026-03-02")] },
  { id: "TEAM-MNT-01", label: "Maintenance-Team", type: "Technician", state: "Running", props: [p("On shift", "Yes (模拟)"), p("Open work orders", "1")] },
];

/** 24 个确定性采样点（模拟），用于温度与振动趋势。 */
export const twinSeries: { t: string; temperature: number; vibration: number; thresholdTemp: number; thresholdVib: number }[] = Array.from({ length: 24 }, (_, i) => {
  const rise = Math.max(0, i - 9) * 0.62;
  const wave = Math.sin(i / 2.4) * 0.85;
  const temperature = Number((68.5 + rise + wave).toFixed(1));
  const vibration = Number((3.1 + Math.max(0, i - 11) * 0.23 + Math.cos(i / 3) * 0.32).toFixed(2));
  return {
    t: `${String(8 + Math.floor(i / 4)).padStart(2, "0")}:${String((i % 4) * 15).padStart(2, "0")}`,
    temperature, vibration, thresholdTemp: 76, thresholdVib: 5.5,
  };
});

export interface TwinEvent {
  id: string;
  time: string;
  kind: "Telemetry" | "Alert" | "Maintenance" | "Change";
  label: string;
  detail: string;
  assetId: string;
}

export const twinEvents: TwinEvent[] = [
  { id: "TW-E1", time: "08:00", kind: "Telemetry", label: "基线采集", detail: "温度 68.5 °C、振动 3.10 mm/s，处于模拟正常区间。", assetId: "SNS-001" },
  { id: "TW-E2", time: "10:15", kind: "Change", label: "产线提速", detail: "模拟 MES 指令将 Line-01 目标速度提高 8%，非真实设备操作。", assetId: "LINE-01" },
  { id: "TW-E3", time: "11:00", kind: "Telemetry", label: "温度越过关注线", detail: "温度达到 76.4 °C，超过演示关注阈值 76 °C。", assetId: "CMP-001" },
  { id: "TW-E4", time: "11:45", kind: "Alert", label: "振动告警 MEV-001", detail: "振动 5.7 mm/s 超过演示告警阈值 5.5 mm/s，生成待审批工单。", assetId: "MEV-001" },
  { id: "TW-E5", time: "12:10", kind: "Maintenance", label: "历史维修记录", detail: "2026-02-11 更换轴承（模拟历史记录），用于相似故障检索。", assetId: "CMP-001" },
  { id: "TW-E6", time: "12:30", kind: "Alert", label: "建议维护操作", detail: "建议：降载运行并安排轴承检查；仅为建议，不触发任何真实控制。", assetId: "WO-001" },
];

export const SIMULATION_NOTICE = "模拟执行 · 本地确定性演示数据 · 未连接任何真实 Agent、模型、数据库、知识图谱或 IoT 设备";
export const simulationNotice = SIMULATION_NOTICE;
