import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import HomePage from "./components/homePage/HomePage";

export default function Home() {
  return (
    <>
      <Header />
      <main className="container">
        <HomePage />
      </main>
      <Footer />
    </>
  );
}
