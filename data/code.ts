import type { CodeLanguage } from "@/lib/prism";

export interface CodeSample {
  id: string;
  title: string;
  language: CodeLanguage;
  code: string;
  scope: string;
  deps: string;
  version: string;
  note?: string;
}

export const codeSamples: CodeSample[] = [
  {
    id: "owl-core",
    title: "enterprise.owl（节选）：类、属性、公理与实例",
    language: "turtle",
    scope: "教学用最小 OWL 2 本体片段；未包含版本元数据、完整基数设计与推理器性能测试。",
    deps: "Apache Jena / rdflib / Protégé（仅用于解析与查看，无需运行时服务）",
    version: "OWL 2（W3C Recommendation），Turtle 序列化；示例命名空间 example.com 仅供教学",
    note: "OWL 的 Domain/Range 用于推理语义，不是写入时强制拒绝的校验规则；强制校验请配合 SHACL 或数据库约束。",
    code: `@prefix ex:   <https://example.com/enterprise#> .
@prefix owl:  <http://www.w3.org/2002/07/owl#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd:  <http://www.w3.org/2001/XMLSchema#> .

ex:System      a owl:Class ; rdfs:label "系统"@zh .
ex:Service     a owl:Class ; rdfs:label "服务"@zh .
ex:Database    a owl:Class ; rdfs:label "数据库"@zh .
ex:Team        a owl:Class ; rdfs:label "团队"@zh .
ex:Environment a owl:Class ; rdfs:label "环境"@zh .
ex:Incident    a owl:Class ; rdfs:label "故障事件"@zh .
ex:Runbook     a owl:Class ; rdfs:label "运维手册"@zh .

ex:Service rdfs:subClassOf ex:TechnicalAsset ;
  # 每个 Service 至少有一个 ownedBy 指向 Team（OWL 基数公理）
  rdfs:subClassOf [ a owl:Restriction ;
                    owl:onProperty ex:ownedBy ;
                    owl:minCardinality 1 ] .

ex:contains     a owl:ObjectProperty ; rdfs:domain ex:System ; rdfs:range ex:Service .
ex:calls        a owl:ObjectProperty ; rdfs:domain ex:Service ; rdfs:range ex:Service .
ex:dependsOn    a owl:ObjectProperty ; rdfs:domain ex:Service ; rdfs:range ex:TechnicalAsset .
ex:connectsTo   a owl:ObjectProperty ; rdfs:domain ex:Service ; rdfs:range ex:Database .
ex:ownedBy      a owl:ObjectProperty ; rdfs:domain ex:Service ; rdfs:range ex:Team .
ex:deployedIn   a owl:ObjectProperty ; rdfs:domain ex:Service ; rdfs:range ex:Environment .
ex:affects      a owl:ObjectProperty ; rdfs:domain ex:Incident ; rdfs:range ex:Service .
ex:resolvedBy   a owl:ObjectProperty ; rdfs:domain ex:Incident ; rdfs:range ex:Runbook .
ex:documentedBy a owl:ObjectProperty ; rdfs:domain ex:Service ; rdfs:range ex:Runbook .

ex:serviceId   a owl:DatatypeProperty ; rdfs:domain ex:Service ; rdfs:range xsd:string .
ex:serviceName a owl:DatatypeProperty ; rdfs:domain ex:Service ; rdfs:range xsd:string .
ex:status      a owl:DatatypeProperty ; rdfs:domain ex:Service ; rdfs:range xsd:string .
ex:severity    a owl:DatatypeProperty ; rdfs:domain ex:Incident ; rdfs:range xsd:string .

# ABox：具体实例（与第 2 章业务事实一致）
ex:OrderSystem     a ex:System ; ex:systemId "SYS-001" .
ex:OrderService    a ex:Service ; ex:serviceId "SVC-001" ; ex:serviceName "OrderService" .
ex:PaymentService  a ex:Service ; ex:serviceId "SVC-002" ; ex:serviceName "PaymentService" ;
                   ex:status "Running" ; ex:ownedBy ex:PaymentTeam ; ex:connectsTo ex:PaymentDB .
ex:PaymentDB       a ex:Database ; ex:dbType "PostgreSQL" .
ex:PaymentTeam     a ex:Team .
ex:Production      a ex:Environment ; ex:environmentName "Production" .
ex:Incident001     a ex:Incident ; ex:severity "P1" ; ex:affects ex:PaymentService .
ex:Runbook001      a ex:Runbook .
ex:OrderSystem     ex:contains ex:OrderService .
ex:OrderService    ex:calls ex:PaymentService .`,
  },
  {
    id: "shacl-core",
    title: "service-shapes.ttl：Service 数据约束",
    language: "turtle",
    scope: "面向 RDF 数据的 SHACL Core 校验形状；全局唯一性依赖 SHACL-SPARQL 扩展或应用层/数据库约束。",
    deps: "pyshacl（pip install pyshacl）或 Apache Jena shacl",
    version: "SHACL（W3C Recommendation）；SHACL-SPARQL 需验证器支持",
    note: "sh:in 约束枚举值；sh:minCount 约束必填；serviceId 的全局唯一性在 Neo4j 中另由唯一约束保证。",
    code: `@prefix ex:  <https://example.com/enterprise#> .
@prefix sh:  <http://www.w3.org/ns/shacl#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

ex:ServiceShape a sh:NodeShape ;
  sh:targetClass ex:Service ;
  sh:property [
    sh:path ex:serviceName ; sh:minCount 1 ; sh:maxCount 1 ; sh:datatype xsd:string ;
    sh:message "Service 必须有唯一的 serviceName" ;
  ] ;
  sh:property [
    sh:path ex:status ; sh:minCount 1 ; sh:maxCount 1 ;
    sh:in ( "Running" "Stopped" "Failed" ) ;
    sh:message "status 只能是 Running / Stopped / Failed" ;
  ] ;
  sh:property [
    sh:path ex:ownedBy ; sh:minCount 1 ; sh:maxCount 1 ; sh:class ex:Team ;
    sh:message "每个 Service 必须由一个 Team 负责" ;
  ] ;
  sh:property [
    sh:path ex:serviceId ; sh:minCount 1 ; sh:maxCount 1 ; sh:datatype xsd:string ;
    sh:pattern "^SVC-[0-9]{3}$" ;
  ] .

# SHACL-SPARQL 扩展：检查 serviceId 全局唯一（验证器需支持 SPARQL-based constraints）
ex:UniqueServiceIdShape a sh:NodeShape ;
  sh:targetClass ex:Service ;
  sh:sparql [
    sh:message "serviceId 必须全局唯一" ;
    sh:prefixes ex: ;
    sh:select """
      PREFIX ex: <https://example.com/enterprise#>
      SELECT $this ?other ?serviceId WHERE {
        $this ex:serviceId ?serviceId .
        ?other ex:serviceId ?serviceId .
        FILTER (?other != $this)
      }
    """ ;
  ] .

ex: a sh:PrefixDeclaration ;
  sh:namespace "https://example.com/enterprise#"^^xsd:anyURI .`,
  },
  {
    id: "extraction-json",
    title: "LLM 结构化抽取结果（最小示例）",
    language: "json",
    scope: "演示用最小结构；省略了来源、证据跨度、抽取器版本等生产必需字段。",
    deps: "无（数据契约示例）",
    version: "随 Extraction Schema 版本演进；建议显式携带 schema_version",
    note: "confidence 是模型抽取把握，不代表来源权威性，更不代表事实已被验证。",
    code: `{
  "entities": [
    {
      "name": "PaymentService",
      "type": "Service",
      "properties": {
        "serviceId": "SVC-002"
      },
      "confidence": 0.96
    }
  ],
  "relationships": [
    {
      "source": "PaymentService",
      "type": "CONNECTS_TO",
      "target": "PaymentDB",
      "confidence": 0.93,
      "evidence": "支付服务连接 PostgreSQL PaymentDB"
    }
  ]
}`,
  },
  {
    id: "extraction-production-json",
    title: "生产级抽取记录应补充的字段",
    language: "json",
    scope: "字段设计示意，非某个厂商的固定格式；具体字段应按企业审计与权限模型裁剪。",
    deps: "无（数据契约示例）",
    version: "与 extractor_version / schema_version 绑定，便于回放与回归",
    code: `{
  "fact_id": "FACT-2026-0001",
  "schema_version": "1.2.0",
  "source_document": "DOC-RUNBOOK-001.pdf",
  "chunk_id": "DOC-RUNBOOK-001.pdf#p3#c02",
  "evidence_span": { "start": 128, "end": 176, "text": "支付服务连接 PostgreSQL PaymentDB" },
  "extractor_version": "extract-svc@2.4.0",
  "observed_at": "2026-04-12T09:30:00Z",
  "confidence": 0.93,
  "source_authority": "cmdb-export",
  "security_groups": ["it-ops", "payment-team"],
  "review_state": "pending"
}`,
  },
  {
    id: "pydantic",
    title: "Pydantic 抽取模型：把 Ontology 变成类型白名单",
    language: "python",
    scope: "抽取层数据契约；只覆盖示例类型与关系，不含重试、批处理、审计与人工审核。",
    deps: "pydantic>=2.7, python>=3.10",
    version: "Pydantic v2 API（model_dump / field_validator）",
    note: "type 与 relationship type 使用 Enum 白名单，防止 LLM 输出未在本体中定义的类型。",
    code: `from enum import Enum
from typing import Literal
from pydantic import BaseModel, Field, field_validator

class EntityType(str, Enum):
    BUSINESS = "Business"
    SYSTEM = "System"
    SERVICE = "Service"
    DATABASE = "Database"
    TEAM = "Team"
    ENVIRONMENT = "Environment"
    INCIDENT = "Incident"
    RUNBOOK = "Runbook"
    DOCUMENT = "Document"

class RelationType(str, Enum):
    CONTAINS = "CONTAINS"
    CALLS = "CALLS"
    DEPENDS_ON = "DEPENDS_ON"
    CONNECTS_TO = "CONNECTS_TO"
    OWNED_BY = "OWNED_BY"
    DEPLOYED_IN = "DEPLOYED_IN"
    AFFECTS = "AFFECTS"
    RESOLVED_BY = "RESOLVED_BY"
    DOCUMENTED_BY = "DOCUMENTED_BY"

class Entity(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    type: EntityType
    properties: dict[str, str] = Field(default_factory=dict)
    confidence: float = Field(ge=0.0, le=1.0)

class Relationship(BaseModel):
    source: str
    type: RelationType
    target: str
    confidence: float = Field(ge=0.0, le=1.0)
    evidence: str = Field(min_length=8)

class ExtractionResult(BaseModel):
    entities: list[Entity] = Field(default_factory=list)
    relationships: list[Relationship] = Field(default_factory=list)
    schema_version: Literal["1.2.0"] = "1.2.0"

    @field_validator("relationships")
    @classmethod
    def reject_unknown_endpoints(cls, rels, info):
        # 关系端点必须在本批次实体中出现（跨 Chunk 关联在融合阶段处理）
        names = {e.name for e in info.data.get("entities", [])}
        for rel in rels:
            if rel.source not in names or rel.target not in names:
                raise ValueError(f"关系端点未在本批次实体中声明: {rel.source} -> {rel.target}")
        return rels`,
  },
  {
    id: "azure-openai-structured",
    title: "Azure OpenAI Structured Outputs 抽取",
    language: "python",
    scope: "单 Chunk 抽取调用；未实现批处理、重试、内容安全、成本控制与落库。",
    deps: "openai>=1.40, pydantic>=2.7, python-dotenv（可选）",
    version: "Azure OpenAI API 需选择支持 Structured Outputs 的版本与模型（如较新的 gpt-4o 系列）；部署名 = 模型部署，不是模型名",
    note: "Structured Outputs 保证输出符合 JSON Schema，不保证抽取内容真实。必须保留 chunk_id、evidence 与 source_document。",
    code: `import os
from openai import AzureOpenAI
from extraction_schema import ExtractionResult  # 上一示例中的 Pydantic 模型

client = AzureOpenAI(
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    api_key=os.environ["AZURE_OPENAI_API_KEY"],
    api_version=os.environ.get("AZURE_OPENAI_API_VERSION", "2024-10-21"),
)

SYSTEM_PROMPT = """你是企业 IT 知识抽取器。只输出给定文本中明确陈述的实体与关系。
禁止推测、禁止补全未出现的事实。每条关系必须附带原文证据短句。"""

def extract_chunk(chunk_id: str, text: str) -> dict:
    completion = client.beta.chat.completions.parse(
        model=os.environ["AZURE_OPENAI_DEPLOYMENT"],
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"chunk_id: {chunk_id}\n---\n{text}"},
        ],
        response_format=ExtractionResult,
        temperature=0,
    )
    message = completion.choices[0].message
    if message.refusal or message.parsed is None:
        raise RuntimeError("模型拒绝或结构化输出解析失败，进入失败队列")
    record = message.parsed.model_dump()
    record["chunk_id"] = chunk_id
    record["extractor_version"] = "extract-svc@2.4.0"
    return record`,
  },
  {
    id: "entity-resolution",
    title: "Entity Resolution：可解释的四因子打分",
    language: "python",
    scope: "示例评分函数：权重与阈值仅为初始假设，必须用标注数据校准；不含 Embedding 服务与人工审核队列。",
    deps: "python>=3.10（仅标准库 difflib / dataclasses）",
    version: "算法示意；替换为生产实现时应加入别名表、阻断策略（blocking）与审计日志",
    note: "0.90 以上自动合并、0.70~0.90 人工审核均为演示阈值，不是行业推荐值。",
    code: `from dataclasses import dataclass
from difflib import SequenceMatcher
from math import sqrt

# 示例权重：必须用真实标注数据校准
WEIGHTS = {"id": 0.40, "name": 0.25, "context": 0.20, "embedding": 0.15}
AUTO_MERGE, REVIEW = 0.90, 0.70

@dataclass
class Candidate:
    name: str
    entity_id: str
    aliases: tuple[str, ...]
    context_tokens: frozenset[str]
    embedding: tuple[float, ...]

def cosine(a, b):
    if not a or not b or len(a) != len(b):
        return 0.0
    dot = sum(x * y for x, y in zip(a, b))
    na, nb = sqrt(sum(x * x for x in a)), sqrt(sum(y * y for y in b))
    return dot / (na * nb) if na and nb else 0.0

def score(left: Candidate, right: Candidate) -> dict:
    id_sim = 1.0 if left.entity_id and left.entity_id == right.entity_id else 0.0
    names = [right.name, *right.aliases]
    name_sim = max(SequenceMatcher(None, left.name.lower(), n.lower()).ratio() for n in names)
    union = left.context_tokens | right.context_tokens
    ctx_sim = len(left.context_tokens & right.context_tokens) / len(union) if union else 0.0
    emb_sim = cosine(left.embedding, right.embedding)
    parts = {"id": id_sim, "name": name_sim, "context": ctx_sim, "embedding": emb_sim}
    total = sum(WEIGHTS[k] * v for k, v in parts.items())
    decision = "auto_merge" if total >= AUTO_MERGE else "human_review" if total >= REVIEW else "reject"
    return {"score": round(total, 4), "parts": parts, "decision": decision}

# 示例：SVC-002 / 支付服务 / PaymentService 判定
a = Candidate("PaymentService", "SVC-002", ("支付服务",), frozenset({"payment", "prod"}), (0.12, 0.88, 0.31))
b = Candidate("支付服务", "SVC-002", ("PaymentSvc",), frozenset({"payment", "prod"}), (0.11, 0.87, 0.33))
print(score(a, b))`,
  },
  {
    id: "neo4j-schema",
    title: "schema.cypher：唯一约束与索引",
    language: "cypher",
    scope: "Neo4j 5.x 语法；在空库初始化阶段执行，生产环境应纳入迁移脚本与版本控制。",
    deps: "Neo4j 5.x / neo4j-browser 或 cypher-shell",
    version: "CREATE CONSTRAINT ... IF NOT EXISTS FOR (n:Label) REQUIRE n.prop IS UNIQUE 为 Neo4j 5 语法；4.x 语法不同",
    note: "唯一键来自企业权威 ID（如 CMDB serviceId），不要只依赖名称。",
    code: `CREATE CONSTRAINT system_id IF NOT EXISTS FOR (n:System) REQUIRE n.systemId IS UNIQUE;
CREATE CONSTRAINT service_id IF NOT EXISTS FOR (n:Service) REQUIRE n.serviceId IS UNIQUE;
CREATE CONSTRAINT database_id IF NOT EXISTS FOR (n:Database) REQUIRE n.dbId IS UNIQUE;
CREATE CONSTRAINT team_id IF NOT EXISTS FOR (n:Team) REQUIRE n.teamId IS UNIQUE;
CREATE CONSTRAINT incident_id IF NOT EXISTS FOR (n:Incident) REQUIRE n.incidentId IS UNIQUE;
CREATE CONSTRAINT runbook_id IF NOT EXISTS FOR (n:Runbook) REQUIRE n.runbookId IS UNIQUE;
CREATE CONSTRAINT document_id IF NOT EXISTS FOR (n:Document) REQUIRE n.documentId IS UNIQUE;
CREATE CONSTRAINT chunk_id IF NOT EXISTS FOR (n:Chunk) REQUIRE n.chunkId IS UNIQUE;

CREATE INDEX service_name IF NOT EXISTS FOR (n:Service) ON (n.serviceName);
CREATE INDEX chunk_document IF NOT EXISTS FOR (n:Chunk) ON (n.documentId);
CREATE INDEX fact_observed IF NOT EXISTS FOR ()-[r:CONNECTS_TO]-() ON (r.observedAt);`,
  },
  {
    id: "neo4j-seed",
    title: "seed-data.cypher：MERGE 节点与关系",
    language: "cypher",
    scope: "第 2 章 7 条示例业务事实的写入片段；省略 Provenance、有效期与审计字段。",
    deps: "在 schema.cypher 之后执行",
    version: "Neo4j 5.x；参数化写法适用于 driver 调用，浏览器执行时可替换 $ 参数",
    code: `// 1) 节点：以权威 ID 作为 MERGE 键
MERGE (orderSys:System {systemId: $sys1}) SET orderSys.name = 'OrderSystem';
MERGE (orderSvc:Service {serviceId: $svc1}) SET orderSvc.serviceName = 'OrderService', orderSvc.status = 'Running';
MERGE (paySvc:Service {serviceId: $svc2}) SET paySvc.serviceName = 'PaymentService', paySvc.status = 'Running';
MERGE (payDb:Database {dbId: $db1}) SET payDb.dbType = 'PostgreSQL', payDb.name = 'PaymentDB';
MERGE (payTeam:Team {teamId: $team1}) SET payTeam.name = 'PaymentTeam';
MERGE (prod:Environment {name: 'Production'});
MERGE (inc:Incident {incidentId: 'INC-001'}) SET inc.severity = 'P1';
MERGE (run:Runbook {runbookId: 'RB-001'}) SET run.title = '支付服务故障处理手册';

// 2) 关系：方向统一为“主语 -> 宾语”
MATCH (s:System {systemId: $sys1}), (v:Service {serviceId: $svc1})
MERGE (s)-[r:CONTAINS]->(v) SET r.source = 'cmdb';
MATCH (a:Service {serviceId: $svc1}), (b:Service {serviceId: $svc2}) MERGE (a)-[:CALLS]->(b);
MATCH (v:Service {serviceId: $svc2}), (d:Database {dbId: $db1}) MERGE (v)-[:CONNECTS_TO]->(d);
MATCH (v:Service {serviceId: $svc2}), (t:Team {teamId: $team1}) MERGE (v)-[:OWNED_BY]->(t);
MATCH (v:Service {serviceId: $svc2}), (e:Environment {name: 'Production'}) MERGE (v)-[:DEPLOYED_IN]->(e);
MATCH (i:Incident {incidentId: 'INC-001'}), (v:Service {serviceId: $svc2}) MERGE (i)-[:AFFECTS]->(v);
MATCH (v:Service {serviceId: $svc2}), (r:Runbook {runbookId: 'RB-001'}) MERGE (v)-[:DOCUMENTED_BY]->(r);`,
  },
  {
    id: "cypher-queries",
    title: "queries.cypher：调用链、影响范围、团队、Runbook 与多跳",
    language: "cypher",
    scope: "只读查询集合；实际生产应通过参数化查询、只读账号与查询超时/深度限制调用。",
    deps: "Neo4j 5.x",
    version: "变长模式 *1..3 在 Neo4j 5 可用；更深的遍历建议使用 APOC 或应用层 BFS 并限制分支",
    code: `// 1) 服务调用链：谁调用了 PaymentService
MATCH (caller:Service)-[:CALLS]->(target:Service {serviceId: $serviceId})
RETURN caller.serviceName AS caller, target.serviceName AS target;

// 2) 反向影响范围：哪些系统依赖受影响的服务（1..2 跳）
MATCH path = (upstream)-[:CALLS|CONTAINS*1..2]->(svc:Service {serviceId: $serviceId})
RETURN [n IN nodes(path) | coalesce(n.name, n.serviceName, n.systemId)] AS chain,
       length(path) AS hops
ORDER BY hops;

// 3) 故障涉及的负责团队
MATCH (i:Incident {incidentId: $incidentId})-[:AFFECTS]->(s:Service)-[:OWNED_BY]->(t:Team)
RETURN DISTINCT t.name AS team, s.serviceName AS service;

// 4) 相关 Runbook（服务文档 + 事件处置手册两条路径）
MATCH (s:Service {serviceId: $serviceId})-[:DOCUMENTED_BY]->(r:Runbook)
RETURN r.runbookId AS runbook, r.title AS title, 'service' AS via
UNION
MATCH (i:Incident)-[:AFFECTS]->(s:Service {serviceId: $serviceId}), (i)-[:RESOLVED_BY]->(r:Runbook)
RETURN r.runbookId AS runbook, r.title AS title, 'incident' AS via;

// 5) 多跳路径：从故障事件到业务系统（限制 1..3 跳与关系白名单）
MATCH path = (i:Incident {incidentId: $incidentId})-[:AFFECTS|CALLS|CONTAINS*1..3]->(biz)
WHERE biz:Business OR biz:System
RETURN [n IN nodes(path) | labels(n)[0] + ':' + coalesce(n.name, n.serviceName, '?')] AS path_labels,
       [r IN relationships(path) | type(r)] AS relation_types,
       length(path) AS hops;

// 6) 带 ACL 的图遍历（安全过滤下推到图查询阶段）
MATCH (s:Service {serviceId: $serviceId})-[:OWNED_BY]->(t:Team)
WHERE s.securityGroups IS NULL OR any(g IN s.securityGroups WHERE g IN $allowedGroups)
RETURN s.serviceName AS service, t.name AS owner;`,
  },
  {
    id: "cypher-write",
    title: "更新与删除策略：软删除、时态字段与 DETACH DELETE",
    language: "cypher",
    scope: "策略示例；真实删除应结合法规、审计与下游索引同步任务。",
    deps: "Neo4j 5.x",
    version: "属性可空；validTo 由应用层写入，Neo4j 不会自动维护时态",
    code: `// 关系失效：优先软删除（保留历史用于审计与时态查询）
MATCH (v:Service {serviceId: $serviceId})-[r:CONNECTS_TO]->(d:Database {dbId: $dbId})
SET r.validTo = datetime(), r.state = 'superseded', r.changeTicket = $ticket;

// 写入新事实（带来源与有效期）
MATCH (v:Service {serviceId: $serviceId}), (d:Database {dbId: $newDbId})
MERGE (v)-[r:CONNECTS_TO {validFrom: datetime()}]->(d)
SET r.source = $sourceDocument, r.confidence = $confidence, r.state = 'active';

// 物理删除：仅针对确需清除的测试数据 / 合规删除任务
MATCH (n:Chunk {chunkId: $chunkId}) DETACH DELETE n;`,
  },
  {
    id: "neo4j-driver",
    title: "Neo4j Python Driver：只读、参数化、限制深度",
    language: "python",
    scope: "图检索函数；不含连接池调优、重试策略与权限上下文注入实现。",
    deps: "neo4j>=5.20, python>=3.10",
    version: "neo4j Python Driver 5.x（execute_read / driver.session）；4.x API 不同",
    note: "使用只读事务与参数化查询；绝对不要把 LLM 生成的 Cypher 直接执行。",
    code: `from neo4j import GraphDatabase

driver = GraphDatabase.driver(
    os.environ["NEO4J_URI"],
    auth=(os.environ["NEO4J_USER"], os.environ["NEO4J_PASSWORD"]),
)

GRAPH_QUERY = """
MATCH path = (s:Service {serviceId: $serviceId})<-[:AFFECTS|CALLS|CONTAINS*1..2]-(n)
WHERE all(node IN nodes(path) WHERE node.securityGroups IS NULL
          OR any(g IN node.securityGroups WHERE g IN $allowed_groups))
RETURN DISTINCT labels(n) AS labels,
       coalesce(n.name, n.serviceName, n.systemId, n.incidentId) AS name,
       [r IN relationships(path) | type(r)] AS relations,
       length(path) AS hops
ORDER BY hops LIMIT $limit
"""

def graph_retrieve(service_id: str, allowed_groups: list[str], limit: int = 30) -> list[dict]:
    def work(tx):
        result = tx.run(GRAPH_QUERY, service_id=service_id, allowed_groups=allowed_groups, limit=limit)
        return [dict(row) for row in result]
    with driver.session(database=os.environ.get("NEO4J_DATABASE", "neo4j")) as session:
        return session.execute_read(work)`,
  },
  {
    id: "search-index",
    title: "Azure AI Search：Chunk Index Schema（节选）",
    language: "json",
    scope: "索引定义示例；省略分片/副本、加密、私有网络、技能集与内容安全配置。",
    deps: "Azure AI Search（支持向量与 Semantic Ranker 的服务层级）",
    version: "REST api-version 随服务演进而变化（示例按 2024-07-01 之后的字段结构）；dimensions 必须与 Embedding 模型一致",
    note: "content_vector 的维度要与所选 text-embedding 部署一致；security_groups 为 filterable 集合用于 ACL 下推。",
    code: `{
  "name": "enterprise-chunks",
  "fields": [
    { "name": "id", "type": "Edm.String", "key": true, "filterable": true },
    { "name": "document_id", "type": "Edm.String", "filterable": true },
    { "name": "chunk_id", "type": "Edm.String", "filterable": true },
    { "name": "title", "type": "Edm.String", "searchable": true, "retrievable": true },
    { "name": "content", "type": "Edm.String", "searchable": true, "retrievable": true },
    { "name": "content_vector", "type": "Collection(Edm.Single)", "searchable": true,
      "retrievable": false, "dimensions": 1536, "vectorSearchProfile": "vector-profile" },
    { "name": "entity_ids", "type": "Collection(Edm.String)", "filterable": true },
    { "name": "source", "type": "Edm.String", "filterable": true, "facetable": true },
    { "name": "page_number", "type": "Edm.Int32", "filterable": true, "retrievable": true },
    { "name": "security_groups", "type": "Collection(Edm.String)", "filterable": true },
    { "name": "updated_at", "type": "Edm.DateTimeOffset", "filterable": true, "sortable": true }
  ],
  "vectorSearch": {
    "algorithms": [{ "name": "hnsw", "kind": "hnsw", "hnswParameters": { "m": 4, "efConstruction": 400 } }],
    "profiles": [{ "name": "vector-profile", "algorithm": "hnsw" }]
  },
  "semantic": {
    "configurations": [{
      "name": "semantic-config",
      "prioritizedFields": {
        "titleField": { "fieldName": "title" },
        "prioritizedContentFields": [{ "fieldName": "content" }]
      }
    }]
  }
}`,
  },
  {
    id: "hybrid-search",
    title: "Hybrid Search：Keyword + Vector + Semantic Ranker + ACL Filter",
    language: "python",
    scope: "单次混合检索；未包含多轮改写、结果去重、跨索引扇出与配额重试。",
    deps: "azure-search-documents>=11.6, azure-core, openai>=1.40",
    version: "SDK/REST API 版本敏感：Hybrid + RRF 与 Semantic Ranker 的行为在不同 api-version 下可能不同，请以官方文档验证",
    note: "filter 中下推 security_groups 是关键：权限过滤必须在检索阶段完成，而不是在前端隐藏。",
    code: `import os
from openai import AzureOpenAI
from azure.core.credentials import AzureKeyCredential
from azure.search.documents import SearchClient
from azure.search.documents.models import VectorizedQuery

aoai = AzureOpenAI(
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    api_key=os.environ["AZURE_OPENAI_API_KEY"],
    api_version=os.environ.get("AZURE_OPENAI_API_VERSION", "2024-10-21"),
)
search = SearchClient(
    endpoint=os.environ["AZURE_SEARCH_ENDPOINT"],
    index_name="enterprise-chunks",
    credential=AzureKeyCredential(os.environ["AZURE_SEARCH_ADMIN_KEY"]),
)

def embed(text: str) -> list[float]:
    resp = aoai.embeddings.create(model=os.environ["AZURE_OPENAI_EMBED_DEPLOYMENT"], input=text)
    return resp.data[0].embedding

def hybrid_search(question: str, allowed_groups: list[str], top: int = 8) -> list[dict]:
    acl = " or ".join(f"security_groups/any(g: g eq '{g}')" for g in allowed_groups)
    vector_query = VectorizedQuery(
        vector=embed(question), kNearestNeighborsCount=30, fields="content_vector"
    )
    results = search.search(
        search_text=question,
        vector_queries=[vector_query],
        filter=acl,
        query_type="semantic",
        semantic_configuration_name="semantic-config",
        select=["id", "chunk_id", "document_id", "title", "content", "page_number", "entity_ids", "source"],
        top=top,
    )
    return [dict(r) for r in results]`,
  },
  {
    id: "graph-retrieval",
    title: "Graph Retrieval：从问题实体扩展到图事实",
    language: "python",
    scope: "图检索编排片段；Entity Linking 与结果打分需单独实现。",
    deps: "neo4j>=5.20（配合上一示例的 driver）",
    version: "Neo4j 5.x；路径深度上限由查询内 *1..2 明确固定",
    note: "返回的每条事实都带 fact_id，供答案引用与证据校验使用。",
    code: `GRAPH_FACTS = """
MATCH (s:Service {serviceId: $serviceId})
OPTIONAL MATCH (s)-[r1:CONNECTS_TO]->(db:Database)
OPTIONAL MATCH (s)-[r2:OWNED_BY]->(t:Team)
OPTIONAL MATCH (s)-[r3:DEPLOYED_IN]->(env:Environment)
OPTIONAL MATCH (upstream)-[r4:CALLS]->(s)
OPTIONAL MATCH (s)-[r5:DOCUMENTED_BY]->(rb:Runbook)
RETURN s.serviceName AS subject, 'CONNECTS_TO' AS predicate, db.name AS object,
       elementId(r1) AS fact_id, r1.source AS source
UNION ALL
RETURN s.serviceName AS subject, 'OWNED_BY' AS predicate, t.name AS object,
       elementId(r2) AS fact_id, r2.source AS source
"""

def retrieve_graph_facts(service_id: str) -> list[dict]:
    with driver.session(database="neo4j") as session:
        rows = session.execute_read(lambda tx: [dict(r) for r in tx.run(GRAPH_FACTS, serviceId=service_id)])
    return [r for r in rows if r.get("fact_id") and r.get("object")]`,
  },
  {
    id: "answer-generation",
    title: "Answer Generation：证据约束、引用与忠实度校验",
    language: "python",
    scope: "生成与后处理示意；不含内容安全、流式输出、多轮会话与审计持久化。",
    deps: "openai>=1.40, pydantic>=2.7",
    version: "Structured Outputs / json_object 支持随模型与 API 版本变化；不确定时改用普通 JSON + Pydantic 校验",
    note: "输出后必须校验每个 citation_id 都来自本轮允许的证据集合，否则丢弃引用或拒答。",
    code: `from pydantic import BaseModel, Field
from openai import AzureOpenAI

class AnswerWithCitations(BaseModel):
    answer: str
    citation_ids: list[str] = Field(default_factory=list)
    abstained: bool = False

SYSTEM = """你只能依据 <evidence> 中的事实作答。每条结论都要带引用 ID。
evidence 未覆盖的内容必须说明“资料未覆盖”，不得推测。若证据互相冲突，指出冲突来源。"""

def generate_answer(question: str, evidence: list[dict]) -> dict:
    allowed = {e["id"] for e in evidence}
    block = "\n".join(
        f"[{e['id']}] ({e['kind']}) {e['text']} | source={e['source']}" for e in evidence
    )
    completion = client.beta.chat.completions.parse(
        model=os.environ["AZURE_OPENAI_DEPLOYMENT"],
        messages=[
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": f"<evidence>\n{block}\n</evidence>\n\n问题：{question}"},
        ],
        response_format=AnswerWithCitations,
        temperature=0,
    )
    result = completion.choices[0].message.parsed.model_dump()
    # 证据校验：禁止引用本轮未授权/不存在的证据
    result["citation_ids"] = [c for c in result["citation_ids"] if c in allowed]
    if not result["citation_ids"] and not result["abstained"]:
        result["answer"] = "当前可用证据不足，无法给出有依据的回答。"
        result["abstained"] = True
    result["evidence_count"] = len(evidence)
    return result`,
  },
  {
    id: "fastapi",
    title: "FastAPI GraphRAG Orchestrator（简化版）",
    language: "python",
    scope: "编排骨架：省略认证中间件、限流、超时、审计、可观测性与错误隔离。",
    deps: "fastapi>=0.110, uvicorn, pydantic>=2.7, neo4j, azure-search-documents, openai",
    version: "FastAPI 0.110+ / Pydantic v2；具体 Azure SDK 版本见各示例说明",
    note: "真实系统应由认证中间件注入 allowed_groups，禁止信任客户端传入的权限声明。",
    code: `from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="Enterprise GraphRAG API")

class QueryRequest(BaseModel):
    question: str = Field(min_length=4, max_length=500)

class Principal(BaseModel):
    user_id: str
    allowed_groups: list[str]

def current_principal() -> Principal:
    raise NotImplementedError("由 Entra ID / OIDC 校验后注入真实身份，示例不实现认证")

@app.post("/v1/answers")
def answer(req: QueryRequest, principal: Principal = Depends(current_principal)):
    # 1) Query Understanding + Entity Linking（示例固定解析到 PaymentService）
    entity_ids = link_entities(req.question)  # 生产实现：别名表 + 向量候选 + 规则
    if not entity_ids:
        raise HTTPException(status_code=422, detail="未能定位问题中的实体")

    # 2) 三路检索，全部下推 ACL
    graph_facts = retrieve_graph_facts(entity_ids[0])
    docs = hybrid_search(req.question, principal.allowed_groups)
    keyword_hits = keyword_search(req.question, principal.allowed_groups)

    # 3) Context Fusion：去重、裁剪、绑定证据 ID、二次 ACL 校验
    evidence = fuse_context(graph_facts, docs, keyword_hits, principal.allowed_groups)
    if not evidence:
        return {"answer": "当前权限范围内的资料不足以回答该问题。", "citations": []}

    # 4) 生成 + 引用校验 + 审计
    result = generate_answer(req.question, evidence)
    audit_log(principal.user_id, req.question, result)
    return {
        "answer": result["answer"],
        "citations": [e for e in evidence if e["id"] in result["citation_ids"]],
        "abstained": result["abstained"],
        "mode": "hybrid-graph-rag",
    }`,
  },
  {
    id: "shacl-validate",
    title: "pyshacl 校验：把 Shape 接入 Pipeline",
    language: "python",
    scope: "RDF 图校验片段；属性图（Neo4j）需另行实现等价校验或先映射为 RDF。",
    deps: "pyshacl>=0.25, rdflib>=7.0",
    version: "pyshacl / rdflib API 以安装包版本为准",
    code: `from rdflib import Graph
from pyshacl import validate

data = Graph().parse("output/abox.ttl", format="turtle")
shapes = Graph().parse("ontology/service-shapes.ttl", format="turtle")
conforms, report_graph, report_text = validate(
    data, shacl_graph=shapes, inference="rdfs", abort_on_first=False
)
if not conforms:
    raise ValueError("SHACL 校验未通过，禁止写入生产图谱: " + report_text)`,
  },
  {
    id: "project-tree",
    title: "enterprise-knowledge-platform/ 建议项目结构",
    language: "text",
    scope: "建议的目录划分，不是脚手架自动生成结果；团队应按现有平台规范调整。",
    deps: "无",
    version: "与具体框架版本无关",
    code: `enterprise-knowledge-platform/
  frontend/                     # Web UI / Enterprise Copilot
  backend/
    api/                        # FastAPI 路由、认证中间件、DTO
    ingestion/                  # 文档解析、Chunk 切分、增量检测
    extraction/                 # LLM 抽取、Pydantic Schema、Prompt 版本
    ontology/                   # OWL/SHACL 加载、映射、校验
    entity_resolution/          # 候选生成、打分、人工审核队列
    graph/                      # Neo4j Driver、Cypher、写入策略
    search/                     # Azure AI Search Index 与检索
    retrieval/                  # 意图识别、混合检索、Context Fusion
    evaluation/                 # 评估数据集、指标计算、回归报告
  ontology/
    enterprise.owl
    service-shapes.ttl
  cypher/
    schema.cypher
    seed-data.cypher
    queries.cypher
  configs/
  tests/
  docker/
  docs/`,
  },
  {
    id: "env-config",
    title: "配置示例：环境变量（不含任何真实凭证）",
    language: "bash",
    scope: "本地开发配置模板；生产应使用托管身份 / Key Vault，不要把密钥写入 .env 或代码库。",
    deps: "Azure OpenAI、Azure AI Search、Neo4j 服务实例",
    version: "API 版本与部署名需与实际资源一致",
    code: `# .env.example —— 仅用于本地开发，禁止提交真实密钥
export AZURE_OPENAI_ENDPOINT="https://<resource>.openai.azure.com/"
export AZURE_OPENAI_API_KEY="<from-key-vault>"
export AZURE_OPENAI_API_VERSION="2024-10-21"
export AZURE_OPENAI_DEPLOYMENT="gpt-4o-deploy"
export AZURE_OPENAI_EMBED_DEPLOYMENT="text-embedding-3-small-deploy"
export AZURE_SEARCH_ENDPOINT="https://<service>.search.windows.net"
export AZURE_SEARCH_ADMIN_KEY="<from-key-vault>"
export NEO4J_URI="neo4j+s://<host>"
export NEO4J_USER="neo4j"
export NEO4J_PASSWORD="<from-key-vault>"
export NEO4J_DATABASE="neo4j"`,
  },
];

export const codeById = Object.fromEntries(codeSamples.map((s) => [s.id, s])) as Record<string, CodeSample>;
