import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { MaterialIcon } from "@/components/shared/material-icon";

interface DictionaryPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function DictionaryPagination({
  currentPage,
  totalPages,
  onPageChange,
}: DictionaryPaginationProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  // In RTL, "previous" arrow points right, "next" points left
  // In LTR, "previous" arrow points left, "next" points right
  const prevIcon = isRtl ? "chevron_right" : "chevron_left";
  const nextIcon = isRtl ? "chevron_left" : "chevron_right";

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      {/* Previous page */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center justify-center size-10 rounded-lg border border-border text-muted-foreground hover:bg-card hover:text-primary transition-colors disabled:opacity-50"
      >
        <MaterialIcon name={prevIcon} />
      </button>

      {pages.map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="flex items-center justify-center size-10 text-muted-foreground"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "flex items-center justify-center size-10 rounded-lg font-medium transition-colors",
              currentPage === page
                ? "bg-primary text-white font-bold shadow-sm"
                : "border border-transparent text-muted-foreground hover:bg-card hover:text-primary"
            )}
          >
            {page}
          </button>
        )
      )}

      {/* Next page */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center size-10 rounded-lg border border-border text-muted-foreground hover:bg-card hover:text-primary transition-colors disabled:opacity-50"
      >
        <MaterialIcon name={nextIcon} />
      </button>
    </div>
  );
}
