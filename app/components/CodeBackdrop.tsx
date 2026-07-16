/**
 * Едва заметный декоративный код на фоне тёмных секций — «хакерский» ритм.
 * Реальный текст (не SVG), моно, очень низкая непрозрачность, не мешает чтению,
 * не перехватывает клики. aria-hidden. Опирается на позиционированного родителя.
 */

const SNIPPET = [
  "async def start(update, ctx):",
  "    secret = random.randint(1, 100)",
  "    await update.message.reply_text(\"Привет!\")",
  "",
  "const App = () => {",
  "  const [count, setCount] = useState(0);",
  "  return <button onClick={inc}>{count}</button>;",
  "};",
  "",
  "if guess < secret:",
  "    print(\"Больше!\")",
  "elif guess > secret:",
  "    print(\"Меньше!\")",
  "",
  "$ docker build -t alfaz .",
  "$ git commit -m \"ship it\"",
  "$ flutter run --release",
  "SELECT id, name FROM students;",
];

export default function CodeBackdrop({ className = "" }: { className?: string }) {
  const block = Array.from({ length: 6 }, () => SNIPPET.join("\n")).join("\n");
  return (
    <pre
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none whitespace-pre font-mono text-[13px] leading-6 text-accent/[0.06] p-6 ${className}`}
    >
      {block}
    </pre>
  );
}
