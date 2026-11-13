import { TopicPage } from "@/components/v2/topic-page";
import { hubMetadata } from "@/lib/v2-metadata";

export const metadata = hubMetadata("architecture");

export default function Page() {
  return <TopicPage pageId="architecture" />;
}