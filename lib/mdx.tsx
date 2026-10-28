import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

const components = {
  a: ({ href = "", ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) =>
    href.startsWith("/") ? (
      <Link href={href} {...props} />
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
    ),
  table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="prose-table">
      <table {...props} />
    </div>
  ),
};

// Renders a Markdown/MDX body from /content. Use format "md" for plain .md files.
export function Markdown({ source, format = "mdx" }: { source: string; format?: "md" | "mdx" }) {
  return (
    <div className="prose-aksh">
      <MDXRemote
        source={source}
        components={components}
        options={{ mdxOptions: { format, remarkPlugins: [remarkGfm] } }}
      />
    </div>
  );
}
