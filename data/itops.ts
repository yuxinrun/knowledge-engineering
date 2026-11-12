import type { DiagramEdge, DiagramNode, LegendItem } from "@/data/diagram-types";

export interface BusinessFact {
  no: number;
  text: string;
  triple: string;
  source: string;
}

/** 第 2 章 7 条核心业务事实（全站统一示例数据） */
export const businessFacts: BusinessFact[] = [
  { no: 1, text: "OrderSystem 包含 OrderService。", triple: "(OrderSystem)-[:CONTAINS]->(OrderService)", source: "CMDB 导出" },
  { no: 2, text: "OrderService 调用 PaymentService。", triple: "(OrderService)-[:CALLS]->(PaymentService)", source: "链路追踪 / 架构文档" },
  { no: 3, text: "PaymentService 连接 PaymentDB。", triple: "(PaymentService)-[:CONNECTS_TO]->(PaymentDB)", source: "配置文档" },
  { no: 4, text: "PaymentService 由 PaymentTeam 负责。", triple: "(PaymentService)-[:OWNED_BY]->(PaymentTeam)", source: "CMDB / 值班表" },
  { no: 5, text: "PaymentService 部署在 Production。", triple: "(PaymentService)-[:DEPLOYED_IN]->(Production)", source: "部署清单" },
  { no: 6, text: "Incident-001 影响 PaymentService。", triple: "(Incident-001)-[:AFFECTS]->(PaymentService)", source: "故障工单" },
  { no: 7, text: "Runbook-001 记录 PaymentService 的故障处理方法。", triple: "(PaymentService)-[:DOCUMENTED_BY]->(Runbook-001)", source: "Runbook PDF" },
];

export interface ItopsEntity {
  name: string;
  type: string;
  id: string;
  properties: string;
  hop: 1 | 2 | 3;
  scope: "核心示例" | "扩展演示";
}

export const itopsEntities: ItopsEntity[] = [
  { name: "OrderSystem", type: "System", id: "SYS-001", properties: "name=OrderSystem, criticality=P1", hop: 2, scope: "核心示例" },
  { name: "OrderService", type: "Service", id: "SVC-001", properties: "status=Running, owner=OrderTeam", hop: 1, scope: "核心示例" },
  { name: "PaymentService", type: "Service", id: "SVC-002", properties: "status=Running, env=Production", hop: 1, scope: "核心示例" },
  { name: "PaymentDB", type: "Database", id: "DB-001", properties: "dbType=PostgreSQL, version=15", hop: 1, scope: "核心示例" },
  { name: "PaymentTeam", type: "Team", id: "TEAM-001", properties: "oncall=payment-oncall", hop: 1, scope: "核心示例" },
  { name: "Production", type: "Environment", id: "ENV-PROD", properties: "environmentName=Production", hop: 1, scope: "核心示例" },
  { name: "Incident-001", type: "Incident", id: "INC-001", properties: "severity=P1, state=Mitigating", hop: 1, scope: "核心示例" },
  { name: "Runbook-001", type: "Runbook", id: "RB-001", properties: "version=2.1, reviewedAt=2026-03-01", hop: 1, scope: "核心示例" },
  { name: "PaymentAPI", type: "Service / API", id: "API-001", properties: "endpoint=/payments, protocol=HTTPS", hop: 1, scope: "扩展演示" },
  { name: "Chunk-001", type: "Chunk", id: "CHK-001", properties: "documentId=DOC-001, page=3", hop: 1, scope: "扩展演示" },
  { name: "线上交易业务", type: "Business", id: "BIZ-001", properties: "businessName=线上交易业务", hop: 3, scope: "扩展演示" },
  { name: "PG-Cluster-01", type: "Infrastructure", id: "INFRA-001", properties: "region=cn-north, vendor=示例", hop: 2, scope: "扩展演示" },
  { name: "支付服务故障处理手册.pdf", type: "Document", id: "DOC-001", properties: "classification=internal, ACL=it-ops", hop: 2, scope: "扩展演示" },
  { name: "INC-001 工单", type: "Document", id: "DOC-002", properties: "classification=internal, ACL=it-ops", hop: 2, scope: "扩展演示" },
];

