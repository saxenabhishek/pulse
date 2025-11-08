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
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-2 lg:gap-4">
      <h3 className="border-b-2 pb-2 text-4xl border-primary tracking-tight col-span-full py-4 font-cookie">
        {item.sectionName}
      </h3>
      {item.articles.map((article, arId) => (
        <article
          key={article.id}
          className={`flex flex-col align-middle justify-items-center text-xs sm:text-base py-4 font-noto font-stretch-extra-condensed ${
            arId == 0
              ? "col-span-full lg:flex-row"
              : " border-b-2 border-stone-300"
          }`}
        >
          <AspectRatio
            ratio={arId == 0 ? 3 / 1 : 16 / 9}
            className="bg-muted rounded-lg"
          >
            <img
              className="h-full w-full rounded-lg object-cover"
              srcSet={article.mainImg?.srcset}
              sizes="(max-width: 600px) 480px, 800px"
              alt={article.mainImg?.altText}
            />
          </AspectRatio>
          <div className="pl-2 ">
            <h4 className="text-base sm:text-2xl py-1 font-oldStdtt  sm:leading-9 tracking-wide">
              {article.webTitle}
            </h4>

            <h4 className="text-sm sm:text-xl pb-2 font-oldStdtt tracking-tighter">
              {article.fields.trailText}
            </h4>
            {article.fields.byline && (
              <p className="">by {article.fields.byline}</p>
            )}

            <p className="">{getReadTime(Number(article.fields.wordcount))}</p>
            <p className="">{formatTimeAgo(article.webPublicationDate)}</p>
          </div>
        </article>
      ))}
    </section>
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
