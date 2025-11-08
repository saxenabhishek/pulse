import { useEffect, useState } from "react";
import {
  getArticles,
  MockgetArticles,
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
    <div className="container mx-auto p-10">
      <Header region={region} />
      <Separator className="my-4" />
      <Content articles={articles} />
    </div>
  );
};

export default App;
