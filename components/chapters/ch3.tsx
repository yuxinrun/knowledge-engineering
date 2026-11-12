import { Badge, Callout, Card, ChapterHeader, DataTable, Formula, Prose, StepBadge } from "@/components/ui/primitives";
import { ChapterSection } from "@/components/ui/chapter-section";
import { CodeExample } from "@/components/ui/code-example";
import { ClassHierarchy } from "@/components/viz/class-hierarchy";
import { ObjectPropertyGraph } from "@/components/viz/diagram-wrappers";
import { chapters } from "@/data/site";

const meta = chapters[2];

const designSteps = [
  ["1", "确定业务领域和边界", "选定 IT 运维依赖与故障处置，明确「不做全企业知识问答」", "场景说明、边界声明", "一上来就建「企业万事万物本体」"],
  ["2", "梳理 Competency Questions", "列出本体必须支持回答的问题，如「故障影响哪些系统」「谁负责」「有哪些手册」", "CQ 清单 + 反例问题", "只列名词不列问题，导致模型无法验收"],
  ["3", "识别 Class", "从 CQ 与真实文档中抽取稳定概念：System、Service、Database、Team…", "候选 Class 表", "把状态、组织、运行环境当成 Service 子类"],
  ["4", "设计 Class Hierarchy", "按 is-a 关系组织父类/子类，如 TechnicalAsset → Service", "类层次树", "把「生产环境的服务」建成子类"],
  ["5", "定义 Object Properties", "定义 contains、calls、dependsOn、connectsTo 等关系语义", "关系字典", "把属性写成关系，或把关系写成字符串字段"],
  ["6", "定义 Data Properties", "定义 serviceId、serviceName、status、severity 等字面量字段", "字段字典与数据类型", "同一字段多种类型/单位"],
  ["7", "定义 Domain 和 Range", "为每条关系写明起点与终点类型", "Domain/Range 表", "误把 OWL Domain/Range 当强制写入校验"],
  ["8", "设计 Cardinality", "明确 1..1、0..n 等基数，如 Service 必须恰好一个 ownedBy Team", "基数与约束表", "基数过严导致真实数据大量校验失败"],
  ["9", "设计 OWL Axioms", "用 subClassOf、Restriction、disjointWith 等表达语义与可推导结论", "OWL Turtle 文件", "开放世界假设下误以为「没写就是假」"],
  ["10", "使用 SHACL 设计数据约束", "必填、枚举、类型、正则、唯一性说明", "SHACL Shapes + ValidationReport", "把 SHACL 与 OWL 混为一谈"],
  ["11", "使用真实业务数据验证本体", "用第 2 章 7 条事实与故意注入的错误数据做回归", "验证报告 + 修订记录", "只用理想化样例数据"],
  ["12", "本体版本管理与持续演进", "Schema 版本、迁移脚本、弃用策略与评审流程", "版本日志 + 迁移文档", "无版本号导致抽取 Schema 与图谱漂移"],
];

const classRows = [
  ["Business", "业务线 / 业务能力", "businessId、businessName", "线上交易业务（BIZ-001）"],
  ["System", "一组协同提供能力的系统边界", "systemId、systemName、criticality", "OrderSystem（SYS-001）"],
  ["Service", "可独立部署/调用的服务单元", "serviceId、serviceName、status", "PaymentService（SVC-002）"],
  ["Database", "持久化数据存储实例", "dbId、dbType、version", "PaymentDB（DB-001）"],
  ["Infrastructure", "主机、集群、网络与中间件", "assetId、region", "PG-Cluster-01（INFRA-001）"],
  ["Team", "责任组织与值班主体", "teamId、name、oncallChannel", "PaymentTeam（TEAM-001）"],
  ["Incident", "有状态变化与时间线的故障事件", "incidentId、severity、occurredAt", "Incident-001（INC-001）"],
  ["Runbook", "标准化处置手册", "runbookId、title、version、reviewedAt", "Runbook-001（RB-001）"],
  ["Environment", "部署/运行环境上下文", "environmentName、region", "Production（ENV-PROD）"],
  ["Document", "原始文档实体（承载权限与来源）", "documentId、source、classification、updatedAt", "支付服务故障处理手册.pdf（DOC-001）"],
];

