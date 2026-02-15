'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from '@/context/LocaleContext';
import type { SupportedLocale } from '@/i18n/config';

type BlogStrings = {
  searchPlaceholder: string;
  searchAria: string;
  clearSearchAria: string;
  allLabel: string;
  featuredSectionAria: string;
  featuredTitle: string;
  resultsCount: (shown: number, total: number) => string;
  resultsForPrefix: string;
  emptyTitle: string;
  emptyBody: string;
  clearAllFilters: string;
};

function getBlogStrings(locale: SupportedLocale): BlogStrings {
  switch (locale) {
    case 'es':
      return {
        searchPlaceholder: 'Buscar artículos...',
        searchAria: 'Buscar artículos',
        clearSearchAria: 'Borrar búsqueda',
        allLabel: 'Todas',
        featuredSectionAria: 'Artículos destacados',
        featuredTitle: 'Artículos destacados',
        resultsCount: (shown, total) => `Mostrando ${shown} de ${total} artículos`,
        resultsForPrefix: 'para',
        emptyTitle: 'No se encontraron artículos',
        emptyBody: 'Prueba ajustando tu búsqueda o seleccionando otra categoría.',
        clearAllFilters: 'Limpiar filtros',
      };
    case 'fr':
      return {
        searchPlaceholder: 'Rechercher des articles...',
        searchAria: 'Rechercher des articles',
        clearSearchAria: 'Effacer la recherche',
        allLabel: 'Tous',
        featuredSectionAria: 'Articles à la une',
        featuredTitle: 'Articles à la une',
        resultsCount: (shown, total) => `Affichage de ${shown} sur ${total} articles`,
        resultsForPrefix: 'pour',
        emptyTitle: 'Aucun article trouvé',
        emptyBody: 'Essayez de modifier votre recherche ou de choisir une autre catégorie.',
        clearAllFilters: 'Réinitialiser les filtres',
      };
    case 'de':
      return {
        searchPlaceholder: 'Artikel suchen...',
        searchAria: 'Artikel suchen',
        clearSearchAria: 'Suche löschen',
        allLabel: 'Alle',
        featuredSectionAria: 'Empfohlene Artikel',
        featuredTitle: 'Empfohlene Artikel',
        resultsCount: (shown, total) => `Zeige ${shown} von ${total} Artikeln`,
        resultsForPrefix: 'für',
        emptyTitle: 'Keine Artikel gefunden',
        emptyBody: 'Versuchen Sie eine andere Suche oder wählen Sie eine andere Kategorie.',
        clearAllFilters: 'Alle Filter zurücksetzen',
      };
    case 'pt':
      return {
        searchPlaceholder: 'Buscar artigos...',
        searchAria: 'Buscar artigos',
        clearSearchAria: 'Limpar busca',
        allLabel: 'Todos',
        featuredSectionAria: 'Artigos em destaque',
        featuredTitle: 'Artigos em destaque',
        resultsCount: (shown, total) => `Mostrando ${shown} de ${total} artigos`,
        resultsForPrefix: 'para',
        emptyTitle: 'Nenhum artigo encontrado',
        emptyBody: 'Tente ajustar a busca ou selecionar outra categoria.',
        clearAllFilters: 'Limpar filtros',
      };
    case 'zh':
      return {
        searchPlaceholder: '搜索文章...',
        searchAria: '搜索文章',
        clearSearchAria: '清除搜索',
        allLabel: '全部',
        featuredSectionAria: '精选文章',
        featuredTitle: '精选文章',
        resultsCount: (shown, total) => `显示 ${shown}/${total} 篇文章`,
        resultsForPrefix: '关于',
        emptyTitle: '未找到文章',
        emptyBody: '请调整搜索关键词或选择其他分类。',
        clearAllFilters: '清除筛选',
      };
    case 'en':
    default:
      return {
        searchPlaceholder: 'Search articles...',
        searchAria: 'Search articles',
        clearSearchAria: 'Clear search',
        allLabel: 'All',
        featuredSectionAria: 'Featured articles',
        featuredTitle: 'Featured Articles',
        resultsCount: (shown, total) => `Showing ${shown} of ${total} articles`,
        resultsForPrefix: 'for',
        emptyTitle: 'No articles found',
        emptyBody: 'Try adjusting your search or selecting a different category.',
        clearAllFilters: 'Clear all filters',
      };
  }
}

const ALL_CATEGORY = 'All';

interface BlogPost {
  title: string;
  description: string;
  slug: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  featured?: boolean;
}

interface BlogIndexClientProps {
  posts: BlogPost[];
}

