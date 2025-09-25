// app/[slug]/page.tsx
import type { Metadata } from 'next'

type SeoData = {
  title: string
  description: string
  image: string
}

async function getSeoForSlug(slug: string): Promise<SeoData> {
  // Example only — replace with API/CMS call
  return {
    title: `Title for ${slug}`,
    description: `Description for ${slug}`,
    image: `https://project-n-opal.vercel.app/${slug}.png`,
  }
}

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const data = await getSeoForSlug(params.slug)

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      images: [data.image],
      url: `https://project-n-opal.vercel.app/${params.slug}`, // OG URL
    },
    alternates: {
      canonical: `https://project-n-opal.vercel.app/${params.slug}`, // ✅ Canonical URL
    },
  }
}

export default async function Page({ params }: PageProps) {
  return (
    <main>
      <h1>{params.slug}</h1>
      <p>This is the dynamic page for {params.slug}</p>
    </main>
  )
}
