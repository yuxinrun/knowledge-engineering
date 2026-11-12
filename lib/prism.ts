import Prism from "prismjs";
import type { Grammar } from "prismjs";

/**
 * 轻量自定义语法定义：避免依赖 prismjs 的全局组件脚本，保证 Next.js SSR / 客户端一致。
 * 覆盖本白皮书示例所用语言：JSON、Python、TypeScript、Bash、Cypher、Turtle、SQL、YAML。
 */
const stringToken = /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/;

Prism.languages.json = {
  property: { pattern: /"(?:\\.|[^"\\])*"(?=\s*:)/, alias: "key" },
  string: stringToken,
  number: /-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/,
  boolean: /\b(?:true|false)\b/,
  null: /\bnull\b/,
  punctuation: /[{}[\],:]/,
};

Prism.languages.python = {
  comment: { pattern: /#.*/, greedy: true },
  "triple-string": { pattern: /"""[\s\S]*?"""|'''[\s\S]*?'''/, alias: "string" },
  string: { pattern: /[rbfu]{0,2}(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/, greedy: true },
  decorator: { pattern: /@[\w.]+/, alias: "function" },
  keyword: /\b(?:and|as|assert|async|await|break|class|continue|def|del|elif|else|except|False|finally|for|from|global|if|import|in|is|lambda|None|nonlocal|not|or|pass|raise|return|True|try|while|with|yield|match|case)\b/,
  builtin: /\b(?:print|len|range|dict|list|set|str|int|float|bool|self|super|enumerate|Any|Optional)\b/,
  "class-name": { pattern: /(?:\bclass\s+|:\s*)\w+(?=\s*[(:])/, lookbehind: false },
  function: /\b[A-Za-z_]\w*(?=\s*\()/,
  number: /\b\d+(?:\.\d+)?\b/,
  operator: /[=+\-*/%<>!&|^~]+|=>/,
  punctuation: /[{}[\];(),.:]/,
};

Prism.languages.typescript = {
  comment: { pattern: /\/\/.*|\/\*[\s\S]*?\*\//, greedy: true },
  string: { pattern: /`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/, greedy: true },
  keyword: /\b(?:const|let|var|function|return|if|else|for|while|import|from|export|default|async|await|new|class|extends|type|interface|as|in|of|try|catch|throw|null|undefined|true|false|public|private|readonly)\b/,
  "class-name": /\b[A-Z]\w*(?=\s*[<(])/,
  function: /\b[A-Za-z_$][\w$]*(?=\s*\()/,
  number: /\b\d+(?:\.\d+)?\b/,
  operator: /[=+\-*/%<>!?&|]+/,
  punctuation: /[{}[\];(),.:]/,
};

Prism.languages.bash = {
  comment: { pattern: /#.*/, greedy: true },
  string: stringToken,
  variable: /\$\{?[A-Za-z_][\w]*\}?/,
  keyword: /\b(?:cd|echo|export|pip|python|npm|npx|docker|curl|if|then|fi|for|do|done|set|source)\b/,
  number: /\b\d+\b/,
  operator: /[|&><=]+/,
  punctuation: /[{}[\];(),.]/,
};

Prism.languages.cypher = {
  comment: { pattern: /\/\/.*/, greedy: true },
  string: stringToken,
  keyword: /\b(?:MATCH|OPTIONAL|WHERE|RETURN|WITH|MERGE|CREATE|SET|DELETE|DETACH|REMOVE|ON|ORDER|BY|LIMIT|SKIP|UNWIND|CALL|YIELD|AS|DISTINCT|AND|OR|NOT|XOR|IN|STARTS|ENDS|CONTAINS|UNIQUE|CONSTRAINT|INDEX|FOR|REQUIRE|IS|NODE|RELATIONSHIP|EXISTS|COUNT|COLLECT|ALL|ANY|NONE|TRUE|FALSE|NULL|USING|PERIODIC|COMMIT|LOAD|CSV|DROP|IF)\b/i,
  label: { pattern: /:[A-Za-z_][\w]*/, alias: "class-name" },
  parameter: { pattern: /\$[A-Za-z_][\w]*/, alias: "variable" },
  function: /\b[A-Za-z_][\w]*(?=\s*\()/,
  number: /\b\d+(?:\.\d+)?\b/,
  operator: /[-=<>|+*]+|->|<-/,
  punctuation: /[{}[\];(),.:]/,
};

Prism.languages.turtle = {
  comment: { pattern: /#.*/, greedy: true },
  string: { pattern: /"""[\s\S]*?"""|"(?:\\.|[^"\\])*"(?:@[a-zA-Z-]+)?/, greedy: true, alias: "string" },
  iri: { pattern: /<[^>\s]*>/, alias: "regex" },
  prefix: { pattern: /@prefix|@base|\bPREFIX\b|\bBASE\b|[A-Za-z][\w-]*:/, alias: "prefix" },
  keyword: /\b(?:a|owl:Class|owl:ObjectProperty|owl:DatatypeProperty|rdfs:subClassOf|rdfs:domain|rdfs:range|rdfs:label|sh:NodeShape|sh:PropertyShape|sh:path|sh:minCount|sh:maxCount|sh:datatype|sh:in|sh:targetClass|xsd:string|xsd:integer|xsd:dateTime|true|false)\b/,
  number: /\b\d+(?:\.\d+)?\b/,
  punctuation: /[;,.\[\]()]/,
};

Prism.languages.sql = {
  comment: { pattern: /--.*|\/\*[\s\S]*?\*\//, greedy: true },
  string: stringToken,
  keyword: /\b(?:SELECT|FROM|WHERE|CREATE|INDEX|CONSTRAINT|DROP|INSERT|UPDATE|DELETE|JOIN|ON|AS|AND|OR|NOT|NULL|LIMIT|ORDER|BY|GROUP|WITH|RETURN)\b/i,
  number: /\b\d+\b/,
  punctuation: /[(),.;*]/,
};

Prism.languages.yaml = {
  comment: { pattern: /#.*/, greedy: true },
  key: { pattern: /^\s*[\w.-]+(?=\s*:)/m, alias: "property" },
  string: stringToken,
  number: /\b\d+(?:\.\d+)?\b/,
  boolean: /\b(?:true|false)\b/,
  punctuation: /[:{}[\],-]/,
};

export type CodeLanguage = "json" | "python" | "typescript" | "bash" | "cypher" | "turtle" | "sql" | "yaml" | "text";

export const languageLabels: Record<string, string> = {
  json: "JSON",
  python: "Python",
  typescript: "TypeScript",
  bash: "Bash",
  cypher: "Cypher",
  turtle: "Turtle / OWL",
  sql: "SQL",
  yaml: "YAML",
  text: "Text",
};

export function highlightCode(code: string, language: string): string {
  const grammar: Grammar = Prism.languages[language] ?? Prism.languages.plain ?? {};
  try {
    return Prism.highlight(code, grammar, language);
  } catch {
    return code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}
