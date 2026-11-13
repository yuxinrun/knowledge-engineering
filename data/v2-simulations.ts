/**
 * V2 交互工具的确定性模拟数据。
 * 所有执行轨迹、工具输出、状态与指标均为本地模拟，不连接任何真实服务。
 */

import { SIMULATION_NOTICE } from "@/data/v2-model";

export const DEFAULT_AGENTIC_QUERY =
  "PaymentService 最近故障的原因是什么？影响哪些业务？是否存在类似历史故障？应该采取什么措施？";

export interface AgenticSubTask {
  id: string;
  label: string;
  tool: string;
  rationale: string;
  result: string;
  evidenceIds: string[];
  confidence: number;
}

export interface AgenticPlan {
  intent: string;
  complexity: "single" | "multi";
  subTasks: AgenticSubTask[];
  strategy: string;
  stopRule: string;
}

export const AGENTIC_PRESETS: { id: string; label: string; query: string }[] = [
  { id: "incident", label: "IT 故障调查（默认）", query: DEFAULT_AGENTIC_QUERY },
  { id: "metric", label: "指标口径核对", query: "本季度 PaymentService 的 MTTR 是多少？这个口径和可用性报表一致吗？" },
  { id: "asset", label: "设备维护分析", query: "Machine-001 的振动告警是什么原因？影响哪些产线？有没有类似历史维修记录？" },
  { id: "simple", label: "简单事实查询", query: "PaymentService 由哪个团队负责？" },
];

/**
 * 确定性规划逻辑：依据关键词推导子任务与工具，不调用任何模型。
 * 输入相同必然得到相同轨迹，便于教学与回归验证。
 */
