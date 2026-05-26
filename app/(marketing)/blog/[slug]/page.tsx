"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Eye, Share2 } from "lucide-react";
import { getPostBySlug, getAllPosts } from "@/lib/blog/posts";
import { notFound } from "next/navigation";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getAllPosts()
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 2);

  return (
    <main className="min-h-screen bg-[#000000] pt-24 pb-16">
      <div className="max-w-[800px] mx-auto px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[12px] text-white/30 hover:text-white/60 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-medium text-[#a3e635] uppercase tracking-wider px-3 py-1 rounded-full border border-[#a3e635]/20">
              {post.category}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-white/20">
              <Clock className="w-3 h-3" />
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-white/20">
              <Eye className="w-3 h-3" />
              {post.views} views
            </div>
          </div>

          <h1 className="text-[32px] md:text-[44px] font-semibold text-white tracking-[-0.03em] leading-[1.1] mb-6">
            {post.title}
          </h1>

          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                <span className="text-[12px] font-semibold text-white">{post.author.charAt(0)}</span>
              </div>
              <div>
                <p className="text-[13px] font-medium text-white">{post.author}</p>
                <p className="text-[11px] text-white/30">CEO, HotelsVendors</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] text-[12px] text-white/40 hover:border-[#a3e635]/30 hover:text-[#a3e635] transition-all">
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          </div>

          {post.coverImage && (
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] aspect-[16/9] mb-10">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent" />
            </div>
          )}

          <div className="prose prose-invert prose-lg max-w-none">
            <div className="text-[15px] text-white/40 leading-relaxed whitespace-pre-line">
              {post.content}
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-10 border-t border-white/[0.06]">
              <h3 className="text-[14px] font-semibold text-white mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((rp) => (
                  <Link key={rp.id} href={`/blog/${rp.slug}`} className="group block">
                    <div className="relative rounded-xl overflow-hidden border border-white/[0.06] aspect-[16/9] mb-3">
                      <img
                        src={rp.coverImage || "/hero-hotel-drone.jpg"}
                        alt={rp.title}
                        className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity"
                      />
                    </div>
                    <h4 className="text-[14px] font-semibold text-white group-hover:text-[#a3e635] transition-colors">
                      {rp.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.article>
      </div>
    </main>
  );
}
