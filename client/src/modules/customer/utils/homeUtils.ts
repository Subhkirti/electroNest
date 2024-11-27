import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import AppRoutes from "../../../common/appRoutes";

const mainCarouselData: { image: string; path: string }[] = [
  {
    image:
      "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1732514963/Croma%20Assets/CMS/LP%20Page%20Banners/2024/Sanity/HP/Nov/25112024/HP_Rotating_GL_25Nov2024_skfwql.jpg",
    path: AppRoutes.products + "/computers-tablets/laptops/gaming-laptops",
  },
  {
    image:
      "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1732446931/Croma%20Assets/CMS/Homepage%20Banners/HP%20Rotating/2024/Nov/25112024/Desktop/HP_Rotating_Redmi_25Nov2024_aadleh.jpg",
    path: AppRoutes.products + "/mobile-phones",
  },
  {
    image:
      "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1730701245/Croma%20Assets/CMS/LP%20Page%20Banners/2024/website%20banner%20changes/Nov/04112024/HP_CC_TV_4Nov2024_stgqom.jpg?tr=w-1024",
    path: AppRoutes.products + "/televisions-accessories",
  },
  {
    image:
      "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1729265072/Croma%20Assets/CMS/LP%20Page%20Banners/2024/Calender%20Tiles/Oct/PCP%20SInglesplit/PCP_Singlesplit_JBL_HP_15Oct24_mbxg3h.png?tr=w-1024",
    path: AppRoutes.products + "/headphones-earphones",
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