export function planAgenticQuery(rawQuery: string): AgenticPlan {
  const q = rawQuery.toLowerCase();
  const isSimple = /^(谁|哪个|what is|who)/i.test(rawQuery.trim()) && q.length < 30;
  const wantsCause = /原因|根因|为什么|why|cause|告警|故障/.test(q);
  const wantsImpact = /影响|业务|依赖|impact|affect|产线/.test(q);
  const wantsHistory = /历史|类似|以前|以往|history|similar/.test(q);
  const wantsAction = /措施|怎么办|建议|处置|action|recommend|维修/.test(q);
  const wantsMetric = /mttr|可用率|指标|口径|metric|availability|变更失败率/.test(q);
  const isAsset = /machine|设备|振动|sensor|产线|motor|工厂/.test(q);

  const subTasks: AgenticSubTask[] = [];
  if (wantsCause || isAsset) subTasks.push({
    id: "ST-1", label: isAsset ? "确认告警设备与当前状态" : "定位 INC-001 的直接原因候选",
    tool: isAsset ? "graph_query" : "graph_query",
    rationale: isAsset ? "状态与资产层级是结构化事实，优先用图查询取得稳定 ID。" : "原因涉及实体关系与变更关联，优先用受控图查询而不是自由文本检索。",
    result: isAsset
      ? "MCH-001 (Machine-001) -[:HAS_COMPONENT]-> CMP-001 (Motor-001) -[:MONITORED_BY]-> SNS-001；Twin State = Warning（模拟）。"
      : "INC-001 -[:AFFECTS]-> SVC-002；CHK-001 -[:CHANGED]-> SVC-002；SVC-002 -[:CONNECTS_TO]-> DB-001。变更与连接池配置为候选因素，尚不能判定因果。",
    evidenceIds: isAsset ? ["EVD-MF-003", "EVD-MF-004", "EVD-MF-006"] : ["EVD-REL-009", "EVD-REL-014", "EVD-REL-006"],
    confidence: isAsset ? 0.93 : 0.88,
  });
  if (wantsImpact) subTasks.push({
    id: "ST-2", label: "计算影响范围与业务归属",
    tool: "graph_query",
    rationale: "影响面需要沿 DEPENDS_ON / CONTAINS / IMPACTS 方向做受限跳数遍历，单次向量检索无法给出完整路径。",
    result: "SVC-002 ←CALLS— SVC-001 ←CONTAINS— SYS-001 ←CONTAINS— BIZ-001；INC-001 -[:IMPACTS]-> BIZ-001（审批状态 Pending，演示数据）。",
    evidenceIds: ["EVD-REL-004", "EVD-REL-002", "EVD-REL-010"],
    confidence: 0.76,
  });
  if (wantsHistory) subTasks.push({
    id: "ST-3", label: "检索相似历史故障",
    tool: "vector_search",
    rationale: "历史复盘的叙述性描述适合文档向量检索，再用实体 ID 与图结果对齐。",
    result: "命中 DOC-001《Incident Postmortem INC-001》#C07 与 INC-002 历史工单；INC-001 -[:SIMILAR_TO]-> INC-002（相似度 0.72，待人工复核）。",
    evidenceIds: ["EVD-DOC-001", "EVD-REL-016", "EVD-INC-002"],
    confidence: 0.72,
  });
  if (wantsAction) subTasks.push({
    id: "ST-4", label: "查找处置建议与 Runbook",
    tool: "document_search",
    rationale: "处置步骤来自受控文档，必须返回可引用片段与版本，不能由模型自行编造。",
    result: "RB-001《Payment Degradation Runbook》v1.3 建议：核对连接池配置、回滚变更、验证 SLO；任何执行动作需值班经理审批。",
    evidenceIds: ["EVD-RB-001", "EVD-REL-011"],
    confidence: 0.9,
  });
  if (wantsMetric) subTasks.push({
    id: "ST-5", label: "核对指标定义与口径版本",
    tool: "semantic_query",
    rationale: "数值类问题必须走语义层取得审批过的口径，禁止直接拼物理 SQL。",
    result: "MTTR = AVG(recovered_at - acknowledged_at)，MET-002 v2.0，不含 MTTD；与可用性报表 MET-003 v3.1 的口径不同，两者不可直接比较。",
    evidenceIds: ["MET-002", "MET-003"],
    confidence: 0.95,
  });
  if (isSimple || subTasks.length === 0) subTasks.push({
    id: "ST-0", label: "单跳事实查询",
    tool: "graph_query",
    rationale: "问题可由单个结构化事实回答，无需多步规划；这正是应该坚持单次检索的场景。",
    result: "SVC-002 (PaymentService) -[:OWNED_BY]-> TEAM-001 (Payments Platform Team)。",
    evidenceIds: ["EVD-REL-007"],
    confidence: 0.95,
  });

  const complexity = subTasks.length <= 1 ? "single" : "multi";
  return {
    intent: isSimple || subTasks.length <= 1 ? "单跳事实查询" : isAsset ? "设备状态与维护分析" : wantsMetric ? "指标口径核对" : "多子问题故障调查",
    complexity,
    subTasks,
    strategy: complexity === "single"
      ? "单次 RAG / 受控图查询即可，不启用迭代循环（避免不必要的延迟与成本）。"
      : "混合策略：结构化关系走 graph_query，叙述性证据走 vector_search / document_search，数值口径走 semantic_query。",
    stopRule: "证据覆盖全部子任务且引用校验通过；或达到 3 轮 / 8 次工具调用 / 12s 预算；或连续 2 次工具失败。",
  };
}

export interface AgenticStep {
  no: number;
  title: string;
  phase: string;
  tool: string;
  input: string;
  output: string;
  reason: string;
  evidence: string[];
  latencyMs: number;
  tokens: number;
  status: "done" | "conditional" | "hitl";
  branchNote?: string;
}

