import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} — HotelsVendors Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderMarkdown(content: string): string {
  let html = content;
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-[16px] font-semibold mt-8 mb-3">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-[20px] font-semibold mt-10 mb-4 mt-12">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-[28px] font-semibold mb-6">$1</h1>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white/90 font-semibold">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em class="text-white/70 italic">$1</em>');
  html = html.replace(/^- (.+)$/gm, '<li class="text-[14px] text-white/60 leading-relaxed ml-4 list-disc">$1</li>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="text-[14px] text-white/60 leading-relaxed ml-4 list-decimal">$1</li>');
  html = html.replace(/^\|(.+)\|$/gm, (match) => {
    const cells = match.split("|").filter(Boolean).map((c) => c.trim());
    if (cells.every((c) => /^[-:]+$/.test(c))) return "";
    const tag = match.includes("---") ? "" : `<tr>${cells.map((c) => `<td class="px-4 py-2 border border-white/10 text-[13px] text-white/60">${c}</td>`).join("")}</tr>`;
    return tag;
  });
  html = html.replace(/(<tr>[\s\S]*?<\/tr>(\n)?)+/g, (match) => {
    const rows = match.split("\n").filter(Boolean);
    const headerRow = rows[0];
    const bodyRows = rows.slice(2);
    return `<table class="w-full border-collapse border border-white/10 my-6 rounded-lg overflow-hidden"><thead class="bg-white/5">${headerRow}</thead><tbody>${bodyRows.join("")}</tbody></table>`;
  });
  html = html.replace(/\n\n/g, '</p><p class="text-[14px] text-white/60 leading-relaxed mb-4">');
  html = `<p class="text-[14px] text-white/60 leading-relaxed mb-4">${html}</p>`;
  html = html.replace(/<p class="[^"]*"><\/p>/g, "");
  html = html.replace(/<p class="[^"]*">(\s*<(h[1-6]|ul|ol|table|li))/g, "$1");
  html = html.replace(/(<\/(h[1-6]|ul|ol|table)>)<\/p>/g, "$1");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-orange-400 hover:text-amber-300 underline underline-offset-2">$1</a>');
  html = html.replace(/^---$/gm, '<hr class="border-white/10 my-8" />');
  return html;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back nav */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <Link
            href="/blog"
            className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/40 hover:text-white/70 transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>

      {/* Article header */}
      <article className="py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-orange-400/10 text-orange-400">
              {post.category}
            </span>
            <span className="text-[10px] text-white/30" dir="rtl">
              {post.categoryAr}
            </span>
            <span className="text-[10px] text-white/20">
              {post.readTime} min read
            </span>
          </div>

          <h1 className="text-[28px] sm:text-[36px] font-semibold tracking-tight leading-tight mb-3">
            {post.title}
          </h1>
          <p className="text-[14px] text-white/30 mb-6" dir="rtl">
            {post.titleAr}
          </p>

          <div className="flex items-center gap-4 mb-10 pb-10 border-b border-white/10">
            <div className="w-8 h-8 rounded-full bg-orange-400/10 flex items-center justify-center">
              <span className="text-[11px] font-medium text-orange-400">
                {post.author.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-[12px] font-medium text-white/70">{post.author}</p>
              <p className="text-[11px] text-white/30">{formatDate(post.date)}</p>
            </div>
          </div>

          {/* Content */}
          <div
            className="prose-blog"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 text-white/40"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 p-8 rounded-2xl border border-orange-400/20 bg-orange-400/3 text-center">
            <h3 className="text-[18px] font-semibold mb-2">
              Ready to transform your hotel procurement?
            </h3>
            <p className="text-[13px] text-white/50 mb-5">
              Join 500+ hotels on Egypt&apos;s B2B procurement platform.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-black text-[13px] font-medium hover:bg-orange-400 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