const objectPropertyRows = [
  ["contains", "System", "Service", "1..n / 1", "系统包含服务；方向不可反写"],
  ["calls", "Service", "Service", "0..n / 0..n", "运行期可观测调用，不等价于 dependsOn"],
  ["dependsOn", "Service / System", "TechnicalAsset", "0..n / 0..n", "设计或部署依赖，用于影响分析"],
  ["connectsTo", "Service", "Database", "0..n / 0..n", "配置层面连接关系，来自 CMDB/配置文档"],
  ["ownedBy", "Service / System", "Team", "1..1（建议）", "责任定位；SHACL 中设 minCount 1"],
  ["deployedIn", "Service / Database", "Environment", "1..n", "同一服务多环境需结合实例 ID 或有效期"],
  ["affects", "Incident", "Service / System", "1..n / 0..n", "故障传播路径起点"],
  ["resolvedBy", "Incident", "Runbook", "0..n / 0..n", "该事件实际采用的处置手册"],
  ["documentedBy", "Service / System", "Runbook", "0..n / 0..n", "服务有对应手册，语义不同于 resolvedBy"],
];

const dataPropertyRows = [
  ["systemId", "System", "xsd:string", "是", "SYS-001", "来自 CMDB 的权威 ID"],
  ["serviceId", "Service", "xsd:string", "是", "SVC-002", "^SVC-[0-9]{3}$；应用层/数据库保证全局唯一"],
  ["serviceName", "Service", "xsd:string", "是", "PaymentService", "SHACL minCount 1"],
  ["status", "Service", "xsd:string（枚举）", "是", "Running", "仅 Running / Stopped / Failed"],
  ["severity", "Incident", "xsd:string（枚举）", "是", "P1", "按企业事件等级定义"],
  ["dbType", "Database", "xsd:string", "否", "PostgreSQL", "注意版本字段与类型字段分离"],
  ["environmentName", "Environment", "xsd:string", "是", "Production", "环境是上下文，不是 Service 子类"],
];

const antiPatterns = [
  ["一个类承担过多业务含义", "用 Asset 同时表示服务、数据库、团队和文档", "Domain/Range 失去意义，查询无法判断类型", "拆分 Class Hierarchy，必要时引入抽象父类"],
  ["属性和关系混为一谈", "把 ownedBy 写成 Service 的字符串字段", "无法做图遍历与责任路径分析", "指向另一个实体的用 Object Property，字面量用 Data Property"],
  ["不合理的类继承", "RunningService 继承 Service", "状态变化会导致个体换类", "状态放入 Data Property；必要时建模为时态事实"],
  ["关系方向混乱", "一处写 A CALLS B，另一处写 B CALLS A", "影响分析与路径查询完全失真", "在关系字典中规定方向并写入校验规则"],
  ["把系统状态写成不同的类", "FailedService / HealthyService / StoppedService", "类爆炸、约束重复、历史无法表达", "status 枚举 + 有效期/事件化事实"],
  ["缺少唯一标识符", "MERGE 只用 name", "同名服务被合并，或重复节点不断产生", "使用权威 ID（serviceId/dbId…）+ 唯一约束"],
];

const deliverables = [
  ["Domain Model", "领域边界、CQ 清单、概念定义", "领域架构师 + 业务方"],
  ["Class Hierarchy", "父类/子类、is-a 关系说明", "本体工程师"],
  ["OWL 文件", "Class / Property / Axiom / Restriction", "本体工程师"],
  ["SHACL Shapes", "必填、枚举、基数、正则、唯一性说明", "数据治理"],
  ["Ontology Mapping", "抽取类型/关系 → 本体类型/属性映射表", "数据工程师"],
  ["Data Property 字典", "字段类型、枚举、单位、来源、owner", "数据治理"],
  ["验证报告", "真实样本 + 注入错误数据的 ValidationReport", "QA / 本体工程师"],
  ["版本与迁移文档", "schema_version、弃用策略、灰度与回滚", "平台团队"],
];