export const AGENTIC_STEPS: AgenticStep[] = [
  {
    no: 1, title: "Planner 分析任务", phase: "Planning", tool: "agent_planner",
    input: "User Query + 用户身份 + 可用工具清单 + 预算上限",
    output: "意图 = 多子问题故障调查；需要原因、影响、历史相似、处置建议四类证据；判定为 complex。",
    reason: "问题包含四个并列疑问，单次检索无法保证覆盖；先判断是否值得进入 Agent Loop。",
    evidence: ["TRACE-001"], latencyMs: 210, tokens: 420, status: "done",
  },
  {
    no: 2, title: "拆分为多个子问题", phase: "Query Decomposition", tool: "query_decomposer",
    input: "Step 1 的意图与工具清单",
    output: "ST-1 原因候选（graph）／ST-2 影响范围（graph）／ST-3 历史相似（vector）／ST-4 处置建议（document）。",
    reason: "每个子问题绑定一种检索策略与可验证的产出类型，避免用一个模糊查询覆盖全部。",
    evidence: ["TRACE-002"], latencyMs: 180, tokens: 380, status: "done",
  },
  {
    no: 3, title: "调用图谱查询", phase: "Retrieval Strategy Selection", tool: "graph_query",
    input: "MATCH (i:Incident {id:'INC-001'})-[r]->(n) RETURN ...（参数化、限深 3、subject 过滤）",
    output: "INC-001 → AFFECTS → SVC-002 → CONNECTS_TO → DB-001；CHK-001 → CHANGED → SVC-002。",
    reason: "原因与依赖是有方向的图事实；只读模板保证不会执行任意查询。",
    evidence: ["EVD-REL-009", "EVD-REL-014", "EVD-REL-006"], latencyMs: 96, tokens: 120, status: "done",
  },
  {
    no: 4, title: "调用文档向量检索", phase: "Iterative Retrieval", tool: "vector_search",
    input: "query='PaymentService timeout incident postmortem' topK=5 filter=classification<=Confidential",
    output: "DOC-001#C07（复盘）、DOC-002#03（架构说明）、RB-001#02（Runbook）等候选片段。",
    reason: "历史与叙述性证据用向量检索召回；ACL 过滤在检索阶段执行，不在答案阶段遮掩。",
    evidence: ["EVD-DOC-001", "EVD-DOC-002"], latencyMs: 132, tokens: 150, status: "done",
  },
  {
    no: 5, title: "调用历史 Incident 查询", phase: "Iterative Retrieval", tool: "business_api",
    input: "GET /itsm/incidents?service=SVC-002&lookback=180d（白名单、只读、最小字段）",
    output: "INC-002（2026-02-03，PaymentDB 饱和，P2，已关闭）；INC-001 -[:SIMILAR_TO]-> INC-002 相似度 0.72。",
    reason: "历史故障是业务系统实时数据，调用受控 API 比从静态文档推断更可靠。",
    evidence: ["EVD-INC-002", "EVD-REL-016"], latencyMs: 168, tokens: 140, status: "done",
  },
  {
    no: 6, title: "整合证据", phase: "Evidence Evaluation", tool: "evidence_fusion",
    input: "Step 3–5 的候选证据 + 来源权威性 + 有效时间 + 密级",
    output: "原因候选 2 条、影响路径 1 条、历史相似 1 条、处置建议 1 条；冲突项：DOC-001 审批状态 Pending。",
    reason: "按来源权威性与时间裁决冲突；LLM 抽取置信度不参与权威性排序。",
    evidence: ["EVD-REL-009", "EVD-DOC-001", "EVD-INC-002"], latencyMs: 74, tokens: 260, status: "done",
  },
  {
    no: 7, title: "检查证据是否充分", phase: "Reflection", tool: "sufficiency_check",
    input: "子任务覆盖矩阵 + 引用可回溯性 + 权限一致性",
    output: "ST-1/2/3/4 均有证据，但「变更是否为根因」仅有时间关联（Pending 审批），判定为不充分。",
    reason: "时间接近不等于因果；缺少变更评审结论时不能把候选写成结论。",
    evidence: ["TRACE-007"], latencyMs: 88, tokens: 190, status: "conditional",
    branchNote: "若判定为充分 → 直接跳到 Step 9；此处因证据不足触发补充检索。",
  },
  {
    no: 8, title: "必要时再次检索", phase: "Iterative Retrieval (loop 2)", tool: "document_search",
    input: "query='CHG-2026-0417 change review rollback decision' filter=Confidential",
    output: "补充命中变更评审记录：变更与事件时间接近，但评审未确认因果；证据充分度由 0.68 提升到 0.81，仍未达 0.90 阈值。",
    reason: "有界迭代：本轮为第 2 轮，仍未达阈值但已接近轮次上限，按停止条件退出循环并显式标注不确定性。",
    evidence: ["EVD-CHK-001", "TRACE-008"], latencyMs: 121, tokens: 210, status: "conditional",
  },
  {
    no: 9, title: "生成有引用的答案", phase: "Answer Synthesis + Citation Verification", tool: "citation_verifier",
    input: "候选答案 + 每条论断对应的 Evidence ID",
    output: "答案包含 4 段结论，逐条附 [E1]–[E6] 引用；未通过引用校验的「变更即根因」论断被删除。",
    reason: "每条论断必须能回指到具体证据；无法回指的内容不进入最终答案。",
    evidence: ["E1", "E2", "E3", "E4", "E5", "E6"], latencyMs: 165, tokens: 560, status: "done",
  },
  {
    no: 10, title: "输出不确定性和待人工确认事项", phase: "Human-in-the-loop", tool: "response_validator",
    input: "证据充分度 0.81 + 审批状态 Pending + 权限复核结果",
    output: "明确标注：变更与故障的因果关系未经确认；INC-001→BIZ-001 影响关系待审批；DOC-001 处于 Pending；建议由值班经理复核后再执行任何处置。",
    reason: "敏感操作必须人工审批；输出不确定性比给出看似确定的错误结论更安全。",
    evidence: ["TRACE-010"], latencyMs: 42, tokens: 180, status: "hitl",
  },
];

