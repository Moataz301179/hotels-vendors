"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Eye } from "lucide-react";
import { getAllPosts, getFeaturedPosts, getAllCategories } from "@/lib/blog/posts";

export default function BlogPage() {
  const posts = getAllPosts();
  const featured = getFeaturedPosts();
  const categories = getAllCategories();

  return (
    <main className="min-h-screen bg-[#000000] pt-24 pb-16">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a3e635] mb-4 block">Blog</span>
          <h1 className="text-[40px] md:text-[52px] font-semibold text-white tracking-[-0.03em] leading-[1.1]">
            Insights &amp; Updates
          </h1>
          <p className="mt-4 text-[15px] text-white/30 max-w-[500px]">
            Latest news on procurement, compliance, and hospitality technology in Egypt.
          </p>
        </motion.div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog/category/${cat.slug}`}
              className="px-4 py-2 rounded-full border border-white/[0.08] text-[12px] text-white/40 hover:border-[#a3e635]/30 hover:text-[#a3e635] transition-all"
            >
              {cat.name} <span className="text-white/20 ml-1">({cat.postCount})</span>
            </Link>
          ))}
        </div>

        {/* Featured Posts */}
        {featured.length > 0 && (
          <div className="mb-16">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-6">Featured</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featured.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] aspect-[16/9] mb-4">
                      <img
                        src={post.coverImage || "/hero-hotel-drone.jpg"}
                        alt={post.title}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent" />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-medium text-[#a3e635] uppercase tracking-wider">{post.category}</span>
                      <span className="text-[10px] text-white/20">{post.author}</span>
                    </div>
                    <h3 className="text-[18px] font-semibold text-white group-hover:text-[#a3e635] transition-colors mb-2">
                      {post.title}
                    </h3>
                    <p className="text-[13px] text-white/30 leading-relaxed">{post.excerpt}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* All Posts */}
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-6">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="relative rounded-xl overflow-hidden border border-white/[0.06] aspect-[16/10] mb-4">
                    <img
                      src={post.coverImage || "/hero-hotel-drone.jpg"}
                      alt={post.title}
                      className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent" />
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-medium text-[#a3e635] uppercase tracking-wider">{post.category}</span>
                    <div className="flex items-center gap-1 text-[10px] text-white/20">
                      <Eye className="w-3 h-3" />
                      {post.views}
                    </div>
                  </div>
                  <h3 className="text-[15px] font-semibold text-white group-hover:text-[#a3e635] transition-colors mb-2">
                    {post.title}
                  </h3>
                  <p className="text-[12px] text-white/30 leading-relaxed mb-3">{post.excerpt}</p>
                  <div className="flex items-center gap-1 text-[11px] text-[#a3e635] font-medium">
                    Read More <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
