/**
 * V2 专题正文（数据驱动）。
 *
 * 设计意图：把「面包屑 / 知识关联 / 前后导航 / 阅读工具」抽成共享壳，
 * 而每个专题通过不同 block 组合（流程图、状态机、血缘图、时序、代码、对比表）
 * 得到差异化的可视化，避免 7 个页面复制同一种模板。
 *
 * 所有示例数据均为教学模拟数据；产品能力与 API 具版本敏感性，以官方文档为准。
 */

import type { CodeLanguage } from "@/lib/prism";
import type { CalloutType } from "@/components/ui/primitives";

export type FlowKey = "agentic" | "knowledge-agent" | "semantic-chain" | "governance-lifecycle" | "twin-architecture";

export type TopicBlock =
  | { type: "prose"; paragraphs: string[]; lead?: boolean }
  | { type: "bullets"; title?: string; items: string[]; numbered?: boolean }
  | { type: "callout"; tone: CalloutType; title?: string; body: string }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string; dense?: boolean }
  | { type: "cards"; title?: string; cols?: 2 | 3; items: { title: string; body: string; badge?: string; tone?: "neutral" | "blue" | "cyan" | "purple" | "green" | "amber" | "rose" }[] }
  | { type: "definitions"; title?: string; items: { term: string; definition: string }[] }
  | { type: "steps"; title?: string; items: { label: string; detail: string }[] }
  | { type: "flow"; diagram: FlowKey; height?: number }
  | { type: "code"; language: CodeLanguage; title?: string; filename?: string; code: string; note?: string; scope?: string }
  | { type: "custom"; name: string };

export interface TopicSectionContent { id: string; title: string; blocks: TopicBlock[] }
export interface TopicPageContent { sections: TopicSectionContent[] }

/* 紧凑构造器，减少内容文件中的重复噪音 */
export const P = (...paragraphs: string[]): TopicBlock => ({ type: "prose", paragraphs });
export const LEAD = (...paragraphs: string[]): TopicBlock => ({ type: "prose", paragraphs, lead: true });
export const L = (title: string, items: string[], numbered = false): TopicBlock => ({ type: "bullets", title, items, numbered });
export const CO = (tone: CalloutType, title: string, body: string): TopicBlock => ({ type: "callout", tone, title, body });
export const T = (headers: string[], rows: string[][], caption?: string, dense = false): TopicBlock => ({ type: "table", headers, rows, caption, dense });
export const CD = (title: string, items: { title: string; body: string; badge?: string; tone?: "neutral" | "blue" | "cyan" | "purple" | "green" | "amber" | "rose" }[], cols: 2 | 3 = 2): TopicBlock => ({ type: "cards", title, items, cols });
export const DEF = (title: string, items: { term: string; definition: string }[]): TopicBlock => ({ type: "definitions", title, items });
export const ST = (title: string, items: { label: string; detail: string }[]): TopicBlock => ({ type: "steps", title, items });
export const F = (diagram: FlowKey, height?: number): TopicBlock => ({ type: "flow", diagram, height });
export const CU = (name: string): TopicBlock => ({ type: "custom", name });
export const CODE = (language: CodeLanguage, title: string, code: string, note?: string, filename?: string): TopicBlock => ({ type: "code", language, title, code, note, filename });
export const S = (id: string, title: string, ...blocks: TopicBlock[]): TopicSectionContent => ({ id, title, blocks });

export const SIM = "模拟执行 · 本地确定性演示数据";

/* ================================================================== *
 * 专题一 · Agentic RAG
 * ================================================================== */