export const AGENTIC_CITATIONS: { id: string; text: string; source: string; status: string }[] = [
  { id: "E1", text: "INC-001 -[:AFFECTS]-> SVC-002（PaymentService）", source: "Graph Record · EVD-REL-009 · v1.2", status: "Approved" },
  { id: "E2", text: "SVC-002 -[:CONNECTS_TO]-> DB-001（PaymentDB）", source: "CMDB · EVD-REL-006 · v1.3", status: "Approved" },
  { id: "E3", text: "SVC-001 -[:CALLS]-> SVC-002，SYS-001 -[:CONTAINS]-> SVC-001", source: "Graph Record · EVD-REL-004 / EVD-REL-002", status: "Approved" },
  { id: "E4", text: "INC-001 -[:IMPACTS]-> BIZ-001（业务影响）", source: "ITSM · EVD-REL-010 · v1.0", status: "Pending" },
  { id: "E5", text: "INC-002 历史故障：PaymentDB 饱和（2026-02-03）", source: "ITSM · EVD-INC-002", status: "Approved" },
  { id: "E6", text: "RB-001 建议核对连接池配置并回滚变更，执行需审批", source: "Runbook · EVD-RB-001 · v1.3", status: "Approved" },
];

export const AGENTIC_FINAL_ANSWER = [
  { text: "已确认：INC-001 影响 PaymentService（SVC-002），该服务连接 PaymentDB（DB-001）。", citations: ["E1", "E2"] },
  { text: "影响范围（按图路径）：OrderService（SVC-001）调用 PaymentService，二者属于 OrderSystem（SYS-001），因此在线订单业务（BIZ-001）可能受影响；该业务影响关系在演示数据中仍为 Pending 审批。", citations: ["E3", "E4"] },
  { text: "历史相似：INC-002（2026-02-03，PaymentDB 饱和，P2）与本次事件存在相似特征，相似度为演示值 0.72，需人工复核。", citations: ["E5"] },
  { text: "建议措施（仅为建议，不构成执行指令）：按 RB-001 核对连接池配置、评估回滚 CHK-001、验证 SLO；执行前须值班经理审批。", citations: ["E6"] },
  { text: "不确定性：变更 CHK-001 与事件时间接近，但现有证据不能证明因果关系；DOC-001 复盘文档审批状态为 Pending，来源权威性尚未确认。", citations: ["E4"] },
];

/* ------------------------------------------------------------------ *
 * Knowledge Agent：7 个逻辑角色、工具注册表、参考架构节点
 * ------------------------------------------------------------------ */
export interface AgentRole {
  id: string;
  name: string;
  cn: string;
  responsibility: string;
  tools: string[];
  inputs: string;
  outputs: string;
  permissions: string;
  failureHandling: string;
  boundary: string;
  kind: string;
}

