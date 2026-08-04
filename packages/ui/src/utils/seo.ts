export function seo({
  title,
  description,
  keywords,
  image,
  url,
  site_name,
  twitterHandle,
}: {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  site_name?: string;
  twitterHandle?: string;
}) {
  const tags = [
    { title },
    ...(description ? [{ name: "description", content: description }] : []),
    ...(keywords ? [{ name: "keywords", content: keywords }] : []),
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    ...(description
      ? [{ property: "og:description", content: description }]
      : []),
    ...(url ? [{ property: "og:url", content: url }] : []),
    ...(site_name ? [{ property: "og:site_name", content: site_name }] : []),
    ...(image ? [{ property: "og:image", content: image }] : []),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    ...(description
      ? [{ name: "twitter:description", content: description }]
      : []),
    ...(image ? [{ name: "twitter:image", content: image }] : []),
    ...(twitterHandle ? [{ name: "twitter:site", content: twitterHandle }] : []),
    ...(twitterHandle
      ? [{ name: "twitter:creator", content: twitterHandle }]
      : []),
  ];
  return tags;
}