const agenticRag: TopicPageContent = {
  sections: [
    S("ar-what", "Agentic RAG 是什么，以及传统 RAG 为什么会失败",
      LEAD("Agentic RAG 不是「更好的 GraphRAG」，而是<strong>把检索过程的控制权从固定流水线交给 Agent</strong>：由 Agent 判断问题是否需要拆解、选择哪些工具、检索几轮、何时停止，以及证据不足以时如何显式表达不确定性。"),
      P("Traditional RAG 的执行路径是固定的：Query → 一次检索 → 拼接上下文 → 生成答案。它在「答案集中在一两篇文档里」时非常高效。但当问题天然包含多个子问题（原因、影响、历史相似、处置建议），单次 TopK 检索会在同一个向量空间里同时争夺不相关的证据，结果往往是<strong>覆盖不全却看起来很流畅</strong>。"),
      DEF("四个必须分清的边界", [
        { term: "Traditional RAG", definition: "一次检索 + 一次生成的固定流水线，是成本与延迟的基线。" },
        { term: "GraphRAG", definition: "知识检索与上下文组织方法，用图路径/社区结构组织证据；它不负责规划与迭代。" },
        { term: "Agentic RAG", definition: "由 Agent 控制的多步骤检索与推理工作流；GraphRAG 可以是它调用的一种工具。" },
        { term: "Knowledge Agent", definition: "面向企业知识上下文、工具治理、权限与审计的智能体；Agentic RAG 只是其一种检索工作流。" },
      ]),
      L("传统 RAG 在复杂问题上常见的六种失败方式", [
        "多子问题相互竞争：一个 TopK 列表无法同时覆盖原因、影响、历史与处置四类证据。",
        "需要先定位实体再沿关系遍历：纯语义相似度不表达方向、跳数与关系类型。",
        "数值问题必须按审批口径计算：从文档里「读到一个数字」与「算出指标」不是一回事。",
        "第一轮证据不充分时没有二次取证机制，只能生成含糊或补全式答案。",
        "引用与论断未逐条绑定，无法删除没有证据支撑的句子。",
        "权限、时效与来源权威性在拼接上下文时丢失，导致过期或越权内容进入答案。",
      ], true),
      CO("conclusion", "一句话区分", "GraphRAG 回答「用什么结构组织证据」，Agentic RAG 回答「谁来决定查几次、查哪里、何时停」。二者是不同维度，可以组合，也可以各自独立使用。"),
      CO("assumption", "演示数据", "本专题所有轨迹、证据 ID、延迟与 Token 数均为模拟值（" + SIM + "），用于展示工作流，不代表任何真实系统性能。"),
    ),
    S("ar-modes", "单次 RAG / GraphRAG / Agentic RAG 三种模式对比",
      P("三种模式不是「代际升级」关系，而是<strong>控制复杂度</strong>不同的三种选择。下表按决策维度对比；没有一行意味着「后者一定优于前者」。"),
      T(["维度", "A · 单次 RAG", "B · GraphRAG", "C · Agentic RAG"], [
        ["本质", "固定检索流水线", "知识检索与上下文组织方法", "Agent 控制的多步检索工作流"],
        ["控制者", "应用代码", "应用代码 + 图检索策略", "Agent Planner + 工具策略"],
        ["检索次数", "1 次（可混合召回）", "通常 1 轮多路（图 + 文档）", "1..N 轮，取决于证据充分性"],
        ["典型工具", "向量 / 关键词索引", "图查询 + 文档检索", "GraphRAG / 传统 RAG / SQL / API 均可"],
        ["是否需要知识图谱", "否", "是（用于组织上下文）", "否，Agentic RAG 不意味着一定需要知识图谱"],
        ["关系路径能力", "弱", "强", "取决于是否调用图工具"],
        ["延迟与成本", "最低", "中等偏高", "最高且方差大"],
        ["可复现性", "高", "较高", "较低，需要完整轨迹"],
        ["主要失败模式", "漏检、语义漂移", "图噪声、错误路径", "错误传播、循环、成本失控"],
        ["适合的问题", "单文档可答的事实查询", "多跳关系、影响分析", "需拆解、跨系统取证、证据不足需迭代"],
        ["评估重点", "Recall@K / Faithfulness", "+ 路径正确率 / 引用准确率", "+ 轮次、成本、停止条件命中率"],
      ], "对比基于架构职责，不涉及任何产品性能数据。", true),
      CD("四条必须写进架构文档的结论", [
        { title: "GraphRAG 不是 Agent", body: "它是知识检索和上下文组织方法，本身不包含规划、反思或工具编排能力。", badge: "边界", tone: "cyan" },
        { title: "Agentic RAG 可调用 GraphRAG", body: "也可以只调用传统 RAG、SQL 与业务 API；是否用图由问题类型决定。", badge: "组合", tone: "blue" },
        { title: "不必然需要知识图谱", body: "复杂问题若只需多轮文档取证或多 API 核对，向量检索 + 工具调用即可。", badge: "选型", tone: "purple" },
        { title: "增加 Agent 有代价", body: "可能提高复杂问题处理能力，同时增加延迟、成本与错误传播路径。", badge: "风险", tone: "amber" },
      ]),
      CO("principle", "不存在必须采用的固定流水线", "Ontology → Knowledge Graph → GraphRAG → Agentic RAG 不是强制链路。技术选型必须基于业务问题、数据特征、准确性要求、安全约束和维护成本；任何一层都可以独立成立。"),
    ),
    S("ar-architecture", "十步架构：从 User Query 到 Citation Verification",
      P("下图是可点击、可缩放、可拖动的流程架构（复用站内的 React Flow 画布）。点击节点查看职责与输入输出；虚线/回流边表示证据不足时的有界迭代。"),
      F("agentic", 480),
      ST("规范链路与每段的输入输出", [
        { label: "User Query → Agent Planner", detail: "输入原始问题、身份与预算；输出意图、复杂度判定与停止条件。" },
        { label: "Query Decomposition", detail: "把复杂问题拆为可独立取证的子任务，每个绑定检索策略。" },
        { label: "Retrieval Strategy Selection", detail: "在向量检索、图检索、SQL、业务 API 之间选择，而不是默认全用。" },
        { label: "Vector / Graph / SQL / API", detail: "工具均来自白名单，参数受 schema 约束，权限在检索阶段执行。" },
        { label: "Evidence Evaluation", detail: "按覆盖率、冲突、来源权威性、有效时间与密级评估证据。" },
        { label: "Additional Retrieval if Needed", detail: "证据不足且未达轮次/成本上限时进入下一轮，否则按停止条件退出。" },
        { label: "Answer Synthesis", detail: "只基于已验证证据组织答案，每条论断附 Evidence ID。" },
        { label: "Citation Verification", detail: "引用无法回指原文或口径版本不一致时删除对应论断。" },
        { label: "Final Answer", detail: "输出结论 + 引用 + 不确定性 + 待人工确认事项。" },
      ]),
      CO("warning", "回流边必须有界", "「Additional Retrieval if Needed」是最容易失控的一步：必须同时设置最大轮次、工具调用次数、Token/成本预算、延迟 SLA 与连续失败次数，并且任何一项命中都要退出循环并显式说明证据缺口。"),
    ),
    S("ar-capabilities", "核心机制：规划、分解、迭代、反思与停止条件",
      DEF("十三个核心机制（专题要求覆盖）", [
        { term: "Query Planning", definition: "先判断问题类型、所需证据种类与预算，再决定用不用 Agent Loop；简单问题直接走单次检索。" },
        { term: "Query Decomposition", definition: "把并列/因果型问题拆成带产出类型的子任务 DAG，避免一个模糊查询覆盖全部。" },
        { term: "Iterative Retrieval", definition: "以证据充分性函数为循环条件的有界多轮检索，每轮记录输入、输出与理由。" },
        { term: "Tool Calling", definition: "只调用注册表白名单中的工具，参数受 schema 与最小权限约束。" },
        { term: "Reflection", definition: "检查证据是否互相矛盾、是否答非所问、引用是否可回溯；失败则补充检索或转人工。" },
        { term: "Answer Verification", definition: "逐条核验论断与证据的绑定关系，并复核权限与口径一致性。" },
        { term: "Multi-step Reasoning", definition: "把中间结论作为下一轮子问题的输入，同时保留轨迹以支持审计与调试。" },
        { term: "Agent Loop", definition: "Plan → Act → Observe → Evaluate → Decide 的循环，需可观测、可中断、可重放。" },
        { term: "Stop Conditions", definition: "证据充分、达到轮次/成本/延迟上限、连续工具失败、权限不足或需要人工审批时退出。" },
        { term: "Human-in-the-loop", definition: "敏感操作、低充分度结论与 Pending 证据必须转人工，且答案显式标注待确认项。" },
        { term: "Evidence Evaluation", definition: "按来源权威性、审批状态与有效时间评估，不按 LLM 置信度排序。" },
        { term: "Citation Verification", definition: "引用必须能回指到具体 Chunk / 图记录 / 指标版本，否则删除论断。" },
        { term: "Retrieval Strategy Selection", definition: "依据子任务类型选择向量、图、SQL 或 API；没有一种工具适合所有问题。" },
      ]),
      P("下面用状态机视图展示 Agent Loop 的状态迁移与退出条件。点击任意状态查看进入条件、动作与退出条件；这是确定性模拟，不是运行中的 Agent 服务。"),
      CU("agentic-state-machine"),
      CO("advice", "先写停止条件，再写 Planner 提示词", "工程上最容易被忽略的是「什么时候不干了」。把最大轮次、预算、失败次数与人工升级路径写成运行时硬约束（而不是提示词文本），才能避免循环与成本失控。"),
    ),
    S("ar-simulator", "交互工具：Agentic RAG 流程模拟器",
      P("输入一个复杂问题（或使用预设），模拟器会依据关键词用<strong>确定性逻辑</strong>生成子任务与工具选择，并逐步展示 Step 1–10 的输入、输出、执行理由、证据、延迟与 Token。点击任一步查看详情；支持逐步执行、自动播放、重置与查看最终带引用答案。"),
      CU("tool-agentic-rag"),
      CO("assumption", "明确标记模拟执行", "本工具不连接任何真实 Agent、LLM、Neo4j、Azure AI Search 或企业 API。所有结果来自本地静态数据与确定性规则，" + SIM + "。"),
    ),
    S("ar-boundary", "代价、风险与什么时候应该坚持传统 RAG",
      T(["风险", "表现", "工程对策"], [
        ["延迟", "多轮调用叠加，P95 明显上升且方差大", "按问题类型路由；设置延迟预算并支持降级为单次 RAG"],
        ["成本", "每轮模型与工具调用都计费", "Token / 工具次数上限；缓存重复检索；离线评估增量收益"],
        ["错误传播", "第一轮错误实体被后续子任务继承", "锚实体强制校验；中间结论保留置信度与来源"],
        ["循环不收敛", "反复检索但证据无增益", "连续无增益退出；最大轮次硬约束"],
        ["权限绕过", "工具参数拼接导致越权查询", "工具白名单 + 参数化模板 + 执行时 permission_check"],
        ["可复现性", "同问不同答，难以回归", "记录完整轨迹、模型/工具版本与随机种子"],
        ["调试成本", "中间状态不可见", "每步输入/输出/理由结构化落盘，支持重放"],
      ], undefined, true),
      L("应该坚持传统 RAG（或仅升级到 Hybrid RAG）的场景", [
        "答案集中在单篇文档，且评估集显示 Recall@K 已达标。",
        "高并发、低延迟的客服 / FAQ 场景，复杂问题的收益无法抵消 SLA 损失。",
        "尚无评估集与基线，无法证明多步检索带来的增量。",
        "工具权限与审计尚未收敛，引入 Agent 会放大合规风险。",
        "主要投诉其实来自文档过期、引用缺失或口径不一致 —— 这些应先由治理与语义层解决。",
      ]),
      CO("principle", "Agent 数量不是系统能力的直接指标", "多 Agent 会引入通信、协调、延迟与调试成本。是否拆分应由职责边界、权限隔离与并行收益决定，而不是由「有几个 Agent」决定。"),
      CO("warning", "生产系统不能只依赖提示词作为安全边界", "「请不要查询无权限数据」不是权限控制。工具白名单、参数化模板、策略引擎与审计日志必须在运行时强制生效。"),
    ),
  ],
};

