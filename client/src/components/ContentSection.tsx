import * as React from "react";

import type { SectionGroup } from "./Content";
import { AspectRatio } from "./ui/aspect-ratio";

export interface props {
  item: SectionGroup;
}

export const ContentSection: React.FC<props> = ({
  item,
}): React.JSX.Element => {
  return (
    <>
      <h3 className="border-b-2 pb-2 text-4xl border-primary tracking-tight col-span-full py-4 font-cookie">
        {item.sectionName}
      </h3>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-2 lg:gap-4">
        {item.articles.map((article, arId) => (
          <a
            target="_blank"
            rel="noreferrer"
            href={article.webUrl}
            key={article.id}
            className={`flex flex-col py-4 group ${
              arId == 0 ? "col-span-full lg:flex-row items-center" : ""
            }`}
          >
            <AspectRatio
              ratio={arId == 0 ? 3 / 1 : 16 / 9}
              className="bg-muted rounded-lg group-hover:scale-95 transition-all"
            >
              {article.mainImg && (
                <img
                  fetchPriority={arId == 0 ? "high" : "low"}
                  className="h-full w-full rounded-lg object-cover"
                  srcSet={article.mainImg?.srcset}
                  src={article.thumbnail?.imgURL}
                  sizes="(max-width: 600px) 140px,(max-width: 1024px) 500px,1000px"
                  alt={article.mainImg?.altText}
                />
              )}
            </AspectRatio>
            <div className="p-6 text-xs sm:text-base font-noto text-gray-800">
              <h4 className="text-base sm:text-3xl py-1 font-oldStdtt text-black sm:leading-9 tracking-wide group-hover:text-blue-800">
                {article.webTitle}
              </h4>

              <h4 className="text-sm sm:text-xl pb-2 tracking-tighter">
                <div
                  dangerouslySetInnerHTML={{
                    __html: article.fields.trailText,
                  }}
                />
              </h4>
              <p>
                {`by ${article.fields.byline || "Anon"}  ${formatTimeAgo(
                  article.webPublicationDate
                )}`}
              </p>
              <div className="flex">
                <span className="material-symbols-outlined mr-2">
                  timelapse
                </span>
                {getReadTime(Number(article.fields.wordcount))}
              </div>
            </div>
          </a>
        ))}
      </section>
    </>
  );
};

export function formatTimeAgo(isoDate: string): string {
  const published = new Date(isoDate);
  const now = new Date();

  const diffMs = now.getTime() - published.getTime();
  if (diffMs < 0) return "Just now";

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;

  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 5) return `${diffWeek}w ago`;

  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth}mo ago`;

  const diffYear = Math.floor(diffDay / 365);
  return `${diffYear}y ago`;
}

export function getReadTime(wordCount: number, wordsPerMinute = 250): string {
  if (!wordCount || wordCount <= 0) return "";
  const minutes = wordCount / wordsPerMinute;
  return `${Math.max(1, Math.round(minutes))} min read`;
}
