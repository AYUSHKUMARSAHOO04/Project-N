// app/seo-provider.tsx
'use client'

import { DefaultSeo } from 'next-seo'
import SEO from '../next-seo.config'

export default function SeoProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DefaultSeo {...SEO} />
      {children}
    </>
  )
}