export const itopsGraph: { nodes: DiagramNode[]; edges: DiagramEdge[]; legend: LegendItem[] } = {
  nodes: [
    { id: "business", label: "线上交易业务", sub: "Business · BIZ-001", kind: "business", position: { x: 0, y: 0 }, description: "扩展演示节点：业务线，用于展示三跳影响分析。", details: [{ label: "类型", value: "Business" }, { label: "ID", value: "BIZ-001" }, { label: "范围", value: "扩展演示节点（3 跳）" }] },
    { id: "order-system", label: "OrderSystem", sub: "System · SYS-001", kind: "system", position: { x: 0, y: 145 }, description: "订单系统，包含 OrderService。", details: [{ label: "类型", value: "System" }, { label: "ID", value: "SYS-001" }, { label: "属性", value: "criticality=P1" }, { label: "来源", value: "CMDB 导出" }] },
    { id: "incident", label: "Incident-001", sub: "Incident · INC-001 · P1", kind: "incident", position: { x: 520, y: 0 }, description: "支付服务故障事件，影响 PaymentService。", details: [{ label: "类型", value: "Incident" }, { label: "ID", value: "INC-001" }, { label: "severity", value: "P1" }, { label: "来源", value: "故障工单" }] },
    { id: "order-service", label: "OrderService", sub: "Service · SVC-001", kind: "service", position: { x: 260, y: 145 }, description: "订单服务，调用 PaymentService。", details: [{ label: "类型", value: "Service" }, { label: "ID", value: "SVC-001" }, { label: "status", value: "Running" }] },
    { id: "payment-service", label: "PaymentService", sub: "Service · SVC-002 · Running", kind: "service", position: { x: 520, y: 290 }, description: "图谱中心节点：支付服务，本书所有章节的一致示例实体。", details: [{ label: "类型", value: "Service" }, { label: "ID", value: "SVC-002" }, { label: "status", value: "Running" }, { label: "owner", value: "PaymentTeam" }, { label: "env", value: "Production" }], badge: "中心" },
    { id: "payment-db", label: "PaymentDB", sub: "Database · DB-001 · PostgreSQL", kind: "database", position: { x: 780, y: 145 }, description: "支付数据库，由 PaymentService 连接。", details: [{ label: "类型", value: "Database" }, { label: "ID", value: "DB-001" }, { label: "dbType", value: "PostgreSQL" }, { label: "version", value: "15（示例）" }] },
    { id: "payment-team", label: "PaymentTeam", sub: "Team · TEAM-001", kind: "team", position: { x: 780, y: 290 }, description: "支付团队，负责 PaymentService。", details: [{ label: "类型", value: "Team" }, { label: "ID", value: "TEAM-001" }, { label: "oncall", value: "payment-oncall" }] },
    { id: "production", label: "Production", sub: "Environment · ENV-PROD", kind: "environment", position: { x: 780, y: 435 }, description: "生产环境，PaymentService 部署于此。", details: [{ label: "类型", value: "Environment" }, { label: "ID", value: "ENV-PROD" }, { label: "environmentName", value: "Production" }] },
    { id: "pg-cluster", label: "PG-Cluster-01", sub: "Infrastructure · INFRA-001", kind: "infrastructure", position: { x: 1040, y: 145 }, description: "扩展演示节点：PaymentDB 依赖的数据库集群。", details: [{ label: "类型", value: "Infrastructure" }, { label: "ID", value: "INFRA-001" }, { label: "范围", value: "扩展演示节点（2 跳）" }] },
    { id: "runbook", label: "Runbook-001", sub: "Runbook · RB-001 · v2.1", kind: "runbook", position: { x: 260, y: 435 }, description: "支付服务故障处理手册，记录故障处理方法。", details: [{ label: "类型", value: "Runbook" }, { label: "ID", value: "RB-001" }, { label: "version", value: "2.1" }, { label: "来源", value: "Runbook PDF" }] },
    { id: "runbook-doc", label: "支付服务故障处理手册.pdf", sub: "Document · DOC-001", kind: "document", position: { x: 0, y: 435 }, description: "扩展演示节点：原始文档，携带权限与版本。", details: [{ label: "类型", value: "Document" }, { label: "ID", value: "DOC-001" }, { label: "ACL", value: "it-ops" }, { label: "范围", value: "扩展演示节点（2 跳）" }] },
    { id: "chunk", label: "Chunk-001", sub: "Chunk · CHK-001 · p3", kind: "chunk", position: { x: 260, y: 580 }, description: "扩展演示节点：文档第 3 页的 Chunk，提及 PaymentService。", details: [{ label: "类型", value: "Chunk" }, { label: "ID", value: "CHK-001" }, { label: "page_number", value: "3" }, { label: "范围", value: "扩展演示节点（1 跳）" }] },
    { id: "incident-doc", label: "INC-001 工单", sub: "Document · DOC-002", kind: "document", position: { x: 0, y: 580 }, description: "扩展演示节点：故障工单文档。", details: [{ label: "类型", value: "Document" }, { label: "ID", value: "DOC-002" }, { label: "ACL", value: "it-ops" }, { label: "范围", value: "扩展演示节点（2 跳）" }] },
    { id: "payment-api", label: "PaymentAPI", sub: "Service / API · API-001", kind: "service", position: { x: 520, y: 580 }, description: "扩展演示节点：支付服务暴露的 API，用于第 8 章业务链示例。", details: [{ label: "类型", value: "Service / API" }, { label: "ID", value: "API-001" }, { label: "endpoint", value: "/payments" }, { label: "范围", value: "扩展演示节点（1 跳）" }] },
  ],
  edges: [
    { id: "f1", source: "order-system", target: "order-service", label: "CONTAINS", kind: "system", animated: true, description: "核心事实 1：OrderSystem 包含 OrderService。Domain=System，Range=Service。" },
    { id: "f2", source: "order-service", target: "payment-service", label: "CALLS", kind: "service", animated: true, description: "核心事实 2：OrderService 调用 PaymentService。方向为调用方 → 被调用方。" },
    { id: "f3", source: "payment-service", target: "payment-db", label: "CONNECTS_TO", kind: "database", animated: true, description: "核心事实 3：PaymentService 连接 PaymentDB（PostgreSQL）。证据来自配置文档。" },
    { id: "f4", source: "payment-service", target: "payment-team", label: "OWNED_BY", kind: "team", animated: true, description: "核心事实 4：PaymentService 由 PaymentTeam 负责。用于“应该联系谁”。" },
    { id: "f5", source: "payment-service", target: "production", label: "DEPLOYED_IN", kind: "environment", animated: true, description: "核心事实 5：PaymentService 部署在 Production。" },
    { id: "f6", source: "incident", target: "payment-service", label: "AFFECTS", kind: "incident", animated: true, description: "核心事实 6：Incident-001 影响 PaymentService，是故障传播路径起点。" },
    { id: "f7", source: "payment-service", target: "runbook", label: "DOCUMENTED_BY", kind: "runbook", animated: true, description: "核心事实 7：Runbook-001 记录 PaymentService 的故障处理方法。" },
    { id: "f8", source: "business", target: "order-system", label: "CONTAINS", kind: "business", description: "扩展事实：业务线包含订单系统，使三跳影响分析有意义。" },
    { id: "f9", source: "incident", target: "runbook", label: "RESOLVED_BY", kind: "runbook", description: "扩展事实：该事件实际使用的处置手册（与 DOCUMENTED_BY 语义不同）。" },
    { id: "f10", source: "payment-db", target: "pg-cluster", label: "DEPENDS_ON", kind: "infrastructure", description: "扩展事实：PaymentDB 依赖数据库集群。" },
    { id: "f11", source: "runbook-doc", target: "chunk", label: "HAS_CHUNK", kind: "document", description: "扩展事实：原始文档切分出 Chunk-001，保留页码与权限。" },
    { id: "f12", source: "chunk", target: "payment-service", label: "MENTIONS", kind: "chunk", description: "扩展事实：Chunk 提及 PaymentService，把文档证据与图实体关联。" },
    { id: "f13", source: "payment-service", target: "payment-api", label: "DEPENDS_ON", kind: "service", description: "扩展事实：支付服务暴露/依赖 PaymentAPI（用于第 8 章业务链）。" },
    { id: "f14", source: "chunk", target: "incident", label: "MENTIONS", kind: "chunk", description: "扩展事实：同一 Chunk 也提及 Incident-001，说明证据可关联多个实体。" },
    { id: "f15", source: "incident-doc", target: "chunk", label: "HAS_CHUNK", kind: "document", description: "扩展事实：工单文档也切分出引用同一实体的 Chunk（教学简化）。" },
  ],
  legend: [
    { kind: "business", label: "Business" }, { kind: "system", label: "System" }, { kind: "service", label: "Service / API" },
    { kind: "database", label: "Database" }, { kind: "team", label: "Team" }, { kind: "environment", label: "Environment" },
    { kind: "incident", label: "Incident" }, { kind: "runbook", label: "Runbook" }, { kind: "document", label: "Document" },
    { kind: "chunk", label: "Chunk" }, { kind: "infrastructure", label: "Infrastructure" },
  ],
};

