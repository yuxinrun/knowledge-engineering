import { Badge, Callout, ChapterHeader, DataTable, Prose } from "@/components/ui/primitives";
import { ChapterSection } from "@/components/ui/chapter-section";
import { FlowCanvas } from "@/components/viz/flow-canvas";
import { chapters } from "@/data/site";

const meta = chapters[8];

const aclNodes = [
  { id: "user", label: "用户 / 应用", sub: "Entra ID 身份 + 组", kind: "source", position: { x: 0, y: 0 }, description: "认证后注入 principal 与 allowed_groups，禁止信任客户端声明。", details: [{ label: "输出", value: "principal / allowed_groups / 审计上下文" }] },
  { id: "vector", label: "向量 / 关键词检索", sub: "ACL filter 下推", kind: "store", position: { x: 250, y: 0 }, description: "检索请求中下推 security_groups 过滤，无权 Chunk 不应进入候选集。", details: [{ label: "过滤字段", value: "security_groups" }] },
  { id: "graph", label: "图谱检索", sub: "节点 / 关系 ACL", kind: "graph", position: { x: 500, y: 0 }, description: "Cypher 中按节点、关系与路径 ACL 过滤，避免越权路径。", details: [{ label: "风险", value: "实体关联本身可能泄漏信息" }] },
  { id: "fusion", label: "Context Fusion", sub: "二次权限校验", kind: "orchestrator", position: { x: 750, y: 0 }, description: "融合后逐条核对证据 ACL 与有效期，剔除越权或过期证据。", details: [{ label: "动作", value: "去重 / 裁剪 / 二次 ACL / 时效校验" }] },
  { id: "llm", label: "LLM 生成", sub: "仅见授权证据", kind: "llm", position: { x: 1000, y: 0 }, description: "模型只能看到通过校验的证据集；输出后校验 citation_ids。", details: [{ label: "输出", value: "答案 + citation_ids + abstained" }] },
  { id: "answer", label: "最终答案", sub: "引用与审计", kind: "app", position: { x: 1250, y: 0 }, description: "答案、引用、权限标签与审计日志一致，前端隐藏不是安全边界。", details: [{ label: "门禁", value: "ACL Leakage Rate = 0" }] },
  { id: "acl", label: "RBAC / ABAC 策略", sub: "文档权限继承 + 图谱 ACL", kind: "security", position: { x: 500, y: 190 }, description: "统一策略源：角色、部门、密级、地区与时间属性。", details: [{ label: "原则", value: "四层都必须过滤，不能只在前端隐藏" }] },
];

const aclEdges = [
  { id: "acl1", source: "user", target: "vector", label: "授权上下文", kind: "source", animated: true, description: "allowed_groups 随检索请求传递" },
  { id: "acl2", source: "vector", target: "graph", label: "并行检索", kind: "store", animated: true, description: "文档证据与图事实并行召回" },
  { id: "acl3", source: "graph", target: "fusion", label: "图路径", kind: "graph", animated: true, description: "已按路径 ACL 过滤的图事实" },
  { id: "acl4", source: "fusion", target: "llm", label: "授权证据集", kind: "orchestrator", animated: true, description: "通过二次校验的 evidence_id 集合" },
  { id: "acl5", source: "llm", target: "answer", label: "答案 + 引用", kind: "app", animated: true, description: "输出前校验引用属于授权证据集" },
  { id: "acl6", source: "acl", target: "vector", label: "策略下发", kind: "security", description: "索引过滤条件来自统一策略源" },
  { id: "acl7", source: "acl", target: "graph", label: "策略下发", kind: "security", description: "图查询 ACL 条件来自统一策略源" },
  { id: "acl8", source: "acl", target: "fusion", label: "策略复核", kind: "security", description: "融合阶段再次复核，防止某一路漏过滤" },
];

