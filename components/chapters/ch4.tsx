import { AnchorHeading, Badge, Callout, ChapterHeader, DataTable, Formula, Prose } from "@/components/ui/primitives";
import { ChapterSection } from "@/components/ui/chapter-section";
import { CodeExample } from "@/components/ui/code-example";
import { EntityResolutionFlow } from "@/components/viz/entity-resolution-flow";
import { FusionDiagram, PipelineDiagram } from "@/components/viz/diagram-wrappers";
import { pipelineSteps } from "@/data/diagrams";
import { chapters } from "@/data/site";

const meta = chapters[3];

const parseDetails = [
  ["1. 文档解析", "PDF、Word、Excel、HTML、Confluence、SharePoint 的版式差异极大。扫描件需要 OCR；表格要保留行列语义；标题层级与页码坐标是后续 Chunk 与 Citation 的基础。", "建议记录 parse_quality 与原文件哈希，解析失败时保留原文件引用并降级为逐页文本，不要静默丢弃。"],
  ["2. Chunk 切分", "按章节、语义边界、表格整体性与页码切分，避免把一条关系的主语和宾语切到两个 Chunk。", "chunk_id 应稳定可复现（内容哈希 + 页码 + 切分器版本）；重新切分必须能触发索引与图谱的增量更新。"],
  ["3. 实体抽取", "LLM 输出 System、Service、Database、Team 等实体及属性、confidence 与 evidence_span。", "必须用 Pydantic / Structured Outputs Schema 限制类型；抽取结果是候选事实，不是已验证事实。"],
  ["4. 关系抽取", "在已抽取实体之间识别 CALLS、OWNS/OWNED_BY、DEPENDS_ON、CONNECTS_TO 等关系，并附原文证据。", "端点必须在本批实体中声明；关系方向必须与本体字典一致；跨 Chunk 关系交给融合阶段处理。"],
  ["5. 本体映射", "把 LLM 的类型/关系映射到 OWL Class 与 Object Property，把属性映射到 Data Property。", "白名单之外的类型直接隔离；OWL Domain/Range 不能代替运行时校验。"],
  ["6. Entity Resolution", "精确 ID → Alias → 规则 → Embedding 相似度 → LLM 上下文判断 → 人工审核 → 可回滚合并。", "自动合并必须可逆；中分区间进入人工队列，形成标注数据用于校准权重。"],
  ["7. Knowledge Fusion", "多来源事实按来源权威性、时间新旧、证据数量与人工审核消解冲突。", "保留全部原始证据、版本与有效期；临时状态不要覆盖常态配置事实。"],
  ["8. 数据校验", "SHACL / Pydantic / 枚举 / 基数 / 权限标签 / 时效性与人工抽检。", "未通过校验的事实禁止写入生产图谱；ValidationReport 进入审计日志。"],
  ["9. 图数据库写入", "以权威 ID 为 MERGE 键写入节点与关系，同时 upsert 文档 Chunk 与向量索引。", "幂等重试、事务边界、唯一约束、关系方向白名单与索引/图谱对账缺一不可。"],
  ["10. 变更检测与增量更新", "基于内容哈希、updated_at 与变更工单识别新增/修改/删除，触发局部重建与软删除。", "删除必须同步图、索引与缓存；时态事实使用 valid_from / valid_to 而不是直接覆盖。"],
];

const productionFields = [
  ["source_document", "原始文档 ID，回答「这条事实从哪来」", "审计与引用"],
  ["chunk_id", "文档分块 ID，与 AI Search 索引对齐", "证据定位"],
  ["evidence_span", "原文字符区间与短句，支持人工核验", "抽取复核"],
  ["extractor_version", "Prompt / Schema / 模型版本，支持回放与 A/B", "回归评估"],
  ["observed_at", "事实被观察或抽取的时间，区别于业务发生时间", "时态知识"],
  ["source_authority", "来源权威等级（如 CMDB 高于描述性文档）", "冲突消解"],
  ["confidence", "模型对该次抽取的把握，不等于来源权威性", "审核阈值"],
  ["security_groups", "权限标签，必须下推到所有检索路径", "ACL"],
  ["review_state", "pending / approved / rejected", "人工审核"],
];

