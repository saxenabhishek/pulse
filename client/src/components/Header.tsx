import * as React from "react";

export interface props {
  region?: string;
}

export const Header: React.FC<props> = ({
  region = "New York",
}): React.JSX.Element => {
  const today = new Date();

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(today);

  return (
    <div className="font-serif text-center">
      <div className="text-xs md:text-base flex justify-between py-2 border-y-2 border-stone-700 text-black font-oldStdtt">
        <p>{region} Edition</p>
        <p>{formattedDate}</p>
        <p>Volume No. 308</p>
      </div>
      <h1 className="text-8xl tracking-wide font-cookie py-6">The Pulse</h1>
      <h2 className="text-3xl pb-2 font-cookie capitalize ">
        All the news worth Reading
      </h2>
    </div>
  );
};