/* ================================================================== *
 * 专题二 · Knowledge Agent
 * ================================================================== */
const knowledgeAgent: TopicPageContent = {
  sections: [
    S("ka-what", "定义与四组关键区别",
      LEAD("Knowledge Agent 是<strong>面向企业知识上下文、受工具白名单与权限策略约束、可审计地提供主动知识服务</strong>的智能体。它不只是「会检索的聊天机器人」，而是把身份、知识上下文、工具治理、证据校验与人工审批串成一个运行时。"),
      T(["对比对象", "核心差别", "为什么容易混淆"], [
        ["普通 Chatbot", "Chatbot 主要管理对话与话术；Knowledge Agent 必须解析企业概念、调用受控工具、输出带证据与权限边界的答案。", "两者都有对话界面"],
        ["RAG", "RAG 是一种检索生成流水线；Knowledge Agent 是一个运行时，RAG 可以是它调用的能力之一。", "都回答「基于文档的问题」"],
        ["Agentic RAG", "Agentic RAG 关注多步检索与推理工作流；Knowledge Agent 还包含身份与权限、Tool Registry、Memory、审计与人工审批。", "都使用 Agent Loop"],
        ["Multi-Agent", "Multi-Agent 是组织方式（多个角色协作）；Knowledge Agent 是能力定位（企业知识服务）。二者可组合也可各自独立。", "都会出现「多个 Agent 角色」"],
      ], "关系：Knowledge Agent 可以内嵌 Agentic RAG；Multi-Agent 是可选的组织形式，不是 Knowledge Agent 的定义。", true),
      CO("conclusion", "主动知识服务的含义", "从「用户问一句、系统答一句」升级为：识别企业概念、主动补齐缺失证据、标注来源与口径、在证据不足时提出待确认项，并把敏感动作交给人工审批。"),
      L("企业知识上下文（Knowledge Context）包含什么", [
        "用户身份、角色、组织、密级与用途约束（subject）。",
        "会话状态与经权限过滤的 Agent Memory（短期）与已审批长期知识（长期）。",
        "业务术语、本体类型、指标口径版本与实体规范 ID。",
        "当前可用工具、预算、停止条件与审计轨迹 ID。",
      ]),
    ),
    S("ka-architecture", "企业 Knowledge Agent 参考架构",
      P("下图是可点击的参考架构：从 User 到 Identity and Permission、Agent Runtime、Planner、Knowledge Context、Tool Registry，再到五类知识服务，最后经 Response Validation 与 Audit and Monitoring 输出。点击节点查看职责与边界。"),
      F("knowledge-agent", 500),
      ST("规范链路（逐段说明）", [
        { label: "User → Identity and Permission", detail: "先解析身份与密级，subject 随全链路传递，禁止使用共享高权限服务账号代查。" },
        { label: "Agent Runtime → Planner", detail: "运行时管理会话、预算、轨迹与中断；Planner 负责规划与分解。" },
        { label: "Knowledge Context", detail: "组装概念、术语、指标口径与经权限过滤的记忆，不把整库内容塞进上下文。" },
        { label: "Tool Registry", detail: "白名单登记每个工具的 schema、权限范围、超时、审计级别与失败降级。" },
        { label: "Ontology Service / Knowledge Graph", detail: "提供类型约束与实体关系事实；图查询只读、参数化、限深。" },
        { label: "Document Search / Semantic Layer / Business APIs", detail: "分别提供原文证据、统一指标口径与结构化业务事实，均受策略约束。" },
        { label: "Response Validation", detail: "校验证据充分性、引用有效性、口径版本与权限一致性；失败不出答案。" },
        { label: "Audit and Monitoring", detail: "记录每次工具调用、检索条件、证据、回答与审批，支持回放与告警。" },
      ]),
      CD("Agent 能力清单（专题要求覆盖）", [
        { title: "Tool Registry", body: "登记工具 schema、最小权限、超时与审计级别；运行时只接受白名单工具。", tone: "cyan" },
        { title: "Entity Resolution", body: "把口语化表述映射到规范实体 ID，候选与裁决可回溯。", tone: "purple" },
        { title: "Graph Query", body: "参数化只读查询，限深并按密级剪枝。", tone: "blue" },
        { title: "Document Retrieval", body: "返回可定位引用（文档 ID / 页码 / Chunk / 版本）。", tone: "amber" },
        { title: "Business API", body: "白名单只读接口，禁止生成任意 SQL 或自由 URL。", tone: "green" },
        { title: "Memory", body: "短期会话与长期知识都带 subject、有效期与密级。", tone: "neutral" },
        { title: "Permission Enforcement", body: "向量检索、图遍历、上下文融合、最终回答四阶段一致执行。", tone: "rose" },
        { title: "Audit Trail / Human Approval", body: "全量轨迹；敏感操作必须人工审批，策略服务不可用时默认拒绝。", tone: "blue" },
      ], 2),
    ),
    S("ka-roles", "七类 Agent 逻辑角色与拆分判据",
      P("下表给出常见逻辑职责。请特别注意：<strong>这些角色是可选的逻辑职责，不意味着必须部署七个独立模型或微服务</strong>。是否拆分取决于业务复杂度、权限隔离要求、并行收益与团队运维能力。"),
      T(["角色", "主要职责", "典型工具", "权限边界", "失败处理"], [
        ["Knowledge Search Agent", "统一搜索意图与候选证据汇总", "vector / keyword / glossary", "只读，继承用户密级", "无命中→说明覆盖缺口；连续失败→人工检索建议"],
        ["Ontology Agent", "业务概念、类型与语义关系解释", "ontology / glossary / SHACL", "只读本体，不改类层次", "无法映射→返回候选并要求澄清"],
        ["Graph Agent", "受控图查询与路径返回", "graph_query / path_query", "只读 + ABAC 剪枝", "超时→返回空路径，不降级全图扫描"],
        ["Document Agent", "原文片段与引用坐标", "vector / document_fetch", "检索阶段应用 ACL", "文档过期→标记 stale 并中止引用"],
        ["Data Agent", "结构化指标与业务事实", "semantic_query / business_api", "仅预定义指标与只读 API", "口径冲突→返回版本差异转人工"],
        ["Incident Agent", "原因候选、影响、历史与建议组装", "graph / vector / API / doc", "只读，结论标注审批状态", "证据不足→列出缺口，不补全推测"],
        ["Governance Agent", "调用前鉴权、回答前合规校验", "permission_check / audit / approval", "策略只读 + 审计只写", "策略不可用→fail-closed 默认拒绝"],
      ], undefined, true),
      L("什么时候才考虑拆成多个 Agent", [
        "不同职责需要<strong>不同的权限域或数据密级</strong>，单运行时难以隔离。",
        "任务确实可并行，且并行收益大于通信与协调开销。",
        "已有完整的跨 Agent trace 与调试能力，能定位错误在哪一跳产生。",
        "组织边界要求不同团队各自维护与发布其 Agent 逻辑。",
      ]),
      CO("advice", "推荐起点", "从「单 Agent Runtime + 多白名单工具」开始。只有当权限隔离或并行收益被量化证明时，才把逻辑职责拆成独立 Agent。"),
    ),
    S("ka-designer", "交互工具：Knowledge Agent 架构设计器",
      P("选择 Agent 角色、勾选工具、配置权限范围并连接知识服务，工具会即时生成架构图并展示每个 Agent 的职责、输入输出、权限边界与失败处理。所有配置仅在浏览器本地生效。"),
      CU("tool-knowledge-agent"),
      CO("assumption", "模拟模式", "工具输出的是本地拼装的架构说明与图示，" + SIM + "；不会生成真实部署配置或调用任何服务。"),
    ),
    S("ka-code", "Python 伪代码：Router / Registry / 权限 / 证据校验",
      P("以下是教学用简化代码，演示<strong>白名单、最小权限、执行时鉴权与证据校验</strong>的结构。它刻意省略真实 SDK、重试、并发与密钥管理；生产实现需要完整工程化。API 与 SDK 具版本敏感性，请以官方文档为准。"),
      CODE("python", "Agent Router + Tool Registry", `from dataclasses import dataclass
from typing import Callable

@dataclass(frozen=True)
class Subject:
    user_id: str
    roles: tuple[str, ...]
    max_classification: str   # Public / Internal / Confidential / Restricted

@dataclass(frozen=True)
class ToolSpec:
    name: str
    required_role: str
    max_classification: str
    readonly: bool
    handler: Callable[[dict, Subject], dict]

# 白名单：只有注册过的工具才可能被调用
REGISTRY: dict[str, ToolSpec] = {}

def register(spec: ToolSpec) -> None:
    assert spec.readonly, "only read-only tools may be auto-invoked"
    REGISTRY[spec.name] = spec

def router(intent: str) -> list[str]:
    """依据意图返回候选工具名；不做任意字符串拼接。"""
    return {
        "relationship": ["graph_query", "document_fetch"],
        "metric":       ["semantic_query"],
        "narrative":    ["vector_search", "document_fetch"],
        "incident":     ["graph_query", "vector_search", "business_api"],
    }.get(intent, ["vector_search"])

def permission_check(spec: ToolSpec, subject: Subject, resource: dict) -> bool:
    if spec.required_role not in subject.roles:
        return False
    order = ["Public", "Internal", "Confidential", "Restricted"]
    if order.index(resource["classification"]) > order.index(subject.max_classification):
        return False
    if order.index(resource["classification"]) > order.index(spec.max_classification):
        return False
    return True

def call_tool(name: str, args: dict, subject: Subject, audit: list) -> dict:
    spec = REGISTRY.get(name)
    if spec is None:                       # 拒绝任何未注册工具
        raise PermissionError("tool not in whitelist")
    if not permission_check(spec, subject, args.get("resource", {})):
        audit.append({"event": "denied", "tool": name, "user": subject.user_id})
        raise PermissionError("access denied")
    result = spec.handler(args, subject)
    audit.append({"event": "tool_call", "tool": name, "user": subject.user_id,
                  "evidence_ids": result.get("evidence_ids", [])})
    return result`, "教学伪代码：省略真实 SDK、超时、重试与密钥管理。", "agent_router.py"),
      CODE("python", "Graph / Vector / Semantic 工具与证据校验", `def graph_query(args: dict, subject: Subject) -> dict:
    """参数化只读模板：禁止拼接任意 Cypher。"""
    rows = run_parameterized(
        "MATCH (i:Incident {id: $id})-[r]->(n) RETURN type(r), n.id LIMIT $limit",
        {"id": args["incident_id"], "limit": 50},
        acl=subject,                       # 权限下推到图遍历阶段
    )
    return {"rows": rows, "evidence_ids": [r["evidence_id"] for r in rows]}

def vector_search(args: dict, subject: Subject) -> dict:
    hits = search_index(
        query=args["query"], top_k=args.get("top_k", 5),
        security_filter=subject,           # 检索阶段过滤，不是答案阶段遮掩
    )
    return {"chunks": hits, "evidence_ids": [h["evidence_id"] for h in hits]}

def semantic_query(args: dict, subject: Subject) -> dict:
    metric = METRICS[args["metric_id"]]    # 只能查已审批的指标定义
    return {"value": execute_mapped_query(metric, args["dimensions"], acl=subject),
            "definition_version": metric.version,
            "evidence_ids": [f"MET-{metric.id}"]}

def validate_evidence(answer: dict, evidence_store: dict, audit: list) -> dict:
    kept = []
    for claim in answer["claims"]:
        ok = all(
            eid in evidence_store
            and evidence_store[eid]["approval_status"] == "Approved"
            and evidence_store[eid]["classification"] <= answer["subject"].max_classification
            for eid in claim["citations"]
        )
        if ok:
            kept.append(claim)
        else:
            audit.append({"event": "claim_dropped", "claim": claim["text"]})
    return {"claims": kept, "uncertainties": answer["uncertainties"]}`, "引用校验失败即删除论断；审批状态与密级都参与判断。", "knowledge_tools.py"),
      CO("warning", "安全要求（不可协商）", "Agent 不允许绕过权限访问 Neo4j、Azure AI Search 或企业 API；工具采用白名单与最小权限；敏感操作必须人工审批；所有工具调用需要日志和审计。上面任何一步都不能用「提示词里写清楚」代替。"),
    ),
    S("ka-security", "安全边界：白名单、最小权限与人工审批",
      T(["控制点", "强制机制", "反模式"], [
        ["工具准入", "Tool Registry 白名单 + schema 校验", "允许模型输出任意工具名或自由 URL"],
        ["身份传递", "用户 subject 全链路传递", "使用共享高权限服务账号代查"],
        ["检索权限", "向量 security_filter + 图 ACL 剪枝", "先检索全部内容再在答案里遮掩"],
        ["查询安全", "参数化模板 + 只读 + 限深", "拼接 LLM 生成的 Cypher / SQL"],
        ["密级与脱敏", "RBAC + ABAC + 动态字段脱敏", "按静态角色一刀切"],
        ["敏感操作", "创建人工审批任务，双人复核", "Agent 自动执行重启 / 回滚 / 设备控制"],
        ["失败策略", "策略服务不可用时 fail-closed 拒绝", "策略服务异常时降级放行"],
        ["审计", "每次调用记录 tool/args/evidence/answer/版本", "只记录最终答案"],
      ], undefined, true),
      CO("principle", "权限必须贯穿整条链路", "权限判定要在向量检索、图谱遍历、上下文融合与最终回答四个阶段一致执行。任一阶段缺失，都可能出现越权内容进入上下文或引用。"),
      CO("note", "版本敏感性", "Neo4j、Azure AI Search、Azure OpenAI 与 Agent SDK 的 API、驱动与产品能力随版本变化。站内代码示例仅表达结构，不承诺具体接口可用；请以官方参考链接为准。"),
    ),
  ],
};

