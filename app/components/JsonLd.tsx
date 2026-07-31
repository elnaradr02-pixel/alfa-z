/**
 * Вставляет JSON-LD разметку Schema.org в страницу.
 * Работает и в серверных, и в клиентских компонентах — это просто <script>.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const json = Array.isArray(data) ? data : [data];
  return (
    <>
      {json.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
    </>
  );
}