export interface CaseNetwork {
  id: string;
  title: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  legend: LegendItem[];
  caption: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  pain: string;
  rawData: string;
  ontology: string;
  knowledgeGraph: string;
  graphrag: string;
  architecture: string;
  tech: string;
  governance: string;
  benefit: string;
  risk: string;
  path: string;
  networkId: string;
}

export const caseNetworks: Record<string, CaseNetwork> = {
  itops: {
    id: "itops", title: "IT 运维业务链与故障传播",
    caption: "示例业务链：Business → System → Service → API → Database → Infrastructure → Team → Incident → Runbook；箭头表示依赖/影响方向，均为教学示例。",
    nodes: [
      { id: "biz", label: "线上交易业务", kind: "business", position: { x: 0, y: 0 }, description: "业务能力层。" },
      { id: "sys", label: "OrderSystem", kind: "system", position: { x: 220, y: 0 }, description: "订单系统。" },
      { id: "svc", label: "OrderService", kind: "service", position: { x: 440, y: 0 }, description: "订单服务。" },
      { id: "api", label: "PaymentAPI", kind: "service", position: { x: 660, y: 0 }, description: "支付 API。" },
      { id: "pay", label: "PaymentService", kind: "service", position: { x: 660, y: 160 }, description: "支付服务（故障点）。" },
      { id: "db", label: "PaymentDB", kind: "database", position: { x: 440, y: 160 }, description: "支付数据库。" },
      { id: "infra", label: "PG-Cluster-01", kind: "infrastructure", position: { x: 220, y: 160 }, description: "基础设施集群。" },
      { id: "team", label: "PaymentTeam", kind: "team", position: { x: 0, y: 160 }, description: "责任团队。" },
      { id: "inc", label: "Incident-001", kind: "incident", position: { x: 440, y: 320 }, description: "故障事件。" },
      { id: "rb", label: "Runbook-001", kind: "runbook", position: { x: 660, y: 320 }, description: "处置手册。" },
    ],
    edges: [
      { id: "c1", source: "biz", target: "sys", label: "CONTAINS", kind: "business", animated: true },
      { id: "c2", source: "sys", target: "svc", label: "CONTAINS", kind: "system", animated: true },
      { id: "c3", source: "svc", target: "api", label: "CALLS", kind: "service", animated: true },
      { id: "c4", source: "api", target: "pay", label: "DEPENDS_ON", kind: "service", animated: true },
      { id: "c5", source: "pay", target: "db", label: "CONNECTS_TO", kind: "database" },
      { id: "c6", source: "db", target: "infra", label: "DEPENDS_ON", kind: "infrastructure" },
      { id: "c7", source: "pay", target: "team", label: "OWNED_BY", kind: "team" },
      { id: "c8", source: "inc", target: "pay", label: "AFFECTS", kind: "incident", animated: true },
      { id: "c9", source: "inc", target: "rb", label: "RESOLVED_BY", kind: "runbook" },
      { id: "c10", source: "svc", target: "pay", label: "影响回溯", kind: "risk" },
    ],
    legend: [
      { kind: "business", label: "业务" }, { kind: "system", label: "系统" }, { kind: "service", label: "服务/API" },
      { kind: "database", label: "数据库" }, { kind: "team", label: "团队" }, { kind: "incident", label: "故障" }, { kind: "runbook", label: "手册" },
    ],
  },
  finance: {
    id: "finance", title: "金融风控关联网络（教学模型）",
    caption: "客户、账户、交易、设备、商户、地址之间的多跳关联示意；不代表任何真实客户或真实风控规则。",
    nodes: [
      { id: "cust-a", label: "客户 A", kind: "person", position: { x: 0, y: 0 }, description: "示例客户主体。" },
      { id: "cust-b", label: "客户 B", kind: "person", position: { x: 0, y: 160 }, description: "示例客户主体。" },
      { id: "acc-1", label: "账户 A1", kind: "order", position: { x: 220, y: 0 }, description: "客户 A 名下账户。" },
      { id: "acc-2", label: "账户 B1", kind: "order", position: { x: 220, y: 160 }, description: "客户 B 名下账户。" },
      { id: "device", label: "设备 D-9", kind: "device", position: { x: 440, y: 80 }, description: "两个账户曾共用同一设备（示例异常信号）。" },
      { id: "addr", label: "地址 X", kind: "location", position: { x: 660, y: 0 }, description: "登记地址。" },
      { id: "merchant", label: "商户 M", kind: "business", position: { x: 660, y: 160 }, description: "交易对手商户。" },
      { id: "txn", label: "交易 T-77", kind: "risk", position: { x: 880, y: 80 }, description: "待分析交易。" },
    ],
    edges: [
      { id: "f1", source: "cust-a", target: "acc-1", label: "OWNS", kind: "person" },
      { id: "f2", source: "cust-b", target: "acc-2", label: "OWNS", kind: "person" },
      { id: "f3", source: "acc-1", target: "device", label: "USED_DEVICE", kind: "device", animated: true },
      { id: "f4", source: "acc-2", target: "device", label: "USED_DEVICE", kind: "device", animated: true },
      { id: "f5", source: "cust-a", target: "addr", label: "REGISTERED_AT", kind: "location" },
      { id: "f6", source: "cust-b", target: "addr", label: "REGISTERED_AT", kind: "location" },
      { id: "f7", source: "acc-1", target: "txn", label: "PARTICIPATES_IN", kind: "order" },
      { id: "f8", source: "txn", target: "merchant", label: "PAYS", kind: "business" },
      { id: "f9", source: "merchant", target: "addr", label: "LOCATED_AT", kind: "location" },
    ],
    legend: [{ kind: "person", label: "客户" }, { kind: "order", label: "账户/交易" }, { kind: "device", label: "设备" }, { kind: "location", label: "地址" }, { kind: "business", label: "商户" }, { kind: "risk", label: "分析对象" }],
  },
  supply: {
    id: "supply", title: "供应链依赖与中断影响分析（教学模型）",
    caption: "供应商中断沿物料、工厂、仓储、运输、订单逐级传播；均为示例实体，不含真实业务数据。",
    nodes: [
      { id: "supplier", label: "供应商 S1", kind: "business", position: { x: 0, y: 80 }, description: "示例中断源。" },
      { id: "part", label: "零部件 P-12", kind: "device", position: { x: 220, y: 80 }, description: "关键零部件。" },
      { id: "factory", label: "工厂 F-2", kind: "location", position: { x: 440, y: 80 }, description: "组装工厂。" },
      { id: "warehouse", label: "仓库 W-3", kind: "store", position: { x: 660, y: 0 }, description: "成品仓。" },
      { id: "transport", label: "运输 T-5", kind: "process", position: { x: 660, y: 160 }, description: "干线运输。" },
      { id: "order", label: "订单 O-88", kind: "order", position: { x: 880, y: 80 }, description: "受影响客户订单。" },
      { id: "alt", label: "备选供应商 S2", kind: "app", position: { x: 0, y: 240 }, description: "缓解方案：切换供应源。" },
    ],
    edges: [
      { id: "s1", source: "supplier", target: "part", label: "SUPPLIES", kind: "business", animated: true },
      { id: "s2", source: "part", target: "factory", label: "USED_IN", kind: "device", animated: true },
      { id: "s3", source: "factory", target: "warehouse", label: "STOCKED_AT", kind: "location" },
      { id: "s4", source: "factory", target: "transport", label: "SHIPS_VIA", kind: "process" },
      { id: "s5", source: "warehouse", target: "order", label: "FULFILLS", kind: "store" },
      { id: "s6", source: "transport", target: "order", label: "DELIVERS", kind: "process" },
      { id: "s7", source: "alt", target: "part", label: "ALTERNATIVE", kind: "app" },
    ],
    legend: [{ kind: "business", label: "供应商" }, { kind: "device", label: "零部件" }, { kind: "location", label: "工厂" }, { kind: "store", label: "仓库" }, { kind: "process", label: "运输" }, { kind: "order", label: "订单" }, { kind: "app", label: "缓解方案" }],
  },
  manufacturing: {
    id: "manufacturing", title: "制造业设备与维修知识网络（教学模型）",
    caption: "设备、传感器、产线、工艺、故障与维修知识的关系；示例不代表任何真实工厂数据。",
    nodes: [
      { id: "line", label: "产线 L-3", kind: "location", position: { x: 0, y: 80 }, description: "示例产线。" },
      { id: "machine", label: "设备 M-17", kind: "device", position: { x: 220, y: 80 }, description: "关键设备。" },
      { id: "sensor", label: "传感器 S-Temp", kind: "device", position: { x: 440, y: 0 }, description: "温度采集点。" },
      { id: "process", label: "工艺 P-Weld", kind: "process", position: { x: 440, y: 160 }, description: "焊接工艺参数。" },
      { id: "fault", label: "故障 F-Overheat", kind: "incident", position: { x: 660, y: 0 }, description: "过热故障事件。" },
      { id: "manual", label: "维修手册 RB-M17", kind: "runbook", position: { x: 660, y: 160 }, description: "维修知识。" },
      { id: "case", label: "历史工单 WO-21", kind: "document", position: { x: 880, y: 80 }, description: "历史处置记录。" },
    ],
    edges: [
      { id: "m1", source: "line", target: "machine", label: "CONTAINS", kind: "location" },
      { id: "m2", source: "machine", target: "sensor", label: "HAS_SENSOR", kind: "device" },
      { id: "m3", source: "machine", target: "process", label: "RUNS_PROCESS", kind: "process" },
      { id: "m4", source: "sensor", target: "fault", label: "INDICATES", kind: "risk", animated: true },
      { id: "m5", source: "process", target: "fault", label: "RELATED_TO", kind: "risk" },
      { id: "m6", source: "fault", target: "manual", label: "RESOLVED_BY", kind: "runbook" },
      { id: "m7", source: "manual", target: "case", label: "EVIDENCE_FROM", kind: "document" },
    ],
    legend: [{ kind: "location", label: "产线" }, { kind: "device", label: "设备/传感器" }, { kind: "process", label: "工艺" }, { kind: "incident", label: "故障" }, { kind: "runbook", label: "维修知识" }, { kind: "document", label: "工单" }],
  },
};

