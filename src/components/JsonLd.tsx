import { getPublicSiteUrl } from "@/data/siteMeta";

export default function JsonLd() {
  const url = getPublicSiteUrl();
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${url}/#person`,
        name: "Issac Sunny",
        url,
        jobTitle: "AI Engineer & Researcher",
        sameAs: ["https://www.linkedin.com/in/issac-sunny/"],
        knowsAbout: [
          "Machine learning",
          "Insider threat detection",
          "Transformer models",
          "Salesforce development",
          "Full-stack engineering",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: "Issac Sunny — Portfolio",
        publisher: { "@id": `${url}/#person` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
