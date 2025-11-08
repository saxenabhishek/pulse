import * as React from "react";
import type { result } from "@/service/news";
import { ContentSection } from "./ContentSection";

export interface props {
  articles?: result[];
}

export interface SectionGroup {
  sectionId: string;
  sectionName: string;
  articles: result[];
}

type SectionsById = Record<string, SectionGroup>;

export const Content: React.FC<props> = ({ articles }): React.JSX.Element => {
  var gArticles: SectionsById = {};
  if (articles) {
    gArticles = buildSections(articles);
  }
  return !gArticles ? (
    <div>Loading...</div>
  ) : (
    <div>
      {Object.values(gArticles).map((grp, idx) => (
        <ContentSection item={grp} key={grp.sectionId} />
      ))}
    </div>
  );
};

const buildSections = (response: result[]): SectionsById => {
  return response.reduce<SectionsById>((acc, article) => {
    const { sectionId, sectionName } = article;

    if (!acc[sectionId]) {
      acc[sectionId] = {
        sectionId: sectionId,
        sectionName: sectionName,
        articles: [],
      };
    }

    acc[sectionId]["articles"].push(article);
    return acc;
  }, {});
};
