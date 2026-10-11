import { Metadata } from 'next';
import PrivacyView from '@/components/legal/privacy-view';

export const metadata: Metadata = {
  title: "Privacy Policy | Lazyfolio",
  description: "Learn how Lazyfolio collects, uses, and protects your personal data when building your developer portfolio.",
};

export default function PrivacyPage() {
  return <PrivacyView />;
}