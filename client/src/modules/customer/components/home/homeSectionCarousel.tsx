import { useState } from "react";
import AliceCarousel from "react-alice-carousel";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

function HomeSectionCarousel({
  productsList,
  sectionName,
}: {
  productsList: any[];
  sectionName: string;
}) {
  const responsive = {
    0: { items: 1.2 },
    568: { items: 2.6 },
    1024: { items: 4.1 },
  };
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const items = productsList.map((product, index) => (
    <></>
    // <HomeSectionCard product={product} key={index} />
  ));

  function slidePrev() {
    setActiveSlideIndex(activeSlideIndex - 1);
  }

  function slideNext() {
    setActiveSlideIndex(activeSlideIndex + 1);
  }

  function onSlideChanged({ item }: { item: number }) {
    setActiveSlideIndex(item);
  }

  return (
    <div className="border bg-white">
      <h2 className="text-2xl font-extrabold text-gray-800 p-5 capitalize">
        {sectionName}
      </h2>
      <div className="relative p-5">
        <AliceCarousel
          disableButtonsControls
          disableDotsControls
          items={items}
          responsive={responsive}
          onSlideChanged={onSlideChanged}
          activeIndex={activeSlideIndex}
        />

        {activeSlideIndex > 0 && (
          <div
            className={
              "cursor-pointer z-50 absolute top-[8rem] px-2 py-4 rounded-md left-[-20px] bg-white shadow-md"
            }
            aria-label="prev"
            onClick={slidePrev}
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </div>
        )}

        {activeSlideIndex < items.length - 4 && (
          <div
            className={
              "cursor-pointer z-50 absolute top-[8rem] px-2 py-4 rounded-md right-[-20px] bg-white shadow-md"
            }
            onClick={slideNext}
            aria-label="next"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeSectionCarousel;