export const caseStudies: CaseStudy[] = [
  {
    id: "itops", title: "重点案例一：企业 IT 运维", subtitle: "从故障事件到影响范围、责任团队与处置手册",
    pain: "故障发生时，架构文档、CMDB、监控告警、工单和 Runbook 分散在不同系统；值班人员难以在分钟级回答“影响哪些业务、该找谁、按哪本手册处理”。",
    rawData: "CMDB 资产清单、调用链数据、部署清单、值班表、Incident 工单、Runbook PDF、架构评审文档。",
    ontology: "建议有轻量到中等的 Ontology：System / Service / Database / Team / Incident / Runbook 等类型与关系方向必须统一，否则跨系统对齐成本极高。",
    knowledgeGraph: "强烈建议：依赖关系与影响分析天然是图问题，多跳路径是核心查询。",
    graphrag: "建议：把图事实（影响路径、责任团队）与文档证据（Runbook 原文、工单记录）融合后生成带引用答案。",
    architecture: "Document/CMDB → 解析与抽取 → Ontology Mapping + ER + Validation → Neo4j + Azure AI Search → GraphRAG Orchestrator → Copilot。",
    tech: "Neo4j 5.x、Cypher、Azure AI Search（hybrid + metadata filter）、Azure OpenAI、Python/FastAPI、Entra ID + ACL。",
    governance: "CMDB 与文档冲突、服务别名、临时变更与常态配置的时态区分、值班表时效性、Runbook 版本与审阅状态。",
    benefit: "缩短故障定位路径、把“依赖谁/谁负责/怎么处理”变成可查询事实；收益类型属于架构预期，不给出具体量化指标。",
    risk: "错误依赖边导致影响范围误判；过期 Runbook 被当成当前处置方案；跨权限文档通过图谱关联泄漏。",
    path: "先做 PaymentService 单服务 MVP → 扩展到一个业务系统 → 接入文档证据与引用 → 建立评估集与权限门禁 → 再扩展到更多业务线。",
    networkId: "itops",
  },
  {
    id: "finance", title: "重点案例二：金融风控", subtitle: "多跳关联、异常网络与知识约束",
    pain: "单个交易看似正常，但设备、地址、账户、商户之间的多跳关联可能构成可疑网络；关系型报表难以直观表达路径。",
    rawData: "客户主数据、账户与交易流水、设备指纹、商户信息、地址、历史案件标签、规则引擎日志。",
    ontology: "建议有明确语义约束：账户/交易/设备/商户的 ID 体系、关系类型与时效必须严格定义，避免把统计相关性写成事实关系。",
    knowledgeGraph: "强烈建议：关联网络、共同设备、共享地址与环路检测是典型图查询。",
    graphrag: "可选：适合辅助调查人员做“解释与证据汇总”，不应替代风控模型或规则引擎的决策逻辑。",
    architecture: "交易/主数据 → 图构建与实体对齐 → 图特征与规则引擎 → 调查工作台（可叠加 RAG 做案情摘要与证据引用）。",
    tech: "图数据库或图计算引擎、流批一体数据管道、规则引擎、特征平台、严格的审计与权限隔离。",
    governance: "个人信息脱敏、数据最小化、用途限定、决策可解释与审计留痕、跨系统 ID 对齐与合规性要求。",
    benefit: "提升关联线索发现与调查效率，输出可解释路径；不承诺任何检出率或误报率改进数字。",
    risk: "GraphRAG 生成的自然语言解释被误当作风控判定；图关联产生歧视性或不当推断；敏感属性泄漏。",
    path: "先做只读调查辅助与证据聚合 → 与规则引擎输出对账 → 建立人工复核闭环 → 再评估是否进入流程自动化。",
    networkId: "finance",
  },
  {
    id: "supply", title: "重点案例三：供应链", subtitle: "供应中断后的影响传播分析",
    pain: "单一供应商中断会沿零部件、工厂、仓储、运输、订单逐级传播，ERP 表格难以快速回答“哪些订单会延迟”。",
    rawData: "BOM、供应商主数据、工厂产能、库存、运输计划、订单与交付承诺。",
    ontology: "建议有中等 Ontology：物料、工厂、订单等概念跨系统命名差异大，需要统一语义与关系方向。",
    knowledgeGraph: "强烈建议：多层级 BOM 与依赖链是典型多跳路径查询。",
    graphrag: "可选：适合把路径结果与合同/公告/邮件等文本证据结合，生成人类可读的影响说明。",
    architecture: "ERP/BOM → 图构建与版本化 → 路径/影响分析 → 结果表或调查式问答（叠加文档证据）。",
    tech: "图数据库、批处理调度、数据版本与有效期、BI 看板、可选 RAG 解释层。",
    governance: "BOM 版本与生效日期、替代料关系、产能数据更新频率、跨组织数据共享边界。",
    benefit: "把中断影响从人工逐层排查变为可查询路径，辅助优先级排序；收益为定性预期。",
    risk: "忽略替代供应商和生效时间导致过度告警；把旧 BOM 当成当前结构；跨企业数据共享权限复杂。",
    path: "从一个关键零部件与一条产线开始 → 引入版本/时态 → 与 ERP 对账 → 再扩展到多工厂。",
    networkId: "supply",
  },
  {
    id: "manufacturing", title: "重点案例四：制造业", subtitle: "设备、传感器、工艺与维修知识",
    pain: "设备告警、工艺参数、历史故障与维修手册分散，现场工程师难以快速获得“同类故障过去怎么修”的证据链。",
    rawData: "时序传感器数据、设备台账、工艺配方、故障代码、维修工单、维修手册与图纸。",
    ontology: "建议轻量 Ontology：统一设备/传感器/故障代码/工艺/知识文档的类型与关系，时序数据不必全部入图。",
    knowledgeGraph: "建议：设备组成、故障与知识之间的关联适合用图表达；高频时序数据应留在时序库。",
    graphrag: "可选：适合故障知识问答与证据聚合，但不能替代设备控制、预测性维护模型或安全联锁。",
    architecture: "时序库 + 设备主数据 → 知识图谱（结构关系） + 文档索引（手册/工单） → 检索问答与证据引用。",
    tech: "时序数据库、Neo4j 或其他图存储、文档索引、Embedding、检索编排、权限与审计。",
    governance: "设备编号统一、故障代码版本、手册适用机型范围、工艺参数保密、工单数据质量与时效性。",
    benefit: "把维修经验与设备上下文关联起来，缩短证据检索路径；收益为定性预期。",
    risk: "把相似但不适用机型的维修步骤推荐给现场；忽略工艺参数版本；跨厂区权限隔离不足。",
    path: "选单一机型与高频故障 → 建立知识关联与引用 → 人工验证答案 → 再扩展到更多产线。",
    networkId: "manufacturing",
  },
];
