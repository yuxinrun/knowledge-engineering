/** 全部数值均为演示数据，用于展示指标形态与仪表盘交互；不是行业标准、不是真实客户成绩。 */
export interface MetricItem {
  name: string;
  group: "抽取质量" | "检索质量" | "回答质量" | "系统性能" | "权限安全";
  definition: string;
  value: number;
  target: number;
  unit: string;
  higherBetter: boolean;
  note: string;
}

export const metricItems: MetricItem[] = [
  { name: "实体抽取 Precision", group: "抽取质量", definition: "抽出的实体中确实为正确的比例，需人工标注集。", value: 0.91, target: 0.9, unit: "%", higherBetter: true, note: "演示值 0.91" },
  { name: "实体抽取 Recall", group: "抽取质量", definition: "标注集中的正确实体被抽出的比例。", value: 0.82, target: 0.85, unit: "%", higherBetter: true, note: "演示值 0.82，低于自定目标" },
  { name: "实体抽取 F1", group: "抽取质量", definition: "Precision 与 Recall 的调和平均。", value: 0.86, target: 0.88, unit: "%", higherBetter: true, note: "演示值 0.86" },
  { name: "关系抽取 Precision", group: "抽取质量", definition: "抽出的关系（含方向）正确的比例。", value: 0.84, target: 0.88, unit: "%", higherBetter: true, note: "演示值 0.84" },
  { name: "关系抽取 Recall", group: "抽取质量", definition: "标注集中的关系被抽出的比例。", value: 0.76, target: 0.82, unit: "%", higherBetter: true, note: "演示值 0.76，跨 Chunk 关系是主要缺口" },
  { name: "关系抽取 F1", group: "抽取质量", definition: "关系抽取 Precision/Recall 的调和平均。", value: 0.8, target: 0.85, unit: "%", higherBetter: true, note: "演示值 0.80" },
  { name: "Entity Resolution Accuracy", group: "抽取质量", definition: "消歧决策与人工标注一致的比例。", value: 0.93, target: 0.95, unit: "%", higherBetter: true, note: "演示值 0.93" },
  { name: "Ontology Validation Pass Rate", group: "抽取质量", definition: "待写入事实通过 SHACL/Schema 校验的比例。", value: 0.97, target: 0.98, unit: "%", higherBetter: true, note: "演示值 0.97" },
  { name: "Retrieval Recall@K", group: "检索质量", definition: "Top-K 结果覆盖标注证据的比例（示例 K=8）。", value: 0.88, target: 0.9, unit: "%", higherBetter: true, note: "演示值 0.88" },
  { name: "MRR", group: "检索质量", definition: "第一个正确证据出现名次倒数的平均值。", value: 0.79, target: 0.8, unit: "score", higherBetter: true, note: "演示值 0.79" },
  { name: "NDCG", group: "检索质量", definition: "考虑相关性等级与排序位置的归一化折损增益。", value: 0.83, target: 0.85, unit: "score", higherBetter: true, note: "演示值 0.83" },
  { name: "Graph Path Accuracy", group: "检索质量", definition: "返回的图路径与专家标注路径一致的比例。", value: 0.87, target: 0.9, unit: "%", higherBetter: true, note: "演示值 0.87" },
  { name: "Answer Faithfulness", group: "回答质量", definition: "答案陈述可被给定证据支持的比例。", value: 0.92, target: 0.95, unit: "%", higherBetter: true, note: "演示值 0.92" },
  { name: "Citation Accuracy", group: "回答质量", definition: "引用 ID 存在且确实支持对应结论的比例。", value: 0.89, target: 0.95, unit: "%", higherBetter: true, note: "演示值 0.89" },
  { name: "Answer Completeness", group: "回答质量", definition: "答案覆盖标注要点（影响系统/团队/手册）的比例。", value: 0.85, target: 0.9, unit: "%", higherBetter: true, note: "演示值 0.85" },
  { name: "ACL Leakage Rate", group: "权限安全", definition: "越权用例中出现无权证据或推断的比例，目标为 0。", value: 0.004, target: 0, unit: "%", higherBetter: false, note: "演示值 0.4%；生产门禁应为 0" },
  { name: "P50 Latency", group: "系统性能", definition: "端到端查询延迟中位数。", value: 2.1, target: 2.5, unit: "s", higherBetter: false, note: "演示值 2.1s" },
  { name: "P95 Latency", group: "系统性能", definition: "端到端查询延迟 95 分位。", value: 5.4, target: 5, unit: "s", higherBetter: false, note: "演示值 5.4s，高于自定目标" },
  { name: "Cost per Query", group: "系统性能", definition: "单次查询的模型、检索与计算成本估算。", value: 0.07, target: 0.08, unit: "USD", higherBetter: false, note: "演示值 0.07（示意单位，非报价）" },
  { name: "Indexing Latency", group: "系统性能", definition: "文档从入库到可检索的时间。", value: 14, target: 15, unit: "min", higherBetter: false, note: "演示值 14min" },
];

