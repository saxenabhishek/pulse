import { Link } from "react-router";

const App = () => {
  return (
    <div className="container mx-auto text-center p-10">
      <h1 className="text-6xl">Pulse</h1>
      <h2>Only news worth reading</h2>
      <p>See you soon!</p>
      <Link to="/article">Checkout dummy article</Link>
    </div>
  );
};

export default App;
