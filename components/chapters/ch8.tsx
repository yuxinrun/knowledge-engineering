import { Badge, Callout, ChapterHeader, DataTable, Prose } from "@/components/ui/primitives";
import { ChapterSection } from "@/components/ui/chapter-section";
import { CaseNetworkDiagram, CaseNetworkSingle } from "@/components/viz/case-network";
import { caseStudies, type CaseStudy } from "@/data/itops";
import { chapters } from "@/data/site";

const meta = chapters[7];

function CaseDetailTable({ study }: { study: CaseStudy }) {
  return (
    <DataTable
      headers={["分析维度", "内容"]}
      rows={[
        ["1. 业务痛点", study.pain],
        ["2. 原始数据", study.rawData],
        ["3. 是否需要 Ontology", study.ontology],
        ["4. 是否需要 Knowledge Graph", study.knowledgeGraph],
        ["5. 是否需要 GraphRAG", study.graphrag],
        ["6. 推荐架构", study.architecture],
        ["7. 关键技术", study.tech],
        ["8. 数据治理难点", study.governance],
        ["9. 预期收益", study.benefit],
        ["10. 风险", study.risk],
        ["11. 实施路径", study.path],
      ]}
      dense
    />
  );
}

function CaseIntro({ study }: { study: CaseStudy }) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <Badge tone="blue">{study.title}</Badge>
      <span className="text-[11.5px] text-muted">{study.subtitle}</span>
      <Badge tone="amber">教学场景模型</Badge>
    </div>
  );
}

export default function Chapter8() {
  const itops = caseStudies[0];
  const finance = caseStudies[1];
  const supply = caseStudies[2];
  const manufacturing = caseStudies[3];

  return (
    <>
      <ChapterHeader id={meta.id} no={meta.no} title={meta.title} subtitle={meta.subtitle} minutes={meta.minutes} />
      <Prose><p className="lead">四个案例用于回答同一个问题：<strong>在真实约束下，是否需要 Ontology、Knowledge Graph 与 GraphRAG，以及按什么顺序引入</strong>。所有场景都是教学模型，不对应任何具体客户或项目。</p></Prose>

      <ChapterSection id="ch8-itops" title="重点案例一：企业 IT 运维" first>
        <CaseIntro study={itops} />
        <Prose>
          <p>完整业务链：<strong>Business → System → Service → API → Database → Infrastructure → Team → Incident → Runbook</strong>。下图展示依赖关系、故障传播路径、影响分析、责任团队定位与运维手册匹配。切换标签可直接对比其他三个行业案例。</p>
        </Prose>
        <CaseNetworkDiagram />
        <Prose className="mt-4"><p>十一项分析（与第 2 章示例数据一致）：</p></Prose>
        <CaseDetailTable study={itops} />
        <Callout type="advice" title="为什么 IT 运维最适合作为首个 GraphRAG 场景">
          <p>依赖关系相对明确、影响分析价值高、答案可人工核验、文档证据（Runbook / 工单）丰富，且可以先用 PaymentService 单服务做 MVP 控制风险。这也是本书统一贯穿该场景的原因。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="ch8-finance" title="金融风控：关联网络与规则引擎">
        <CaseIntro study={finance} />
        <Prose><p>客户、账户、交易、设备、商户、地址之间的多跳关联，是图查询的典型场景；下图为关联网络示意。</p></Prose>
        <CaseNetworkSingle caseId="finance" />
        <CaseDetailTable study={finance} />
        <Callout type="warning" title="GraphRAG 不是自动替代专业风控模型或规则引擎">
          <p>风控决策依赖经过验证的模型、规则、合规流程与人工复核。GraphRAG 可以用于<strong>调查辅助、路径解释与证据聚合</strong>，但不能把生成式答案当作风险判定结论，更不能绕过既有的审计与授权链路。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="ch8-supply" title="供应链：中断影响分析">
        <CaseIntro study={supply} />
        <Prose><p>供应商中断沿零部件、工厂、仓储、运输、订单逐级传播；下图可点击节点与关系查看定义。</p></Prose>
        <CaseNetworkSingle caseId="supply" />
        <CaseDetailTable study={supply} />
        <Callout type="advice" title="时态与版本是供应链图谱的难点">
          <p>BOM 版本、替代料生效日期、产能与运输计划都会变化。若忽略 valid_from / valid_to，影响分析会把历史结构当成当前结构，产生大量过度告警。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="ch8-manufacturing" title="制造业：设备与维修知识">
        <CaseIntro study={manufacturing} />
        <Prose><p>设备、传感器、产线、工艺、故障与维修知识之间的关系如下。高频时序数据应留在时序库，图谱保存结构关系与知识关联。</p></Prose>
        <CaseNetworkSingle caseId="manufacturing" />
        <CaseDetailTable study={manufacturing} />
        <Callout type="warning" title="相似 ≠ 适用">
          <p>维修手册常绑定具体机型、工艺版本与安全条件。检索时若只按语义相似度召回，可能把不适用机型的步骤推荐给现场。应把机型、工艺版本与适用范围做成可过滤的结构化条件。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="ch8-disclaimer" title="案例边界声明">
        <Prose>
          <ul>
            <li>四个案例均为<strong>用于教学的企业场景模型</strong>，不含具体客户名称、真实项目数据、真实效果指标或采购建议。</li>
            <li>「预期收益」均为定性架构预期，不是量化承诺；实际收益必须在企业自己的评估集上测量。</li>
            <li>「是否需要」是架构建议，取决于各企业的数据质量、权限模型、团队能力与合规要求。</li>
            <li>图谱中的实体与关系用于说明建模方法，不代表任何行业标准数据模型。</li>
          </ul>
        </Prose>
        <Callout type="assumption" title="不要把案例表格当成实施模板直接套用">
          <p>真实项目必须先做数据盘点与 Competency Questions（第 3、11 章），再决定本体范围与图结构。直接复制示例类层次或关系类型，往往会把本书的简化假设带进生产系统。</p>
        </Callout>
      </ChapterSection>
    </>
  );
}