export const metricGroups = ["抽取质量", "检索质量", "回答质量", "系统性能", "权限安全"] as const;

export const kpiCards = [
  { label: "实体抽取 F1", value: "0.86", hint: "演示数据 · 目标 0.88", tone: "blue" as const },
  { label: "Retrieval Recall@8", value: "0.88", hint: "演示数据 · 目标 0.90", tone: "cyan" as const },
  { label: "Answer Faithfulness", value: "0.92", hint: "演示数据 · 目标 0.95", tone: "purple" as const },
  { label: "P95 Latency", value: "5.4s", hint: "演示数据 · 预算 5.0s", tone: "amber" as const },
  { label: "ACL Leakage Rate", value: "0.4%", hint: "演示数据 · 生产门禁应为 0", tone: "green" as const },
];

export const radarData = [
  { dimension: "抽取质量", 演示基线: 84, 目标阈值: 90 },
  { dimension: "检索质量", 演示基线: 86, 目标阈值: 90 },
  { dimension: "回答质量", 演示基线: 89, 目标阈值: 93 },
  { dimension: "系统性能", 演示基线: 76, 目标阈值: 85 },
  { dimension: "权限安全", 演示基线: 92, 目标阈值: 100 },
];

export const accuracyBarData = [
  { name: "实体 P", 当前: 91, 目标: 90 }, { name: "实体 R", 当前: 82, 目标: 85 }, { name: "实体 F1", 当前: 86, 目标: 88 },
  { name: "关系 P", 当前: 84, 目标: 88 }, { name: "关系 R", 当前: 76, 目标: 82 }, { name: "关系 F1", 当前: 80, 目标: 85 },
  { name: "ER Acc", 当前: 93, 目标: 95 }, { name: "Validation", 当前: 97, 目标: 98 },
];

export const retrievalBarData = [
  { name: "Recall@8", 当前: 88, 目标: 90 }, { name: "MRR", 当前: 79, 目标: 80 },
  { name: "NDCG", 当前: 83, 目标: 85 }, { name: "Path Acc", 当前: 87, 目标: 90 },
  { name: "Faithfulness", 当前: 92, 目标: 95 }, { name: "Citation", 当前: 89, 目标: 95 },
  { name: "Completeness", 当前: 85, 目标: 90 },
];

export const latencySeries = [
  { week: "W1", p50: 2.8, p95: 7.1, cost: 0.095 },
  { week: "W2", p50: 2.6, p95: 6.6, cost: 0.09 },
  { week: "W3", p50: 2.4, p95: 6.2, cost: 0.084 },
  { week: "W4", p50: 2.3, p95: 5.9, cost: 0.079 },
  { week: "W5", p50: 2.2, p95: 5.7, cost: 0.075 },
  { week: "W6", p50: 2.2, p95: 5.5, cost: 0.072 },
  { week: "W7", p50: 2.1, p95: 5.4, cost: 0.07 },
  { week: "W8", p50: 2.1, p95: 5.4, cost: 0.07 },
];