const securityTopics = [
  ["1. 身份认证", "企业 SSO / OIDC / 托管身份，服务端注入 principal；前端不参与授权判定。", "令牌过期、服务间调用用共享密钥、审计缺失主体"],
  ["2. RBAC / ABAC", "RBAC 按角色，ABAC 按部门/密级/地区/时间等属性；复杂企业常需组合。", "角色膨胀、策略散落在多个服务、缺少拒绝优先规则"],
  ["3. 文档权限继承", "文档 → Chunk → 向量 → 图实体 MENTIONS 链路都要继承 security_groups。", "附件与正文权限不一致、复制文档后权限丢失"],
  ["4. 图谱权限控制", "节点、关系、路径与社区摘要都需要 ACL；按最短路径做越权检测。", "实体关联泄漏：即使节点无权，关系名或推断结论也可能越权"],
  ["5. 数据脱敏", "抽取前/索引前按密级做掩码或分词级处理，日志与缓存同样适用。", "脱敏只做在展示层，原始证据已进入模型上下文"],
];

const governanceTopics = [
  ["6. 数据血缘", "source_document / chunk_id / evidence_span / extractor_version / observed_at", "支持引用、回放、回滚与责任追踪"],
  ["7. 知识版本管理", "schema_version、fact version、Prompt 版本、Embedding 模型版本", "任一版本变化都应触发回归评估"],
  ["8. 时态知识", "valid_from / valid_to、as-of 查询、事件化事实", "避免旧 CMDB 或临时工单覆盖常态事实"],
  ["9. 增量更新", "内容哈希 + updated_at + 变更工单，局部重算与幂等写入", "避免全量重建造成长时间不一致"],
  ["10. 删除和过期", "软删除优先；合规删除同步图、索引、缓存与备份策略", "保留删除工单与执行人，避免幽灵证据"],
  ["11. 数据冲突解决", "来源权威性 + 时间 + 证据数 + 人工审核", "冲突未决时阻断自动合并"],
];

const opsTopics = [
  ["12. 失败重试", "指数退避、最大次数、死信队列，区分可重试/不可重试错误", "LLM 限流、网络超时、Schema 解析失败"],
  ["13. 任务队列", "解析/抽取/写入/索引解耦，按文档与租户做并发控制", "避免单个大文档阻塞全链路"],
  ["14. 日志", "结构化日志含 request_id、user_id、document_id、evidence_id、版本", "日志中禁止写入敏感正文与密钥"],
  ["15. 监控", "抽取质量、Validation Pass Rate、索引延迟、ACL 拦截、P50/P95", "质量下降往往早于系统报错"],
  ["16. 成本管理", "token 预算、批量 Embedding、缓存、检索 Top-K 与最大跳数上限", "Agentic 多轮迭代容易成本失控"],
  ["17. 缓存", "问题/实体链接结果/检索结果分级缓存，键中必须包含 ACL 上下文", "跨用户复用缓存会造成越权泄漏"],
  ["18. 高可用", "服务无状态、检索与图库多副本、超时降级为传统 RAG 或拒答", "降级路径仍需权限与引用校验"],
  ["19. 灾备", "原始文档、图谱、索引、评估集与配置的可恢复备份与演练", "向量索引重建耗时需纳入 RTO"],
  ["20. 多租户隔离", "索引/图库/缓存/队列/密钥按租户隔离，跨租户查询默认拒绝", "共享索引时 filter 漏写即越权"],
];

const checklist = [
  ["四层 ACL", "向量检索、图检索、上下文融合、答案生成均有过滤与校验", "阻断上线"],
  ["越权用例", "评估集包含跨部门、跨密级、跨租户与多跳推断用例", "阻断上线"],
  ["数据血缘", "任意事实可回到原始文档与 Chunk", "阻断上线"],
  ["幂等与重试", "重复任务不产生重复节点/关系/索引文档", "阻断上线"],
  ["只读图账号", "检索服务无写权限，参数化查询与查询模板白名单", "阻断上线"],
  ["版本记录", "本体/Schema/Prompt/Embedding 模型版本可查询", "阻断上线"],
  ["监控告警", "质量、延迟、成本、ACL 拦截、任务失败均有告警", "阻断上线"],
  ["删除链路", "图、索引、缓存、备份删除策略经过演练", "阻断上线"],
  ["降级路径", "图库或模型不可用时拒答或降级，不编造答案", "建议上线前完成"],
  ["回归评估", "每次改动可一键跑评估集并产出对比报告", "建议上线前完成"],
];

