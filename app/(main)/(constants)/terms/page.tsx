import { Metadata } from 'next';
import TermsView from '@/components/legal/terms-view';

export const metadata: Metadata = {
  title: "Terms of Service | Lazyfolio",
  description: "Read the Terms of Service governing your use of the Lazyfolio platform, username claiming, and content publishing.",
};

export default function TermsPage() {
  return <TermsView />;
}