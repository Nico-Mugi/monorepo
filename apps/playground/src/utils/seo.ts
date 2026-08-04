export function seo({
  title,
  description,
  image,
  url,
  site_name,
}: {
  title: string;
  description: string;
  image?: string;
  url?: string;
  site_name?: string;
}) {
  const tags = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    ...(image ? [{ property: "og:image", content: image }] : []),
    ...(url ? [{ property: "og:url", content: url }] : []),
    ...(site_name ? [{ property: "og:site_name", content: site_name }] : []),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    ...(image ? [{ name: "twitter:image", content: image }] : []),
  ];
  return tags;
}
