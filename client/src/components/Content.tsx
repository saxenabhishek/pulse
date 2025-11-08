import * as React from "react";
import type { element, result } from "@/service/news";
import { ContentSection } from "./ContentSection";
import { ProgressBar } from "./loader";
export interface props {
  articles: result[] | null;
}
interface ArticleImageData {
  mainImg?: {
    srcset?: string;
    altText?: string;
    credit?: string;
    copyright?: string;
    src?: string;
  };
  thumbnail?: {
    imgURL?: string;
    altText?: string;
    credit?: string;
    copyright?: string;
  };
}

interface ArticleWithDate extends result, ArticleImageData {
  publishedAt: Date;
}

export interface SectionGroup {
  sectionId: string;
  sectionName: string;
  articles: ArticleWithDate[];
}

type SectionsById = Record<string, SectionGroup>;

export const Content: React.FC<props> = ({ articles }): React.JSX.Element => {
  var gArticles: SectionsById;
  if (articles) {
    gArticles = buildSections(articles);
  }
  return gArticles === undefined ? (
    <div className="min-h-screen flex items-center justify-center">
      <ProgressBar />
    </div>
  ) : (
    <div>
      {Object.values(gArticles).map((grp, idx) => (
        <ContentSection item={grp} key={grp.sectionId} />
      ))}
    </div>
  );
};

const buildSections = (response: result[]): SectionsById => {
  const sections: SectionsById = {};

  for (const article of response) {
    const { sectionId, sectionName, webPublicationDate, elements } = article;
    const publishedAt = new Date(webPublicationDate);

    const imgData = extractImageData(elements);

    const articleWithDate: ArticleWithDate = {
      ...article,
      publishedAt,
      ...imgData,
    };

    if (!sections[sectionId]) {
      sections[sectionId] = {
        sectionId: sectionId,
        sectionName: sectionName,
        articles: [],
      };
    }

    sections[sectionId]["articles"].push(articleWithDate);
  }
  for (const section of Object.values(sections)) {
    section.articles.sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
    );
  }
  return sections;
};

function extractImageData(elements: element[] | null) {
  if (elements === null) {
    return {};
  }

  var imgData: ArticleImageData = {};
  for (const element of elements) {
    if (element.relation === "main") {
      var file_urls = [];
      const as = element.assets[0];
      imgData.mainImg = {
        altText: as.typeData.altText,
        copyright: as.typeData.copyright,
        credit: as.typeData.credit,
        src: as.file,
      };
      for (const as of element.assets) {
        console.log(as.file.split("/"));
        const sz = Number(as.file.split("/").at(-1)?.split(".").at(0));
        file_urls.push(`${as.file} ${sz}w`);
      }
      imgData.mainImg.srcset = file_urls.join(",");
    } else {
      const file = element.assets[0].file;
      const typeData = element.assets[0].typeData;
      element.assets[0];
      imgData.thumbnail = {
        altText: typeData.altText,
        copyright: typeData.copyright,
        credit: typeData.credit,
        imgURL: file,
      };
    }
  }
  return imgData;
}
