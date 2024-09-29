import React from "react";
import MainCarousel from "../components/homeCarousels/mainCarousel";
import HomeSectionCarousel from "../components/homeSectionCarousel/homeSectionCarousel";
import phones from "../../../assets/productsData/phones";
import watches from "../../../assets/productsData/watches";
import laptops from "../../../assets/productsData/laptops";
import cameras from "../../../assets/productsData/cameras";

function Home() {
  return (
    <div>
      <MainCarousel />
      <div className="space-y-10 py-20 px-10 flex flex-col justify-center">
        <HomeSectionCarousel productsList={laptops} sectionName="laptops" />
        <HomeSectionCarousel productsList={watches} sectionName="watches" />
        <HomeSectionCarousel productsList={phones} sectionName="phones" />
        <HomeSectionCarousel productsList={cameras} sectionName="cameras" />
      </div>
    </div>
  );
}

export default Home;
