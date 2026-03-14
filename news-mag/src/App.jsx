import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import NewsBoard from "./components/NewsBoard";
import Footer from "./components/Footer";

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const [selectedCategory, setSelectedCategory] = useState("general");

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div
      className={darkMode ? "bg-dark text-light" : "bg-light text-dark"}
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <NewsBoard darkMode={darkMode} selectedCategory={selectedCategory} />
      <Footer />
    </div>
  );
};

export default App;