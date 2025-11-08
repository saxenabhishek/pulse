import { useEffect, useState } from "react";
import {
  getArticles,
  MockGetArticles,
  type articleResponse,
} from "./service/news";
import { Header } from "./components/Header";
import { Content } from "./components/Content";
import { Separator } from "./components/ui/separator";

const App = () => {
  const [region, setRegion] = useState("Global");
  const [articles, setArticles] = useState<articleResponse["results"]>();
  useEffect(() => {
    getArticles(setArticles, setRegion);
  }, []);
  return (
    <section className="bg-gray-300">
      <div className="container mx-auto p-10 subpixel-antialiased">
        <Header region={region} />
        <Content articles={articles} />
      </div>
    </section>
  );
};

export default App;