export const agentRoles: AgentRole[] = [
  { id: "search-agent", name: "Knowledge Search Agent", cn: "企业知识搜索", kind: "orchestrator",
    responsibility: "统一接收检索意图，选择文档 / 术语 / 图 / 指标等取证路径并汇总候选证据。",
    tools: ["vector_search", "keyword_search", "glossary_lookup"],
    inputs: "用户问题 + subject + 会话上下文", outputs: "带来源与分数的候选证据集",
    permissions: "只读；继承用户密级；不得访问未登记数据源",
    failureHandling: "检索无命中 → 返回空证据并说明覆盖缺口；连续失败 2 次 → 降级为人工检索建议",
    boundary: "不写库、不调用写操作 API、不擅自放宽 ACL" },
  { id: "ontology-agent", name: "Ontology Agent", cn: "业务概念理解", kind: "ontology",
    responsibility: "解释业务概念、类型与语义关系，把口语化表述映射到规范类型与术语。",
    tools: ["ontology_lookup", "glossary_lookup", "shacl_validate"],
    inputs: "自然语言实体 / 概念表述", outputs: "规范概念 ID、类型约束、同义词",
    permissions: "只读本体与术语登记；不得修改类层次",
    failureHandling: "无法映射 → 返回候选概念并要求用户澄清，不猜测",
    boundary: "不产生事实断言、不创建实体" },
  { id: "graph-agent", name: "Graph Agent", cn: "受控图查询", kind: "graph",
    responsibility: "执行参数化、限深、只读的图查询，返回路径与子图。",
    tools: ["graph_query", "path_query"],
    inputs: "锚实体 ID + 关系类型 + 跳数 + subject", outputs: "关系路径 + 每跳证据 ID",
    permissions: "只读；按 classification 剪枝；禁止任意 Cypher 拼接",
    failureHandling: "超时 / 无路径 → 返回空路径与查询模板，不降级为全图扫描",
    boundary: "不得绕过权限访问图数据库；不得写入图谱" },
  { id: "document-agent", name: "Document Agent", cn: "原始文档检索", kind: "store",
    responsibility: "检索原文片段并返回可定位的引用（文档 ID、页码、Chunk、版本）。",
    tools: ["vector_search", "document_fetch"],
    inputs: "查询 + ACL 过滤 + 版本约束", outputs: "Chunk 文本 + 引用坐标 + 审批状态",
    permissions: "只读；检索阶段应用 ACL；Pending 文档需标注",
    failureHandling: "文档缺失或已过期 → 标记 stale 并中止引用，不静默替换",
    boundary: "不得把 LLM 摘要当作原文引用" },
  { id: "data-agent", name: "Data Agent", cn: "结构化业务数据", kind: "process",
    responsibility: "通过语义查询或受控 API 取得结构化指标与业务事实。",
    tools: ["semantic_query", "business_api"],
    inputs: "业务概念 + 维度 + 时间范围 + subject", outputs: "带口径版本与单位的结果",
    permissions: "仅预定义指标与只读 API；禁止生成任意 SQL",
    failureHandling: "口径冲突 → 返回版本差异并转人工裁决",
    boundary: "不得绕过语义层直接拼物理字段" },
  { id: "incident-agent", name: "Incident Agent", cn: "故障分析", kind: "incident",
    responsibility: "组装原因候选、影响路径、历史相似与处置建议，输出不确定性与待确认项。",
    tools: ["graph_query", "vector_search", "business_api", "document_search"],
    inputs: "Incident ID / Service ID + 上下文", outputs: "证据链 + 根因候选（非结论）+ 建议",
    permissions: "只读；敏感结论需标注审批状态",
    failureHandling: "证据不足 → 明确说明缺口并转人工，不补全推测",
    boundary: "不自动执行重启、回滚、变更等敏感操作" },
  { id: "governance-agent", name: "Governance Agent", cn: "权限与合规检查", kind: "security",
    responsibility: "在工具调用前校验白名单与最小权限，在回答前校验引用、密级与审计完整性。",
    tools: ["permission_check", "policy_eval", "audit_write", "approval_request"],
    inputs: "工具请求 + subject + 资源密级 + 候选答案", outputs: "允许/拒绝/脱敏/转人工 + 审计事件",
    permissions: "策略只读 + 审计只写；无业务数据读取权限",
    failureHandling: "策略服务不可用 → 默认拒绝（fail-closed），不降级放行",
    boundary: "不得被其他 Agent 覆盖或跳过；敏感操作必须人工审批" },
];

export interface ToolDefinition {
  id: string;
  name: string;
  category: "图" | "文档" | "语义" | "业务" | "治理" | "本体";
  description: string;
  permission: string;
  risk: "低" | "中" | "高";
  requiresApproval: boolean;
}

