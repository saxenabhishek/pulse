import * as React from "react";

export interface FooterProps {
  name?: string;
  role?: string;
  mainWebsiteUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({
  name = "Abhishek Saxena",
  role = "Software Developer",
  mainWebsiteUrl = "https://saxenabhishek.me/saxenabhishek",
  githubUrl = "https://github.com/saxenabhishek",
  linkedinUrl = "https://www.linkedin.com/in/saxenabhishek/",
}): React.JSX.Element => (
  <footer className="mt-10 border-t border-gray-200 bg-gray-50 px-6 py-8 text-sm text-gray-700 font-noto">
    <div className="mx-auto flex max-w-5xl flex-col gap-6 md:flex-row md:items-start md:justify-between">
      <div className="max-w-md">
        <h2 className="text-base font-semibold text-gray-900">About me</h2>
        <p className="mt-2 mb-1 leading-relaxed">
          Hi, I&apos;m {name}, a {role} who enjoys building clean, performant,
          and user-friendly experiences. This project is a small piece of what
          I&apos;m experimenting with—thanks for checking it out.
        </p>
      </div>
      <div className="max-w-md">
        <h2 className="text-base font-semibold text-gray-900">
          What is Pulse?
        </h2>
        <p className="mt-2 mb-1 leading-relaxed">
          Pulse is a responsive news aggregation platform that gathers and ranks
          stories from multiple sources in real time. Built with Go and Gin, it
          focuses on efficiency and clean data delivery rather than heavy
          infrastructure. The system fetches and merges live headlines, local
          updates, and search results, using intelligent caching and parallel
          processing to keep responses fast and consistent. It automatically
          scales based on traffic, minimizing overhead while staying reliable
          under load. The project highlights practical use of concurrency,
          lightweight API design, and performance optimization in a modern web
          service.
        </p>
      </div>

      {/* Links & Call to action */}
      <div className="flex flex-col gap-3">
        <h3 className="text-base font-semibold text-gray-900">Connect</h3>
        <ul className="space-y-1">
          <li>
            <a
              href={mainWebsiteUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              Main website
            </a>
          </li>
          <li>
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              LinkedIn
            </a>
          </li>
        </ul>
        <p className="mt-1 text-xs text-gray-600">
          If you like this project or have ideas, feel free to connect or drop
          me a message.
        </p>
      </div>
    </div>

    <div className="mx-auto mt-6 max-w-5xl text-[10px] text-gray-500">
      &copy; {new Date().getFullYear()} {name}. All rights reserved.
    </div>
  </footer>
);
