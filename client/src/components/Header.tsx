import * as React from "react";

export interface props {
  region?: string;
}

export const Header: React.FC<props> = ({
  region = "New York",
}): React.JSX.Element => {
  const today = new Date();

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(today);

  return (
    <div className="font-serif">
      <div className="text-xs md:text-base flex justify-between py-2 border-y-2 text-gray-600 uppercase">
        <p>{region} Edition</p>
        <p>{formattedDate}</p>
        <p>Volume No. 308</p>
      </div>
      <h1 className="text-6xl py-4">The Pulse</h1>
      <h2 className="text-xl pb-2 uppercase">All the news worth Reading</h2>
    </div>
  );
};