export const toolRegistry: ToolDefinition[] = [
  { id: "graph_query", name: "Graph Query", category: "图", description: "参数化只读图查询，限深、必带 subject 与密级过滤。", permission: "role: graph-reader + ABAC", risk: "中", requiresApproval: false },
  { id: "path_query", name: "Path Query", category: "图", description: "限深路径遍历，返回每跳证据 ID。", permission: "role: graph-reader + ABAC", risk: "中", requiresApproval: false },
  { id: "vector_search", name: "Vector Search", category: "文档", description: "Chunk 语义检索，检索阶段应用 ACL 过滤。", permission: "role: doc-reader + ACL", risk: "中", requiresApproval: false },
  { id: "keyword_search", name: "Keyword Search", category: "文档", description: "精确词与编号检索，与向量召回互补。", permission: "role: doc-reader + ACL", risk: "低", requiresApproval: false },
  { id: "document_fetch", name: "Document Fetch", category: "文档", description: "按引用坐标取回原文片段与版本。", permission: "role: doc-reader + ACL", risk: "中", requiresApproval: false },
  { id: "ontology_lookup", name: "Ontology Lookup", category: "本体", description: "查询类层次、属性与约束定义。", permission: "role: knowledge-viewer", risk: "低", requiresApproval: false },
  { id: "glossary_lookup", name: "Glossary Lookup", category: "本体", description: "查询经审批的业务术语与同义词。", permission: "role: knowledge-viewer", risk: "低", requiresApproval: false },
  { id: "shacl_validate", name: "Shape Validation", category: "本体", description: "校验候选知识对象是否符合形状约束。", permission: "role: pipeline-service", risk: "低", requiresApproval: false },
  { id: "semantic_query", name: "Semantic Query", category: "语义", description: "按业务指标与维度生成受控查询，返回口径版本。", permission: "role: metric-consumer + ABAC", risk: "中", requiresApproval: false },
  { id: "business_api", name: "Business API", category: "业务", description: "白名单只读业务接口（ITSM / MES / CMDB）。", permission: "service scope: read:incidents", risk: "中", requiresApproval: false },
  { id: "permission_check", name: "Permission Check", category: "治理", description: "按 subject 与资源属性执行允许/拒绝判定。", permission: "policy engine", risk: "低", requiresApproval: false },
  { id: "audit_write", name: "Audit Write", category: "治理", description: "追加不可篡改的工具调用与答案审计事件。", permission: "role: audit-writer", risk: "低", requiresApproval: false },
  { id: "approval_request", name: "Human Approval", category: "治理", description: "创建人工审批任务，未通过前不执行敏感动作。", permission: "role: approver", risk: "高", requiresApproval: true },
  { id: "actuation", name: "Controlled Actuation", category: "业务", description: "受控执行（如变更、设备控制）；仅演示占位，不提供真实执行。", permission: "role: operator + dual control", risk: "高", requiresApproval: true },
];

export const toolById: Record<string, ToolDefinition> = Object.fromEntries(toolRegistry.map((t) => [t.id, t]));

export const knowledgeAgentFlow: { id: string; label: string; sub: string; kind: string }[] = [
  { id: "user", label: "User", sub: "请求 + 身份", kind: "app" },
  { id: "identity", label: "Identity and Permission", sub: "subject / 组 / 密级", kind: "security" },
  { id: "runtime", label: "Agent Runtime", sub: "会话、预算、轨迹", kind: "orchestrator" },
  { id: "planner", label: "Planner", sub: "规划与分解", kind: "llm" },
  { id: "context", label: "Knowledge Context", sub: "概念 / 记忆 / 口径", kind: "concept" },
  { id: "registry", label: "Tool Registry", sub: "白名单 + schema", kind: "store" },
  { id: "ontology", label: "Ontology Service", sub: "类型与约束", kind: "ontology" },
  { id: "graph", label: "Knowledge Graph", sub: "实体关系事实", kind: "graph" },
  { id: "doc", label: "Document Search", sub: "原文与引用", kind: "store" },
  { id: "semantic", label: "Enterprise Semantic Layer", sub: "指标口径", kind: "ontology" },
  { id: "apis", label: "Business APIs", sub: "ITSM / MES / CMDB", kind: "process" },
  { id: "validation", label: "Response Validation", sub: "证据 / 引用 / 权限", kind: "security" },
  { id: "audit", label: "Audit and Monitoring", sub: "轨迹与告警", kind: "security" },
];