export default function Chapter9() {
  return (
    <>
      <ChapterHeader id={meta.id} no={meta.no} title={meta.title} subtitle={meta.subtitle} minutes={meta.minutes} />
      <Prose><p className="lead">PoC 与生产系统之间差的不只是性能，而是<strong>权限、审计、时态、一致性、可靠性与成本</strong>。本章按 20 个议题逐项给出落地要求。</p></Prose>

      <ChapterSection id="ch9-security" title="身份认证、RBAC / ABAC 与权限过滤" first>
        <Prose><p>下图展示「四层过滤」：安全策略必须覆盖向量检索、图谱检索、上下文融合和最终答案生成。点击节点与连线查看说明。</p></Prose>
        <FlowCanvas
          nodes={aclNodes}
          edges={aclEdges}
          height={330}
          minimap={false}
          legend={[
            { kind: "source", label: "身份" }, { kind: "store", label: "文档检索" }, { kind: "graph", label: "图检索" },
            { kind: "orchestrator", label: "融合" }, { kind: "llm", label: "生成" }, { kind: "security", label: "统一策略源" },
          ]}
          caption="四层 ACL 过滤示意：任何一层漏过滤都可能造成越权证据进入上下文或答案。"
        />
        <DataTable headers={["议题", "落地要求", "常见风险"]} rows={securityTopics} dense />
        <Callout type="warning" title="图谱关联本身可能泄漏知识">
          <p>用户无权访问某个节点，并不等于无权看到「它与自己可见的 PaymentService 存在某条关系」。关系名称、路径结构、社区摘要与多跳推断，都可能泄漏敏感信息。必须在<strong>查询阶段</strong>按节点/关系 ACL 过滤路径，并在融合与生成前再次校验，避免越权路径和证据泄漏。仅在前端隐藏敏感信息不是安全边界。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="ch9-governance" title="数据血缘、版本、时态与冲突">
        <DataTable headers={["议题", "关键机制", "为什么重要"]} rows={governanceTopics} dense />
        <Prose className="mt-4">
          <p><strong>知识版本</strong>不只是给文件加个 v2：本体版本、抽取 Schema、Prompt、Embedding 模型、图数据快照与索引 Schema 都要可追溯。任何一项变化都可能影响召回与答案，因此需要对应的回归评估与灰度迁移。</p>
          <p><strong>时态知识</strong>要求查询明确 as-of 时间：服务负责团队、部署环境、依赖版本、手册有效性都会变化。把临时工单中的「切到备用实例」写成常态 connectsTo 事实，是典型时态错误。</p>
        </Prose>
        <Callout type="principle" title="行业通用原则">
          <p>删除、过期与冲突处理必须先于检索设计确定。等到答案已经引用了被删除文档再去「修补前端」，通常意味着审计链路已经失效。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="ch9-ops" title="队列、重试、监控、成本与高可用">
        <DataTable headers={["议题", "落地要求", "注意点"]} rows={opsTopics} dense />
        <Prose className="mt-4">
          <p><strong>缓存键必须包含权限上下文</strong>：同一问题在不同用户/租户下可见证据不同，缓存若只按问题文本索引，会直接造成跨用户数据泄漏。<strong>高可用</strong>方面，图库或模型服务不可用时应降级为传统 RAG 或明确拒答，绝不能让模型在缺少证据时自由发挥。</p>
        </Prose>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["Entra ID", "RBAC", "ABAC", "ACL", "Provenance", "Temporal", "多租户", "灾备"].map((t) => <Badge key={t} tone="rose">{t}</Badge>)}
        </div>
      </ChapterSection>

      <ChapterSection id="ch9-checklist" title="生产上线检查清单">
        <DataTable headers={["检查项", "验收要求", "门禁级别"]} rows={checklist} dense />
        <Callout type="conclusion" title="企业数据治理往往比模型调用更复杂">
          <p>权限继承、ID 对齐、来源权威性、时态版本、删除合规、冲突消解、审计与回滚，涉及多个团队与多个系统。模型调用只是 Pipeline 中较小的一环；治理能力不足时，应缩小场景范围而不是扩大图检索深度。</p>
        </Callout>
      </ChapterSection>
    </>
  );
}
