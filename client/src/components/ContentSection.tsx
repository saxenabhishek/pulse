import * as React from "react";

import type { SectionGroup } from "./Content";

export interface props {
  item: SectionGroup;
}

export const ContentSection: React.FC<props> = ({
  item,
}): React.JSX.Element => {
  return (
    <section className="grid grid-cols-2 w-full gap-2">
      <h3 className="border-b-2 pb-2 text-2xl border-primary tracking-tight  col-span-2 py-4">
        {item.sectionName}
      </h3>
      {item.articles.map((atcl, arID) => (
        <article key={atcl.id}>
          <h4 className="leading-6 tracking-tight text-xl py-2">
            {atcl.webTitle}
          </h4>
          <p className="text-xs">by {atcl.fields.byline}</p>
          <p className="text-xs">
            {getReadTime(Number(atcl.fields.wordcount))}
          </p>
          <p className="text-xs">{formatTimeAgo(atcl.webPublicationDate)}</p>
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