export default function Chapter3() {
  return (
    <>
      <ChapterHeader id={meta.id} no={meta.no} title={meta.title} subtitle={meta.subtitle} minutes={meta.minutes} />
      <Prose><p className="lead">本体设计不是画一张漂亮的分类图，而是把业务语义变成<strong>可被机器校验、可被工程团队共同遵守、可随业务演进</strong>的契约。下面 12 步是真实项目中较稳健的顺序。</p></Prose>

      <ChapterSection id="ch3-process" title="12 步本体设计流程" first>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {designSteps.map(([n, title, logic, output, risk]) => (
            <Card key={n} className="p-3">
              <div className="flex items-center gap-2"><StepBadge step={n} tone="purple" /><span className="text-[12.5px] font-semibold text-ink">{title}</span></div>
              <div className="mt-2 space-y-1 text-[11px] leading-5 text-muted">
                <div><span className="font-semibold text-ink">要做什么：</span>{logic}</div>
                <div><span className="font-semibold text-ink">产出：</span>{output}</div>
                <div><span className="font-semibold text-rose-600 dark:text-rose-300">常见错误：</span>{risk}</div>
              </div>
            </Card>
          ))}
        </div>
        <Callout type="advice" title="Competency Questions 是验收的锚点">
          <p>例如「故障影响哪些系统」「谁负责这个服务」「有哪些处理手册」「该事实来自哪份文档」。如果本体无法表达回答这些问题所需的关系，就说明模型范围有缺口；如果 CQ 之外增加了大量类，则往往是过度建模。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="ch3-classes" title="Class 设计与层次树">
        <ClassHierarchy />
        <DataTable headers={["Class", "定义", "关键 Data Property", "示例个体"]} rows={classRows} dense caption="10 个类覆盖第 2 章场景及第 8 章业务链；Infrastructure / Business / Document 为扩展建模需要。" />
        <Prose className="mt-3">
          <p>继承只表达 <strong>is-a</strong>：Service 是 TechnicalAsset，Incident 是 Event。把「运行在 Production 的服务」「状态为 Failed 的服务」建成子类，都会让状态变化迫使个体换类，属于典型反模式。</p>
        </Prose>
      </ChapterSection>

      <ChapterSection id="ch3-properties" title="Object / Data Property 设计">
        <Prose><p>Object Property 连接两个 Individual，Data Property 连接 Individual 与字面量。每条关系必须写清 Domain、Range、Cardinality 与方向；下表是本书后续 Cypher 与图谱的唯一依据。</p></Prose>
        <DataTable headers={["Object Property", "Domain", "Range", "Cardinality", "语义说明"]} rows={objectPropertyRows} dense />
        <ObjectPropertyGraph />
        <Prose className="mt-4"><p>Data Property 设计（与 SHACL / Neo4j 属性一一对应）：</p></Prose>
        <DataTable headers={["Data Property", "Domain", "类型", "必填", "示例值", "说明"]} rows={dataPropertyRows} dense />
        <Callout type="warning" title="Domain / Range 不是强制校验">
          <p>OWL 的 <code>rdfs:domain</code> / <code>rdfs:range</code> 用于推理语义：声明 <code>ownedBy</code> 的 Range 为 Team，推理器可以推断某个宾语属于 Team，但<strong>不会自动拒绝写入一个非 Team 的对象</strong>。强制校验需要 SHACL、数据库约束或应用层规则。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="ch3-owl" title="OWL Turtle 代码示例">
        <Prose><p>下面片段展示 System / Service / Database / Team 等类、9 类对象属性、数据属性与 ABox 实例。它表达「什么可以被说什么」以及一部分可推导语义。</p></Prose>
        <CodeExample id="owl-core" />
        <DataTable
          headers={["OWL 构造", "作用", "本书示例"]}
          rows={[
            ["owl:Class / rdfs:subClassOf", "定义类与类层次", "Service ⊑ TechnicalAsset"],
            ["owl:ObjectProperty", "定义对象间关系", "ex:connectsTo"],
            ["owl:DatatypeProperty", "定义字面量属性", "ex:serviceId"],
            ["owl:Restriction + minCardinality", "表达必要条件与基数公理", "Service 至少 1 个 ownedBy"],
            ["rdfs:domain / rdfs:range", "表达定义域与值域（推理语义）", "ownedBy: Service → Team"],
            ["ABox 个体断言", "声明具体实例与事实", "ex:PaymentService a ex:Service"],
          ]}
          dense
        />
      </ChapterSection>

      <ChapterSection id="ch3-shacl" title="SHACL 约束示例">
        <Prose><p>SHACL 负责「数据长什么样才算合格」。示例覆盖四项要求：Service 必须有 serviceName、status 只能是三个枚举值、Service 必须有一个 ownedBy Team、以及 serviceId 的格式与唯一性说明。</p></Prose>
        <CodeExample id="shacl-core" />
        <Prose className="mt-3">
          <p><strong>关于 serviceId 唯一性：</strong>SHACL Core 没有内建的「全局唯一」约束；示例用 SHACL-SPARQL 扩展给出检查形状，实际项目更常见的组合是：</p>
          <ul>
            <li>RDF 数据：SHACL-SPARQL 或加载阶段用 SPARQL 查询做重复检测；</li>
            <li>Neo4j 属性图：<code>CREATE CONSTRAINT service_id ... REQUIRE s.serviceId IS UNIQUE</code>（第 5 章）；</li>
            <li>应用层：写入前按权威 ID 做幂等检查，并记录失败原因。</li>
          </ul>
        </Prose>
        <Formula expression={"\\text{ValidationReport conforms} = \\forall\\ \\text{fact} \\in \\text{ABox} : \\text{satisfiesShapes}(\\text{fact})"} />
      </ChapterSection>

      <ChapterSection id="ch3-owl-vs-shacl" title="OWL 与 SHACL 的分工及 Neo4j 映射">
        <DataTable
          headers={["维度", "OWL 2", "SHACL", "Neo4j Constraint"]}
          rows={[
            ["定位", "语义模型与公理表达", "RDF 数据结构校验", "属性图存储层约束"],
            ["典型能力", "类层次、等价类、互斥、传递性、推理", "minCount / maxCount / datatype / in / pattern", "唯一性、存在性（版本相关）、索引"],
            ["世界假设", "开放世界：未陈述不等于假", "闭世界式验证：缺少必填即违规", "存储层强制：违反即写入失败"],
            ["失败含义", "推出新结论或发现逻辑不一致", "产出 ValidationReport", "抛异常 / 事务回滚"],
            ["能否互相替代", "不能", "不能", "不能"],
          ]}
          dense
        />
        <Prose className="mt-4">
          <p><strong>关键事实：Neo4j 不会因为导入 OWL 就自动执行全部 OWL / SHACL 语义。</strong>Neo4j 是 Labeled Property Graph 数据库，不原生执行 OWL 推理，也不原生执行 SHACL 验证。若使用 Neo4j，需要显式设计映射与独立验证机制：</p>
        </Prose>
        <DataTable
          headers={["RDF / OWL 概念", "属性图映射", "注意事项"]}
          rows={[
            ["owl:Class / rdfs:Class", "Node Label（如 :Service）", "多类型可用多 Label；类层次不会自动变成 Label 继承"],
            ["Individual / ABox 实例", "Node + properties", "IRI 应映射为稳定 ID 属性"],
            ["Object Property", "Relationship（含方向与属性）", "关系方向必须统一；不要混用 CALLS 与 DEPENDS_ON"],
            ["Data Property / 字面量", "Node property", "类型单位与枚举在应用层/SHACL 中校验"],
            ["OWL Axiom / Restriction", "独立推理器或规则引擎", "Neo4j 不会自动推理，需设计等价规则"],
            ["SHACL Shape", "独立验证器（pyshacl 等）或应用层 Schema", "在写入前校验；不要假设数据库会执行 Shape"],
          ]}
          dense
        />
        <Callout type="principle" title="本体约束与数据库约束不是同一个概念">
          <p>OWL 表达「什么在语义上成立」，SHACL 检查「数据是否符合约定形状」，数据库约束保证「存储层不会出现重复键」。三者层次不同，生产系统通常需要组合使用。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="ch3-anti" title="六类本体设计反例">
        <DataTable headers={["反模式", "反例", "后果", "修正方向"]} rows={antiPatterns} dense />
        <Callout type="warning" title="最贵的错误往往最早发生">
          <p>类层次与关系方向一旦进入抽取 Schema、Cypher 脚本与前端图谱，修改成本会迅速上升。建议先用 7 条示例业务事实做端到端穿透测试，再扩大语料范围。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="ch3-deliverables" title="本体设计交付物清单">
        <DataTable headers={["交付物", "内容", "建议责任人"]} rows={deliverables} dense />
        <Prose className="mt-4">
          <p>交付物必须可版本化、可回归：每次本体变更都应携带 <code>schema_version</code>，并同步更新 Ontology Mapping、Extraction Schema、SHACL Shapes 与评估数据集。第 11 章的 Phase 2 与第 12 章的项目目录会给出落地结构。</p>
        </Prose>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["OWL 2", "SHACL", "Protégé", "pyshacl", "Class Hierarchy", "Competency Questions"].map((t) => <Badge key={t} tone="purple">{t}</Badge>)}
        </div>
      </ChapterSection>
    </>
  );
}
