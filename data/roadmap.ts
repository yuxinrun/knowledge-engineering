export interface RoadmapPhase {
  id: string;
  phase: string;
  title: string;
  startWeek: number;
  endWeek: number;
  goal: string;
  deliverables: string[];
  stack: string[];
  acceptance: string[];
  risks: string[];
  nextGate: string;
  tone: "blue" | "cyan" | "purple" | "green" | "amber" | "rose" | "neutral";
}

/** 排期仅为规划估算，不是保证工期；实际取决于数据质量、团队规模与审批流程。 */
export const roadmapPhases: RoadmapPhase[] = [
  {
    id: "phase1", phase: "Phase 1", title: "业务场景和数据盘点", startWeek: 1, endWeek: 2, tone: "blue",
    goal: "选定 1~2 个高价值、边界清晰的问题，盘点数据来源、权限与更新频率。",
    deliverables: ["场景说明与 Competency Questions", "数据源清单（来源/密级/owner/更新频率）", "基线：当前人工流程与评估口径"],
    stack: ["数据目录", "访谈纪要", "权限矩阵"],
    acceptance: ["至少 10 个可回答/不可回答的业务问题被明确定义", "所有数据源有 owner、ACL 与更新时间", "明确不做什么（场景边界）"],
    risks: ["场景过大（如“全企业知识问答”）", "数据源无权访问或权限继承不清晰"],
    nextGate: "问题可判定对错，且数据来源与权限可获得。",
  },
  {
    id: "phase2", phase: "Phase 2", title: "Ontology MVP", startWeek: 3, endWeek: 5, tone: "purple",
    goal: "只建模回答场景所需的最小概念集，先保证语义一致与关系方向统一。",
    deliverables: ["Class Hierarchy", "Object/Data Property 表", "OWL 片段 + SHACL Shapes", "本体版本与评审记录"],
    stack: ["Protégé", "OWL 2 / Turtle", "SHACL / pyshacl"],
    acceptance: ["示例业务事实能 100% 映射到本体类型与关系", "SHACL 能检出故意注入的 3 类错误数据", "所有关系有明确 Domain / Range / 方向"],
    risks: ["过度建模（追求“完整企业本体”）", "把运行状态建成子类", "OWL 与属性图映射未定义"],
    nextGate: "本体能覆盖评估问题中的全部实体与关系类型。",
  },
  {
    id: "phase3", phase: "Phase 3", title: "Knowledge Graph MVP", startWeek: 6, endWeek: 9, tone: "cyan",
    goal: "把一小批权威数据（而非全量文档）构建成可信的图谱，打通抽取到写入链路。",
    deliverables: ["Extraction Schema", "Entity Resolution 规则与标注集", "Neo4j Schema + Cypher 脚本", "Provenance 与审计日志"],
    stack: ["Python / Pydantic", "Azure OpenAI", "Neo4j 5.x", "任务队列"],
    acceptance: ["实体/关系抽取在标注集上有可测量 Precision/Recall", "唯一约束生效，无重复节点", "影响分析查询答案与人工核对一致"],
    risks: ["LLM 抽取幻觉直接写库", "错误自动合并不可回滚", "MERGE 只依赖名称"],
    nextGate: "图谱关键路径经人工核验，且可回放任意一条事实的来源。",
  },
  {
    id: "phase4", phase: "Phase 4", title: "Traditional RAG / Hybrid Retrieval", startWeek: 10, endWeek: 13, tone: "green",
    goal: "先建立文档检索基线，作为 GraphRAG 是否真的带来增量的对照组。",
    deliverables: ["Chunk 切分策略", "Azure AI Search Index", "Keyword/Vector/Hybrid 检索", "ACL filter 与引用展示"],
    stack: ["Azure AI Search", "Embedding 部署", "RRF / Semantic Ranker"],
    acceptance: ["Retrieval Recall@K 在评估集上可测量", "权限过滤下推到检索阶段", "答案每条结论可点回 chunk_id"],
    risks: ["向量维度与模型版本不匹配", "只在前端隐藏敏感信息", "没有基线，无法证明 GraphRAG 增量"],
    nextGate: "基线指标可复现，且文档检索无法回答的问题被明确记录。",
  },
  {
    id: "phase5", phase: "Phase 5", title: "GraphRAG MVP", startWeek: 14, endWeek: 18, tone: "blue",
    goal: "把图事实与文档证据融合，实现带引用的多跳问答，但限定深度与关系白名单。",
    deliverables: ["Query Understanding / Entity Linking", "Graph Retriever", "Context Fusion + Evidence Validation", "带引用的答案生成"],
    stack: ["FastAPI Orchestrator", "Neo4j Driver", "Azure AI Search SDK", "Azure OpenAI"],
    acceptance: ["多跳问题答案的图路径可复现", "Citation Accuracy 达到团队自定阈值", "无证据时正确拒答"],
    risks: ["多跳噪声与路径爆炸", "引用与证据失配", "延迟与成本失控"],
    nextGate: "相对 Phase 4 基线，在目标问题类型上有可解释的增量。",
  },
  {
    id: "phase6", phase: "Phase 6", title: "评估和优化", startWeek: 19, endWeek: 22, tone: "amber",
    goal: "建立回归评估集与指标看板，用数据决定优化方向而不是凭感觉调 Prompt。",
    deliverables: ["Evaluation Dataset（含反例与越权用例）", "指标计算脚本与回归报告", "错误分桶分析", "Prompt/Schema 版本对照"],
    stack: ["pytest / 评估脚本", "指标仪表盘", "人工标注流程"],
    acceptance: ["每次改动可一键跑回归", "Faithfulness / Citation / ACL Leakage 均有记录", "错误案例有责任人与修复状态"],
    risks: ["只用模型自评", "评估集与线上分布不一致", "把演示数据当上线指标"],
    nextGate: "关键指标稳定达到团队自定义门禁，且已知失败模式有缓解措施。",
  },
  {
    id: "phase7", phase: "Phase 7", title: "安全和生产化", startWeek: 23, endWeek: 27, tone: "rose",
    goal: "把权限、审计、可靠性、成本与灾备补齐，让系统可被企业平台接纳。",
    deliverables: ["RBAC/ABAC 策略与权限继承", "全链路审计与监控告警", "任务队列/重试/幂等/灾备", "成本预算与容量规划"],
    stack: ["Entra ID", "Key Vault / 托管身份", "私有网络", "监控与日志平台"],
    acceptance: ["越权用例 100% 被拦截", "故障注入后任务可重放且不产生重复数据", "P50/P95 延迟与单查询成本有预算上限"],
    risks: ["图谱关联泄漏", "索引与图谱不一致", "多租户隔离不足"],
    nextGate: "安全评审通过，运维与值班有明确责任人和 runbook。",
  },
  {
    id: "phase8", phase: "Phase 8", title: "持续演进", startWeek: 28, endWeek: 32, tone: "purple",
    goal: "把本体、图谱、索引、Prompt 与评估集纳入持续交付，支持业务变化。",
    deliverables: ["本体/Schema 版本迁移流程", "增量更新与删除策略", "知识新鲜度 SLO", "季度评审与回滚演练"],
    stack: ["CI/CD", "数据契约回归", "知识治理委员会"],
    acceptance: ["新数据源接入有标准流程", "本体变更可灰度并回滚", "过期知识不会进入答案"],
    risks: ["业务语义变化无人维护", "Embedding 模型升级导致索引不兼容", "治理职责不清"],
    nextGate: "进入常态化运营；后续按新场景重新从 Phase 1 开始小循环。",
  },
];

