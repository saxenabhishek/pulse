import { useEffect, useState } from "react";
import {
  getArticles,
  MockGetArticles,
  type articleResponse,
} from "./service/news";
import { Header } from "./components/Header";
import { Content } from "./components/Content";
import { Separator } from "./components/ui/separator";
import { Footer } from "./components/Footer";

const App = () => {
  const [region, setRegion] = useState("Global");
  const [articles, setArticles] = useState<articleResponse["results"] | null>(
    null
  );
  useEffect(() => {
    getArticles(setArticles, setRegion);
  }, []);
  return (
    <section className="bg-gray-300 min-h-screen">
      <div className="container mx-auto p-10 subpixel-antialiased">
        <Header region={region} />
        <Content articles={articles} />
      </div>
      <Footer />
    </section>
  );
};

export default App;
