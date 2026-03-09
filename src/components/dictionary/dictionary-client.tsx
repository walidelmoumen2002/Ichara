"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { SearchBar } from "@/components/dictionary/search-bar";
import { CategoryFilters } from "@/components/dictionary/category-filters";
import { SortDropdown } from "@/components/dictionary/sort-dropdown";
import { SignGrid } from "@/components/dictionary/sign-grid";
import { DictionaryPagination } from "@/components/dictionary/dictionary-pagination";
import type { Sign } from "@/types/sign";
import type { Category } from "@/types/category";

const ITEMS_PER_PAGE = 8;

interface DictionaryClientProps {
  signs: Sign[];
  categories: Category[];
}

export function DictionaryClient({ signs, categories }: DictionaryClientProps) {
  const t = useTranslations("Dictionary");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...signs];

    if (activeCategory !== "all") {
      result = result.filter((s) => s.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (s) =>
          s.wordAr.includes(q) ||
          s.word.toLowerCase().includes(q) ||
          s.wordFr.toLowerCase().includes(q)
      );
    }

    if (sortBy === "difficulty") {
      result.sort((a, b) => a.difficultyStars - b.difficultyStars);
    }

    return result;
  }, [signs, search, activeCategory, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedSigns = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {t("subtitle")}
          </p>
        </div>
        <div className="w-full md:w-auto md:min-w-[400px]">
          <SearchBar value={search} onChange={handleSearchChange} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-10 sticky top-16 z-40 bg-background/95 backdrop-blur py-4 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-border/50 sm:border-none sm:bg-transparent">
        <CategoryFilters
          categories={categories}
          activeCategory={activeCategory}
          onChange={handleCategoryChange}
        />
        <SortDropdown value={sortBy} onChange={setSortBy} />
      </div>

      <SignGrid signs={paginatedSigns} />

      <DictionaryPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