export const deliverablesChecklist = [
  { name: "Domain Model", owner: "领域架构师", desc: "概念、边界与 Competency Questions" },
  { name: "OWL / SHACL", owner: "本体工程师", desc: "语义公理与数据校验形状" },
  { name: "Ontology Mapping", owner: "数据工程师", desc: "抽取类型/关系到本体的映射表" },
  { name: "Extraction Schema", owner: "AI 工程师", desc: "Pydantic / JSON Schema 与 Prompt 版本" },
  { name: "Entity Resolution Rules", owner: "数据治理", desc: "ID/Alias/打分/审核与回滚策略" },
  { name: "Neo4j Schema", owner: "图工程师", desc: "Label、约束、索引与关系方向" },
  { name: "Azure AI Search Index", owner: "检索工程师", desc: "字段、向量维度、ACL filter、语义配置" },
  { name: "Retrieval Orchestrator", owner: "后端工程师", desc: "意图、混合检索、融合与证据校验" },
  { name: "Evaluation Dataset", owner: "评估/业务", desc: "问答对、证据、反例与越权用例" },
  { name: "Security Model", owner: "安全架构师", desc: "RBAC/ABAC、权限继承与四层过滤" },
  { name: "Monitoring Dashboard", owner: "SRE", desc: "质量、延迟、成本、ACL 泄漏" },
  { name: "Deployment Documentation", owner: "平台团队", desc: "部署、灾备、升级与回滚" },
];
