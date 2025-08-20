import DoctorForumLanding from "@/components/DoctorForum/DoctorForumLanding";

export const metadata = {
  title: "CuraForgeX - NirveonX Omnicare",
  description:
    "Join India's most comprehensive digital platform connecting healthcare professionals across four specialized domains for collaborative patient care and professional growth.",
  keywords: [
    "doctor community",
    "healthcare forum",
    "medical professionals",
    "telemedicine",
    "doctor collaboration",
    "medical consultation",
    "veterinary community",
    "mental health professionals",
    "elderly care specialists",
  ],
  openGraph: {
    title: "CuraForgeX - NirveonX Omnicare",
    description:
      "Join India's most comprehensive digital platform connecting healthcare professionals across four specialized domains for collaborative patient care and professional growth.",
    type: "website",
  },
};

export default function DoctorForumPage() {
  return <DoctorForumLanding />;
}
