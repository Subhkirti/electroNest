import { useLocation } from "react-router-dom";
import earPods from "../../../assets/images/home/earpods.gif";
import electronicsPurchase from "../../../assets/images/home/electronics.jpg";
import mobile from "../../../assets/images/home/mobile.jpg";
import watch from "../../../assets/images/home/watch.jpg";
import { useEffect } from "react";

const mainCarouselData: { image: string; path: string }[] = [
  {
    image: earPods,
    path: "",
  },
  {
    image: mobile,
    path: "",
  },
  {
    image: watch,
    path: "",
  },
  {
    image: electronicsPurchase,
    path: "",
  },
];

const footerSections: {
  section: string;
  items: { itemTitle: string; path: string }[];
}[] = [
  {
    section: "Company",
    items: [
      { itemTitle: "About", path: "" },
      { itemTitle: "Blog", path: "" },
      { itemTitle: "Jobs", path: "" },
      { itemTitle: "Press", path: "" },
      { itemTitle: "Partners", path: "" },
    ],
  },
  {
    section: "Solutions",
    items: [
      { itemTitle: "Marketing", path: "" },
      { itemTitle: "Analytics", path: "" },
      { itemTitle: "Commerce", path: "" },
      { itemTitle: "Insights", path: "" },
      { itemTitle: "Support", path: "" },
    ],
  },
  {
    section: "Documentation",
    items: [
      { itemTitle: "Guides", path: "" },
      { itemTitle: "API Status", path: "" },
    ],
  },
  {
    section: "Legal",
    items: [
      { itemTitle: "Claim", path: "" },
      { itemTitle: "Privacy", path: "" },
      { itemTitle: "Terms", path: "" },
    ],
  },
];

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
export { mainCarouselData, footerSections, ScrollToTop };
