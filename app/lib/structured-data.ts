/**
 * Разметка Schema.org (JSON-LD) для расширенных сниппетов Google.
 * Тексты — на русском (основной язык индексации). Меняете данные школы —
 * правите здесь в одном месте.
 */

export const SITE_URL = "https://alfa-z.kz";

const ORG_ID = `${SITE_URL}/#organization`;

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": ORG_ID,
  name: "Alfa Z",
  legalName: "ТОО «Alfa Z»",
  alternateName: "Alfa Z — школа программирования",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  description:
    "Онлайн-школа программирования для подростков 12–17 лет: живые занятия с ментором, программа на базе Гарвардского CS50, мобильная разработка, геймдев, фронтенд и бэкенд.",
  email: "info@alfa-z.kz",
  telephone: "+77007240353",
  foundingDate: "2026",
  areaServed: { "@type": "Country", name: "Kazakhstan" },
  address: {
    "@type": "PostalAddress",
    addressCountry: "KZ",
    addressLocality: "Астана",
    streetAddress: "район Есиль, ул. Алматы, здание 1",
    postalCode: "010000",
  },
  sameAs: [
    "https://instagram.com/alfaz.school",
    "https://t.me/alfaz_school",
    "https://wa.me/77007240353",
  ],
};

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Alfa Z",
  inLanguage: ["ru", "kk", "en"],
  publisher: { "@id": ORG_ID },
};

export function courseLd(opts: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: opts.name,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    inLanguage: ["ru", "kk", "en"],
    provider: {
      "@type": "EducationalOrganization",
      "@id": ORG_ID,
      name: "Alfa Z",
      url: SITE_URL,
    },
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      audienceType: "Подростки 12–17 лет",
    },
    offers: {
      "@type": "Offer",
      category: "Subscription",
      price: "47500",
      priceCurrency: "KZT",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}${opts.path}`,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "PT2H",
    },
  };
}

export function breadcrumbLd(courseName: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Курсы", item: `${SITE_URL}/#courses` },
      { "@type": "ListItem", position: 3, name: courseName, item: `${SITE_URL}${path}` },
    ],
  };
}

/** FAQ для главной — рич-сниппет «вопросы-ответы» в выдаче Google. */
export const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      q: "Сколько стоит обучение в Alfa Z?",
      a: "Единая цена — 47 500 ₸ в месяц, оплата помесячно, без скрытых доплат. В цену входит всё: 2 живых занятия в неделю по 1 часу с ментором, записанные материалы, обратная связь после каждого урока и отчёты о прогрессе каждые 3 недели. Доступна рассрочка Kaspi Red 0% на 3 или 6 месяцев.",
    },
    {
      q: "Для какого возраста подходят курсы?",
      a: "Курсы Alfa Z рассчитаны на подростков 12–17 лет. Начинаем с нуля и доводим до уровня junior — предварительный опыт в программировании не нужен.",
    },
    {
      q: "Когда стартует обучение и какое расписание?",
      a: "Никакого потока — занятия начинаются сразу после оплаты абонемента, ребёнок идёт в удобном темпе. Живые занятия с ментором 2 раза в неделю по 1 часу, дни и время подбираем под ребёнка: утром, днём или вечером.",
    },
    {
      q: "Как проходят занятия — записи или живые?",
      a: "И то, и другое: записанные материалы для самостоятельного прохождения плюс 2 живых занятия в неделю по 1 часу с ментором в Discord. Ментор доводит каждого ученика до результата и на связи 24/7.",
    },
    {
      q: "Какие направления есть в школе?",
      a: "5 направлений: Гарвардский курс CS50, веб-разработка (React), мобильная разработка (Flutter), геймдев (Unity) и бэкенд на Python. Каждый курс завершается реальным проектом в портфолио.",
    },
    {
      q: "Безопасно ли онлайн-обучение для ребёнка?",
      a: "Все менторы проходят отбор и подписывают договор о работе с детьми. На занятиях всегда включена камера у всех участников, а родитель получает отчёты о прогрессе каждые 3 недели.",
    },
  ].map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};