export default function Chapter4() {
  return (
    <>
      <ChapterHeader id={meta.id} no={meta.no} title={meta.title} subtitle={meta.subtitle} minutes={meta.minutes} />
      <Prose><p className="lead">「把文档丢给 LLM 然后写进 Neo4j」是最危险的做法。可维护的构建链路必须做到：<strong>每一步有输入契约、输出契约、失败处理与可回放证据</strong>。</p></Prose>

      <ChapterSection id="ch4-pipeline" title="端到端 Pipeline 交互图" first>
        <Prose><p>点击下图任一节点查看该步骤的输入、处理逻辑、输出、技术选择、常见问题与失败处理；点击连线查看数据交接。图下方还可以逐步切换处理契约。</p></Prose>
        <PipelineDiagram />
      </ChapterSection>

      <ChapterSection id="ch4-steps" title="每一步的输入 / 输出 / 失败处理">
        <DataTable
          headers={["步骤", "输入", "处理逻辑", "输出", "技术选择", "常见问题", "失败处理"]}
          rows={pipelineSteps.map((s) => [s.label, s.input, s.logic, s.output, s.tech, s.pitfall, s.failure])}
          dense
          caption="表格可横向滚动；与上方交互图的节点详情完全一致。"
        />
        <Prose className="mt-4"><p>下面按 10 个主题补充工程细节：</p></Prose>
        <div className="space-y-2">
          {parseDetails.map(([title, body, caution], i) => (
            <div key={title} className="rounded-xl border border-line bg-surface p-3 shadow-card">
              <div className="flex items-center gap-2"><Badge tone="blue">{String(i + 1).padStart(2, "0")}</Badge><span className="text-[12.5px] font-semibold text-ink">{title}</span></div>
              <p className="mt-1.5 text-[12px] leading-6 text-muted">{body}</p>
              <p className="mt-1 text-[11.5px] leading-6 text-cyan-700 dark:text-cyan-300"><strong>要点：</strong>{caution}</p>
            </div>
          ))}
        </div>
        <Callout type="advice" title="失败处理是 Pipeline 的一等公民">
          <p>重试策略、死信队列、幂等键、parse_quality 降级、人工审核队列与对账任务，决定系统能否长期运行。LLM 调用失败时可以保留文档 Chunk 进入文本索引（降级路径），但不应该把不完整的事实写入图谱。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="ch4-extraction" title="结构化抽取 JSON 与 Pydantic">
        <Prose><p>先看最小抽取结果，再看生产环境必须补充的字段，然后用 Pydantic 把 Ontology 变成类型白名单，最后用 Azure OpenAI Structured Outputs 调用。</p></Prose>
        <CodeExample id="extraction-json" />
        <Prose className="mt-4">
          <p><strong>这是示例结构。</strong>生产环境还应包含下列字段，否则事实无法审计、无法回放、无法按权限过滤：</p>
        </Prose>
        <DataTable headers={["字段", "含义", "用途"]} rows={productionFields} dense />
        <CodeExample id="extraction-production-json" />
        <Prose className="mt-4"><p>用 Pydantic v2 把允许的 Class 与关系做成 Enum，让非法类型在解析阶段失败：</p></Prose>
        <CodeExample id="pydantic" />
        <Prose className="mt-4"><p>Azure OpenAI Structured Outputs 调用示例（单 Chunk）：</p></Prose>
        <CodeExample id="azure-openai-structured" />
        <Callout type="warning" title="不要把 LLM 抽取结果直接视为真实事实">
          <p>Structured Outputs 只保证输出符合 JSON Schema，不保证内容真实。每条候选事实都应带 <code>confidence</code>、<code>evidence_span</code>、<code>source_document</code>、<code>extractor_version</code> 与审核状态，并经过本体映射、消歧、融合和校验后才可写库。</p>
        </Callout>
        <Callout type="advice" title="版本敏感性">
          <p>Structured Outputs 的 API 版本、模型支持范围与 SDK 方法名（如 <code>client.beta.chat.completions.parse</code>）会随 Azure OpenAI 与 openai SDK 演进而变化。请以官方文档中当前稳定版本为准，并把 API 版本与部署名写入配置而不是硬编码。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="ch4-er" title="Entity Resolution 与评分机制">
        <Prose><p>实体消歧决定图谱是否可信。「PaymentService」「支付服务」「PaymentSvc」「SVC-002」是否同一个实体，需要分层判断；下面流程与打分器可交互。</p></Prose>
        <EntityResolutionFlow />
        <Prose className="mt-4">
          <p>七类方法按可靠性与成本递增排列：</p>
          <ul>
            <li><strong>精确 ID 匹配：</strong>最高可信，但要求企业已有稳定 ID 体系。</li>
            <li><strong>Alias 匹配：</strong>由领域专家维护别名表，命中后进入高分候选。</li>
            <li><strong>规则匹配：</strong>类型一致、命名模式、环境与归属一致。</li>
            <li><strong>Embedding 相似度：</strong>捕捉字面不同但语义相近的表述，只是打分因子之一。</li>
            <li><strong>LLM 上下文判断：</strong>处理边界样本，输出理由与证据，但存在幻觉与不稳定性。</li>
            <li><strong>人工审核：</strong>中分区间由人裁定，同时沉淀标注数据。</li>
            <li><strong>自动合并风险：</strong>必须保留原始实体、分数、决策版本与回滚路径。</li>
          </ul>
        </Prose>
        <Formula expression={"\\text{Entity Score} = 0.4 \\cdot S_{id} + 0.25 \\cdot S_{name} + 0.2 \\cdot S_{context} + 0.15 \\cdot S_{embedding}"} />
        <CodeExample id="entity-resolution" />
        <Callout type="assumption" title="权重与阈值必须用真实数据校准">
          <p>上面的 0.4 / 0.25 / 0.2 / 0.15 与自动合并阈值只是<strong>初始示例权重</strong>，不是行业推荐值。应按实体类型分别用标注数据拟合，并对「误合并」设置比「漏合并」更高的代价，因为错误合并会污染整张图与历史答案。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="ch4-fusion" title="Knowledge Fusion 与来源权威性">
        <FusionDiagram />
        <Prose className="mt-4">
          <p>融合不是简单投票，而是带治理规则的决策：</p>
          <ul>
            <li><strong>来源权威性：</strong>CMDB 导出通常高于描述性 Runbook；权威性来自治理制度，不来自模型分数。</li>
            <li><strong>时间新旧：</strong>新工单可能描述临时状态，旧手册可能仍是标准流程，需要区分 observed_at 与 valid_from/valid_to。</li>
            <li><strong>事实冲突：</strong>不同来源对同一属性给出不同值时，先检查是否为时态差异或实体别名差异，再决定采信或转人工。</li>
            <li><strong>多来源证据：</strong>即使只采信一条事实，也应保留所有证据 ID，供引用与复核。</li>
            <li><strong>人工审核：</strong>冲突、低置信、高影响事实进入队列，审核结果回流为标注数据。</li>
            <li><strong>版本和有效期：</strong>事实带版本与有效期，支持 as-of 查询与回滚。</li>
            <li><strong>数据血缘 Provenance：</strong>source_document、chunk_id、evidence_span、extractor_version、observed_at 全部可追溯。</li>
          </ul>
        </Prose>
        <Callout type="conclusion" title="置信度 ≠ 来源权威性">
          <p><code>confidence = 0.96</code> 表示模型对「这句话里写了这个关系」很有把握；<code>source_authority = cmdb-export</code> 表示这份数据在治理体系中更可信。二者必须分开存储、分别参与决策。把置信度当成权威性，是知识融合阶段最隐蔽的错误之一。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="ch4-validation" title="校验、写入与增量更新">
        <Prose>
          <p><strong>校验：</strong>RDF 数据可用 pyshacl 在写入前执行 Shape 校验；属性图场景需把等价约束实现在 Pydantic Schema、Cypher 唯一约束与应用层规则中。</p>
        </Prose>
        <CodeExample id="shacl-validate" />
        <Prose className="mt-4">
          <p><strong>写入：</strong>以权威 ID 为 MERGE 键，节点和关系分开写；关系属性带 source、confidence、observed_at、valid_from 与 security_groups。写入必须与 AI Search 的 Chunk upsert 处于可重试、可对账的流程中。</p>
          <p><strong>增量更新：</strong>基于内容哈希与 updated_at 检测变更；新增走正常 Pipeline，修改触发相关事实重算与旧关系软删除，删除同步清理图、索引与缓存。每次处理记录 extractor_version 与 schema_version，方便回放。</p>
        </Prose>
        <DataTable
          headers={["变更类型", "检测方式", "图数据库动作", "索引动作", "审计要求"]}
          rows={[
            ["新增文档", "document_id 不存在 / 内容哈希新增", "MERGE 新事实", "upsert 新 Chunk", "记录来源与解析质量"],
            ["正文修改", "内容哈希变化 + 章节 diff", "重算受影响事实，旧关系设 validTo", "更新 Chunk 与向量", "保留旧版本可回滚"],
            ["文档删除", "源系统删除事件 / 定期盘点", "软删除或合规删除", "删除对应 Chunk", "记录删除工单与执行人"],
            ["本体变更", "schema_version 升级", "按迁移脚本批量映射", "必要时重建向量（模型未变则不必）", "回归评估必须重跑"],
          ]}
          dense
        />
        <AnchorHeading id="ch4-validation-note" level={4}>为什么数据治理往往比模型调用更复杂</AnchorHeading>
        <Prose><p>权限继承、ID 对齐、别名维护、来源权威性、时态版本、冲突消解、删除合规与审计回放，涉及的团队与系统远多于一次 LLM 调用。模型能力决定上限的一部分，治理质量决定系统能否长期可信。</p></Prose>
        <Callout type="principle" title="行业通用原则">
          <p>任何进入生产图谱的事实都应能回答四个问题：来自哪里、什么时候观察到、谁审核过、如何撤销。回答不了，就不应该进入下游检索与生成。</p>
        </Callout>
      </ChapterSection>
    </>
  );
}