/* ================================================================== *
 * 专题三 · Enterprise Semantic Layer
 * ================================================================== */
const semanticLayer: TopicPageContent = {
  sections: [
    S("sl-what", "什么是 Enterprise Semantic Layer，为什么需要它",
      LEAD("企业语义层是<strong>把业务术语、业务概念、指标、维度、度量、计算规则与底层数据映射集中定义并统一执行</strong>的一层。它的核心价值不是「更炫的查询」，而是让 BI 报表、AI 助手与业务系统对同一个指标给出同一个数字、同一个口径版本。"),
      P("没有语义层时，「MTTR」在运维看板里可能不含检测时间，在 AI 助手里由 LLM 从文档里读到另一个定义，在财务口径里又排除计划维护。三者都用同一个词，却不是同一个指标。语义层把定义、口径版本、审批人与物理映射绑定到一起，任何消费方都通过 Semantic Query 访问，而不是各自拼 SQL。"),
      L("企业为什么需要语义层", [
        "同一指标多处实现导致数字不一致，业务会议变成对数会议。",
        "AI 直接拼物理 SQL 会绕过过滤规则、密级与口径版本。",
        "维度、粒度、时间归属与排除规则散落在代码里，无法审计。",
        "源表字段变更时没有统一映射，下游全部需要改。",
        "合规要求能回答「这个数字按哪个版本的定义算出来的」。",
      ]),
      CO("conclusion", "与 AI 的关系", "语义层可以独立服务 BI 和 AI，<strong>不一定需要 Knowledge Graph</strong>。AI 通过业务概念提问，语义层负责翻译为受权限约束的物理查询并返回口径版本。"),
      CO("assumption", "演示定义", "本站展示的 Incident Count / MTTR / Service Availability / Change Failure Rate / Critical Incident Rate 均为<strong>演示定义</strong>，不是任何真实企业的标准口径，也不是行业基准。"),
    ),
    S("sl-concepts", "术语、概念、语义模型、指标层与维度",
      DEF("十四个核心概念", [
        { term: "Enterprise Semantic Layer", definition: "统一业务语义与指标口径，并把业务概念映射到物理数据的一层能力。" },
        { term: "Business Glossary", definition: "业务术语、定义、责任人、同义词与审批状态的权威登记处。" },
        { term: "Business Concept", definition: "业务人员理解的对象（System / Service / Incident / Team / Environment / Business Process）。" },
        { term: "Semantic Model", definition: "把概念、维度、度量与关系组织成可查询模型的定义集合。" },
        { term: "Metrics Layer", definition: "指标公式、聚合方式、粒度、过滤条件与版本的集中定义处。" },
        { term: "Dimensions", definition: "观察指标的切分角度（时间、服务、环境、团队、严重级别）。" },
        { term: "Measures", definition: "可聚合的数值或计数（recovery_minutes、incident_id 去重计数）。" },
        { term: "Business Rules", definition: "纳入/排除、时间归属、升级归属、维护窗口剔除等口径规则。" },
        { term: "Semantic Query", definition: "以业务概念与维度发起、由语义层翻译并受权限约束的查询接口。" },
        { term: "Metric Definition", definition: "一个指标的业务定义、公式、粒度、维度、规则与版本的完整记录。" },
        { term: "Grain", definition: "一行数据代表的业务对象粒度，如「一行 = 一个事件」。" },
        { term: "Physical Mapping", definition: "指标到物理表、字段、 join 与过滤条件的映射。" },
        { term: "Definition Version", definition: "口径变更的版本号与生效时间，答案必须随结果返回。" },
        { term: "Policy", definition: "按角色与密级限制谁能查询哪些指标、维度与行。" },
      ]),
      T(["IT 运营示例：业务实体", "定义要点", "关联指标"], [
        ["System", "一组共同交付业务能力的服务与数据资产集合", "Incident Count、Service Availability"],
        ["Service", "可独立部署、具备 SLO 与负责团队的运行单元", "全部五个指标"],
        ["Incident", "导致或可能导致服务中断/降级的非计划事件", "Incident Count、MTTR、Change Failure Rate"],
        ["Team", "对服务或事件负运维责任的组织单元", "MTTR、Change Failure Rate"],
        ["Environment", "服务部署的运行环境，影响可用率分母与权限", "Service Availability"],
        ["Business Process", "把技术事件映射到业务影响的经营链路", "Critical Incident Rate"],
      ], "业务实体为教学示例；指标定义见交互浏览器。", true),
    ),
    S("sl-compare", "与 Ontology / Knowledge Graph / Data Catalog 的区别",
      T(["对比项", "Ontology 本体", "Enterprise Semantic Layer", "Knowledge Graph", "Data Catalog"], [
        ["主要对象", "概念、类型、关系与约束", "业务术语、指标、维度、规则、映射", "实体与关系事实", "数据资产与元数据"],
        ["回答的问题", "什么事实可以存在？", "这个指标怎么算、按哪个口径？", "这两个实体有什么关系？", "有哪些数据、谁负责？"],
        ["典型产物", "类层次、OWL 公理、SHACL", "指标字典、语义模型、Semantic Query", "图记录、路径、子图", "资产清单、血缘入口"],
        ["是否存实例事实", "否（定义层）", "否（定义与映射层）", "是（实例层）", "登记元数据，不存业务事实"],
        ["主要消费者", "建模与抽取流水线", "BI / AI / 业务系统", "图检索、影响分析", "数据发现与治理"],
        ["是否可独立存在", "是", "是", "是", "是"],
      ], "四者可以关联，但不是同一个东西。", true),
      CD("三组最容易混淆的边界", [
        { title: "Ontology ≠ Semantic Layer", body: "本体定义概念、类型与关系；语义层统一业务术语、指标、维度、计算规则与底层数据映射。", tone: "purple" },
        { title: "Semantic Layer ≠ Data Catalog", body: "目录帮助发现资产与责任人；语义层提供经审批的口径定义与可执行查询。", tone: "amber" },
        { title: "Semantic Layer ≠ Knowledge Graph", body: "图谱保存实体及关系事实；语义层不存业务事实，而是定义指标如何被计算。", tone: "cyan" },
      ], 3),
      CO("principle", "三者可以关联，但不是同一个东西", "可以让本体中的概念与语义层的业务概念对齐，也可以让图谱中的实体 ID 作为指标维度，但这些是<strong>可选集成</strong>，不是「必须有图谱才有语义层」。"),
      CO("warning", "典型误用", "把 Data Catalog 当作指标口径权威、让 LLM 直接读取物理字段拼 SQL、或用知识图谱路径替代指标公式 —— 都会让口径重新变得不可控。"),
    ),
    S("sl-chain", "从业务术语到业务答案的七段链路",
      P("下图展示「业务术语 → 语义定义 → 指标定义 → 数据映射 → 查询接口 → AI 理解 → 业务答案」的完整链路。点击节点查看该阶段的职责。"),
      F("semantic-chain", 360),
      ST("七段链路逐段说明（IT 运营示例）", [
        { label: "业务术语", detail: "业务方说「MTTR」「可用率」，术语表登记中文名、同义词与责任人。" },
        { label: "语义定义", detail: "明确纳入范围、时间归属、排除规则（如演示定义中 MTTR 不含 MTTD）。" },
        { label: "指标定义", detail: "Measure / Dimension / Grain / Formula / Version 完整记录并经审批。" },
        { label: "数据映射", detail: "映射到 itsm.fact_incident_timeline 等物理表字段与 join 条件。" },
        { label: "查询接口", detail: "Semantic Query 接收业务概念 + 维度 + subject，翻译为受控查询。" },
        { label: "AI 理解", detail: "AI 按业务概念提问，不生成任意 SQL，答案需携带口径版本。" },
        { label: "业务答案", detail: "数值 + 单位 + 口径版本 + 数据时间 + 引用 + 权限说明。" },
      ]),
      CO("assumption", "链路中的示例", "本链路使用的表名、字段、规则与指标定义均为教学演示，不代表任何真实企业的数据模型或标准口径。"),
    ),
    S("sl-explorer", "交互工具：Enterprise Semantic Model Explorer",
      P("浏览器列出五个 IT 运营演示指标。点击指标可查看业务定义、计算公式、维度、度量、业务规则、数据来源、物理映射链路、关联业务实体、权限、数据更新时间与版本。支持在指标与业务实体之间双向查看关联关系。"),
      CU("tool-semantic"),
      CO("assumption", "演示定义声明", "所有指标均明确标注「演示定义」。例如 Change Failure Rate 的 72 小时关联窗口只是演示假设，时间相关不等于因果，真实口径必须由业务方审批。"),
    ),
    S("sl-governance", "口径治理、演示定义声明与版本敏感性",
      L("口径治理的最小实践", [
        "每个指标有唯一 ID、业务 Owner、审批状态与版本号。",
        "口径变更走审批并保留历史版本，答案必须返回 definition_version。",
        "分母口径必须与相关指标一致（如 Critical Incident Rate 的分母与 Incident Count 相同）。",
        "AI 只能通过 Semantic Query 访问，禁止绕过语义层拼物理 SQL。",
        "逻辑定义与物理映射分离，源表变更时只改映射不改口径。",
        "敏感指标（如 Change Failure Rate）按角色与密级限制维度与行。",
      ]),
      T(["常见分歧", "为什么会产生", "治理动作"], [
        ["MTTR 是否含检测时间", "MTTD/MTTR 定义在不同团队不一致", "在语义定义中写明包含范围，版本化"],
        ["可用率分母是否剔除维护窗口", "SLA 合同口径与监控口径不同", "分开两个指标或显式标注口径版本"],
        ["变更失败率如何判定因果", "时间接近不等于因果", "保留候选关联，结论需人工确认"],
        ["跨天事件归属哪一天", "事件时间与状态时间混用", "统一按有效时间/首次发现时间归属"],
      ], undefined, true),
      CO("note", "版本敏感性", "语义层产品（指标定义格式、查询 API、权限模型）各异且随版本演进。本站只描述能力与契约，不承诺任何具体产品的接口；请以官方文档为准。"),
      CO("principle", "核心价值一句话", "Semantic Layer 的核心价值是统一业务语义和指标口径，而不是替代知识图谱、数据仓库或治理体系。"),
    ),
  ],
};

