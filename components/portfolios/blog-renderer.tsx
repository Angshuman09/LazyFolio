import { Template1Blog } from "./template-1/blog";
import { Template2Blog } from "./template-2/blog";
import { Template3Blog } from "./template-3/blog";
import { Template4Blog } from "./template-4/blog";
import { Template5Blog } from "./template-5/blog";
import { Template6Blog } from "./template-6/blog";
import { Template7Blog } from "./template-7/blog";
import { Template8Blog } from "./template-8/blog";
import { Template9Blog } from "./template-9/blog";
import { Template10Blog } from "./template-10/blog";
import { Template11Blog } from "./template-11/blog";

import type { BlogPageProps } from "./shared/types";

export function BlogRenderer({
  themeId,
  ...props
}: BlogPageProps & { themeId?: string | null }) {
  switch (themeId) {
    case "1":
      return <Template1Blog {...props} />;
    case "2":
      return <Template2Blog {...props} />;
    case "3":
      return <Template3Blog {...props} />;
    case "4":
      return <Template4Blog {...props} />;
    case "5":
      return <Template5Blog {...props} />;
    case "6":
      return <Template6Blog {...props} />;
    case "7":
      return <Template7Blog {...props} />;
    case "8":
      return <Template8Blog {...props} />;
    case "9":
      return <Template9Blog {...props} />;
    case "10":
      return <Template10Blog {...props} />;
    case "11":
      return <Template11Blog {...props} />;
    default:
      return <Template1Blog {...props} />;
  }
}
