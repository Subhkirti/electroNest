import React from "react";
import MainCarousel from "../components/homeCarousels/mainCarousel";
import HomeSectionCarousel from "../components/homeSectionCarousel/homeSectionCarousel";
import phones from "../../../assets/productsData/phones";
import watches from "../../../assets/productsData/watches";
import laptops from "../../../assets/productsData/laptops";
import cameras from "../../../assets/productsData/cameras";
import Footer from "../components/footer/footer";

function Home() {
  return (
    <div className="absolute left-0 right-0">
      <MainCarousel />

      <div className="space-y-10 py-8 flex flex-col justify-center container">
        <HomeSectionCarousel productsList={laptops} sectionName="laptops" />
        <HomeSectionCarousel productsList={watches} sectionName="watches" />
        <HomeSectionCarousel productsList={phones} sectionName="phones" />
        <HomeSectionCarousel productsList={cameras} sectionName="cameras" />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
