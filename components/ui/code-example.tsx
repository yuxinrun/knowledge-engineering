import { Badge } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/code-block";
import { codeById } from "@/data/code";

export function CodeExample({ id, title, height }: { id: string; title?: string; height?: string }) {
  const sample = codeById[id];
  if (!sample) return <div className="my-4 rounded-xl border border-rose-300 p-4 text-sm text-rose-600">缺少代码示例：{id}</div>;
  return (
    <div>
      <CodeBlock
        id={`code-${sample.id}`}
        title={title ?? sample.title}
        language={sample.language}
        code={sample.code}
        scope={sample.scope}
        note={sample.note}
        maxHeight={height}
      />
      <div className="-mt-2 mb-5 flex flex-wrap items-center gap-2 text-[11px] text-muted">
        <Badge tone="blue">依赖</Badge>
        <span>{sample.deps}</span>
        <span className="text-line">·</span>
        <Badge tone="purple">版本 / 配置</Badge>
        <span>{sample.version}</span>
      </div>
    </div>
  );
}