/* ================================================================== *
 * 专题四 · Enterprise Data Governance
 * ================================================================== */
const dataGovernance: TopicPageContent = {
  sections: [
    S("dg-scope", "治理范围：十八个必须回答的主题",
      LEAD("Data Governance 是<strong>贯穿知识全生命周期的管理体系</strong>，不是单纯的数据库权限管理。它要回答：知识从哪来、谁负责、何时生效、谁审核、是否与其他来源冲突、谁能看、原文变了怎么办、删除后如何清理。"),
      DEF("十八个主题（专题要求覆盖）", [
        { term: "Data Governance", definition: "覆盖组织、政策、责任、流程与技术控制的整体管理体系。" },
        { term: "Metadata Management", definition: "技术、业务与操作元数据的登记、维护与消费。" },
        { term: "Data Catalog", definition: "数据资产的发现入口，登记责任人、密级与血缘入口。" },
        { term: "Data Lineage", definition: "从来源到生成答案的可追溯链路。" },
        { term: "Data Quality", definition: "完整性、有效性、重复率、覆盖率、过期率等可度量指标。" },
        { term: "Master Data Management", definition: "规范实体 ID 与黄金记录的主数据管理。" },
        { term: "Entity Resolution Governance", definition: "合并决策的候选、评分、裁决、审批与回滚。" },
        { term: "Knowledge Provenance", definition: "来源、证据、置信度、有效时间、事务时间、版本与审批。" },
        { term: "Data Classification", definition: "Public / Internal / Confidential / Restricted 等等级与用途限制。" },
        { term: "RBAC / ABAC", definition: "按角色与按属性（用户、资源、环境、用途）的访问控制。" },
        { term: "Data Masking", definition: "按密级与用途对字段或片段动态脱敏。" },
        { term: "Retention Policy", definition: "保留周期、复核周期与删除联动规则。" },
        { term: "Version Management", definition: "定义、映射与事实的版本化及可回放。" },
        { term: "Temporal Data", definition: "区分 Valid Time 与 Transaction Time 的双时态建模。" },
        { term: "Data Lifecycle", definition: "从接入、审核、发布、监控到过期删除的全过程。" },
        { term: "Audit", definition: "不可篡改的调用、变更与审批记录。" },
        { term: "Compliance", definition: "监管证据、数据主体请求与删除证明。" },
        { term: "Knowledge Approval", definition: "知识发布前由业务或治理责任人确认。" },
      ]),
      CO("warning", "Data Governance ≠ 单纯的数据库权限管理", "权限只是治理的一部分。没有来源、血缘、审批、时态、质量与删除联动，就无法判断一条知识是否可信、是否过期、是否与其他来源冲突。"),
    ),
    S("dg-lifecycle", "知识治理模型：Source → Publication → Expiration",
      P("下图是可点击的十二步生命周期。监控阶段发现质量或口径问题时会回退到校验/重抽取，形成闭环而不是一次性流水线。"),
      F("governance-lifecycle", 520),
      CU("governance-lifecycle-detail"),
      CO("principle", "发布是状态，不是动作终点", "Publication 之后必须持续 Monitoring，并按 Retention Policy 进入 Expiration / Deletion；否则知识库会随时间积累过期与冲突事实。"),
    ),
    S("dg-questions", "十个必答问题：知识可信度如何判定",
      P("点击任意问题查看对应的治理字段与控制点。这十个问题构成了「可信度」的可操作定义。"),
      CU("governance-questions"),
      CO("warning", "LLM 的置信度不等于来源权威性", "一个高置信度（例如 0.97）的抽取结果也可能来自过期、未审批或错误的文档。可信度由来源权威性、审批状态、复核周期与冲突记录共同决定；置信度只能描述抽取过程本身。"),
      CO("advice", "原文更新与删除的联动", "原文更新：沿血缘反查受影响的 Chunk、实体与关系 → 重抽取 → 版本递增 → 重新审批 → 发布。文档删除：级联清理向量索引项、仅由该文档支撑的派生事实与缓存答案，写入 tombstone 与审计事件。"),
    ),
    S("dg-explorer", "交互工具：Knowledge Governance Explorer 与知识血缘",
      P("血缘交互图展示 Document → Chunk → Extracted Entity → Canonical Entity → Relationship → Graph Record → Search Index → Generated Answer。点击任意节点查看 Source ID、Version、Created At、Updated At、Evidence、Confidence、Approval Status 与 Access Policy。"),
      CU("tool-governance"),
      CO("assumption", "演示数据", "血缘节点、版本、时间与置信度均为模拟值（" + SIM + "），用于说明字段契约与级联关系，不代表真实系统的血缘记录。"),
    ),
    S("dg-quality", "交互工具：知识质量评分仪表盘",
      P("八个质量维度以演示数据呈现，支持切换趋势视图与指标定义视图。所有数值均为模拟数据，<strong>不是行业基准</strong>，不可用于与任何真实系统对比。"),
      CU("tool-quality"),
      CO("assumption", "不是行业基准", "Source Coverage / Entity Completeness / Relationship Validity / Duplicate Entity Rate / Provenance Coverage / Validation Pass Rate / Stale Knowledge Rate / Access Policy Coverage 的目标值与实测值均为教学示例。"),
    ),
    S("dg-security", "权限贯穿、时态数据、审计与合规",
      T(["主题", "要求", "实现要点"], [
        ["RBAC", "按角色授予最小权限", "角色只定义基线，动态属性仍由 ABAC 判定"],
        ["ABAC", "按用户/资源/环境/用途动态判定", "四阶段一致：向量过滤、图遍历剪枝、上下文融合、答案生成"],
        ["Data Masking", "按密级与用途脱敏", "脱敏策略随字段与指标口径一起版本化"],
        ["Retention Policy", "定义保留与复核周期", "到期触发重审或 tombstone，不是简单隐藏"],
        ["Version Management", "记录定义、映射与事实版本", "答案返回口径版本，支持历史回放"],
        ["Temporal Data", "区分有效时间与事务时间", "支持「当时应该知道什么」的审计回放"],
        ["Audit", "记录全链路事件", "工具调用、检索条件、证据、回答、审批与删除证明"],
        ["Compliance", "满足监管与内部政策", "删除联动、数据主体请求、可导出的证据链"],
      ], undefined, true),
      L("权限贯穿的四个阶段（缺一不可）", [
        "向量检索：security_filter 在召回阶段过滤，禁止「先取回全部再遮掩」。",
        "图谱遍历：按节点/关系密级剪枝，路径不跨越用户无权访问的节点。",
        "上下文融合：合并证据时再次校验每条证据的密级与审批状态。",
        "最终回答：引用校验 + 权限复核 + 审计记录，失败则不出答案。",
      ], true),
      CO("warning", "生产系统不能只依赖提示词作为安全边界", "「不要泄露机密」写在提示词里不构成访问控制。策略执行点必须在服务层，并且策略服务不可用时默认拒绝（fail-closed）。"),
      CO("conclusion", "治理的产出是可回答的问题", "当审计问「这个答案依据什么、当时是否有效、谁能看、谁批准的」，治理体系应该能从血缘与审计记录中直接给出答案。"),
    ),
  ],
};

export const topicContent: Record<string, TopicPageContent> = {
  "agentic-rag": agenticRag,
  "knowledge-agent": knowledgeAgent,
  "semantic-layer": semanticLayer,
  "data-governance": dataGovernance,
};