/* ------------------------------------------------------------------ *
 * 治理生命周期与数字孪生辅助数据
 * ------------------------------------------------------------------ */
export const governanceLifecycle: { id: string; label: string; en: string; detail: string; owner: string; control: string }[] = [
  { id: "GL-01", label: "Source", en: "来源登记", detail: "登记来源系统、责任人、提供时间与许可范围。", owner: "Data Owner", control: "Source ID + 责任人" },
  { id: "GL-02", label: "Ingestion", en: "接入", detail: "记录批次、原始哈希、重试与幂等键。", owner: "Data Engineering", control: "批次日志 / 可重放" },
  { id: "GL-03", label: "Validation", en: "校验", detail: "格式、类型、必填项与形状约束校验。", owner: "Pipeline", control: "SHACL / Schema 校验" },
  { id: "GL-04", label: "Classification", en: "分类分级", detail: "确定密级、用途限制与保留策略。", owner: "Data Governance", control: "Public→Restricted" },
  { id: "GL-05", label: "Transformation", en: "转换", detail: "归一化、单位统一与可逆映射。", owner: "Data Engineering", control: "转换日志 + 原值" },
  { id: "GL-06", label: "Knowledge Extraction", en: "知识抽取", detail: "抽取实体与关系，附带证据坐标与置信度。", owner: "Knowledge Pipeline", control: "Evidence + Confidence" },
  { id: "GL-07", label: "Entity Resolution", en: "实体消歧", detail: "候选、评分、裁决与可回滚合并。", owner: "MDM / Steward", control: "Canonical ID + 轨迹" },
  { id: "GL-08", label: "Knowledge Fusion", en: "知识融合", detail: "按来源权威性与有效时间裁决冲突。", owner: "Steward", control: "冲突记录 + 版本" },
  { id: "GL-09", label: "Approval", en: "审核", detail: "业务或治理责任人确认后方可发布。", owner: "Knowledge Owner", control: "Approval Status" },
  { id: "GL-10", label: "Publication", en: "发布", detail: "写入图、索引与目录，策略随对象下发。", owner: "Platform", control: "Version + Access Policy" },
  { id: "GL-11", label: "Monitoring", en: "监控", detail: "质量、漂移、过期与权限覆盖持续检测。", owner: "SRE / Governance", control: "质量评分 + 告警" },
  { id: "GL-12", label: "Expiration / Deletion", en: "过期与删除", detail: "原文更新联动重抽取；删除联动清理向量、图谱派生事实与缓存答案。", owner: "Governance", control: "Retention + Tombstone" },
];

export const governanceQuestions: { q: string; a: string; field: string }[] = [
  { q: "知识来自哪里？", a: "记录 Source ID、来源系统、连接器批次与原始文件哈希。", field: "source / evidence" },
  { q: "谁提供的？", a: "登记 Data Owner 与提供时间，责任可追。", field: "owner / transactionTime" },
  { q: "什么时候产生？", a: "区分业务发生时间与系统观测时间。", field: "validTime / transactionTime" },
  { q: "什么时候生效？", a: "用有效时间区间表达，不用「当前值」覆盖历史。", field: "validTime" },
  { q: "谁审核？", a: "记录审批人、审批时间与状态；Pending 内容不得作为权威结论。", field: "approvalStatus / approvedBy" },
  { q: "是否可信？", a: "由来源权威性、审批状态与复核周期共同决定；LLM 置信度不等于来源权威性。", field: "authority / confidence" },
  { q: "是否与其他来源冲突？", a: "保留冲突记录与裁决依据，不静默覆盖。", field: "conflict / fusion" },
  { q: "哪些用户可以查看？", a: "按 RBAC/ABAC 与密级在检索、遍历、融合、生成四阶段一致执行。", field: "classification / accessPolicy" },
  { q: "原文更新后图谱如何同步？", a: "通过血缘反查受影响 Chunk、实体与关系，触发重抽取与版本递增，重新审批后发布。", field: "lineage / version" },
  { q: "文档删除后向量和图谱如何清理？", a: "沿血缘级联删除索引项、仅由该文档支撑的派生事实与缓存答案，写入 tombstone 与审计事件。", field: "retention / deletion" },
];

export const simulationNotice = SIMULATION_NOTICE;