function PostCard({
  post,
  priority = false,
  large = false,
}: {
  post: BlogPost;
  priority?: boolean;
  large?: boolean;
}): React.ReactElement {
  const { localizePath } = useLocale();

  return (
    <Link
      href={localizePath(`/blog/${post.slug}`)}
      className="group block glass-panel-strong rounded-3xl overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 h-full"
    >
      <div className="relative hc-aspect-og overflow-hidden bg-slate-100/70 dark:bg-slate-900/40">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes={large ? '(max-width: 768px) 100vw, 560px' : '(max-width: 768px) 100vw, 448px'}
          priority={priority}
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent opacity-90"
          aria-hidden="true"
        />
      </div>
      <div className="p-5">
        <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">
          {post.category}
        </span>
        <h3 className={`font-bold mb-1.5 leading-snug ${large ? 'text-xl' : 'text-lg'}`}>
          {post.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-3 line-clamp-2">
          {post.description}
        </p>
        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
          <span>{post.date}</span>
          <span className="mx-1.5" aria-hidden="true">
            &middot;
          </span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogIndexClient({ posts }: BlogIndexClientProps): React.ReactElement {
  const { locale } = useLocale();
  const strings = getBlogStrings(locale);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const post of posts) {
      counts[post.category] = (counts[post.category] || 0) + 1;
    }
    return Object.entries(counts).sort(([a], [b]) => a.localeCompare(b));
  }, [posts]);

  const featuredPosts = useMemo(() => {
    return posts.filter(p => p.featured).slice(0, 3);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return posts.filter(post => {
      const matchesCategory = activeCategory === ALL_CATEGORY || post.category === activeCategory;
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [posts, activeCategory, searchQuery]);

  const showFeatured = activeCategory === ALL_CATEGORY && !searchQuery.trim();

  const mainPosts = useMemo(() => {
    if (!showFeatured) return filteredPosts;
    const featuredSlugs = new Set(featuredPosts.map(p => p.slug));
    return filteredPosts.filter(p => !featuredSlugs.has(p.slug));
  }, [filteredPosts, featuredPosts, showFeatured]);

  return (
    <>
      {/* Search */}
      <div className="mb-6">
        <div className="glass-panel rounded-2xl flex items-center px-4 py-3">
          <svg
            className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder={strings.searchPlaceholder}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-sm placeholder-slate-400 dark:placeholder-slate-500"
            aria-label={strings.searchAria}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="ml-2 text-gray-400 hover:text-gray-600"
              aria-label={strings.clearSearchAria}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-8 overflow-x-auto scrollbar-hide -mx-4 px-4">
        <div className="flex gap-2 min-w-max pb-1">
          <button
            type="button"
            onClick={() => setActiveCategory(ALL_CATEGORY)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeCategory === ALL_CATEGORY
                ? 'bg-accent text-white shadow-lg'
                : 'elevated-pill hover:-translate-y-0.5'
            }`}
          >
            {strings.allLabel} ({posts.length})
          </button>
          {categories.map(([category, count]) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === category
                  ? 'bg-accent text-white shadow-lg'
                  : 'elevated-pill hover:-translate-y-0.5'
              }`}
            >
              {category} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Featured Section */}
      {showFeatured && featuredPosts.length >= 3 && (
        <section className="mb-10" aria-label={strings.featuredSectionAria}>
          <h2 className="text-lg font-bold mb-4 text-accent">{strings.featuredTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:row-span-2">
              <PostCard post={featuredPosts[0]} priority large />
            </div>
            <div>
              <PostCard post={featuredPosts[1]} priority />
            </div>
            <div>
              <PostCard post={featuredPosts[2]} priority />
            </div>
          </div>
        </section>
      )}

      {/* Results Count */}
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        {strings.resultsCount(mainPosts.length, posts.length)}
        {searchQuery.trim() && (
          <span>
            {' '}
            {strings.resultsForPrefix} &ldquo;
            <span className="font-medium text-gray-700">{searchQuery.trim()}</span>
            &rdquo;
          </span>
        )}
      </p>

      {/* Post Grid */}
      {mainPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mainPosts.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-8 text-center">
          <svg
            className="w-12 h-12 mx-auto text-gray-300 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-slate-700 dark:text-slate-200 font-medium mb-1">
            {strings.emptyTitle}
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{strings.emptyBody}</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory(ALL_CATEGORY);
            }}
            className="mt-4 text-accent text-sm font-medium hover:underline"
          >
            {strings.clearAllFilters}
          </button>
        </div>
      )}
    </>
  );
}
