import { useEffect } from "react";
import { getPong } from "./service/news";
import { Header } from "./components/header";

const App = () => {
  useEffect(() => {
    getPong();
  }, []);
  return (
    <div className="container mx-auto text-center p-10">
      <Header />
    </div>
  );
};

export default App;
