// next-seo.config.ts
import { DefaultSeoProps } from 'next-seo'

const config: DefaultSeoProps = {
  title: 'Nirveonx',
  description: 'AI-powered healthcare platform providing personalized medical assistance, pet care, elder support, and mental wellness through innovative telehealth solutions.',
  openGraph: {
    type: 'website',
    url: 'https://project-n-opal.vercel.app.com',
    site_name: 'NirveonX',
    images: [
      {
        url: 'https://res.cloudinary.com/dnfq7ty1x/image/upload/v1758788913/Screenshot_2025-09-25_135731_kbnvav.png',
        alt: 'Nirveonx',
      },
    ],
  },
  twitter: {
    handle: '@NirveonX',
    site: '@NirveonX', // optional but recommended
    cardType: 'summary_large_image',
  },
}

export default config
