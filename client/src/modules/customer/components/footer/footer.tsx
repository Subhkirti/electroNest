import { Link } from "react-router-dom";
import { footerSections } from "../../utils/homeUtils";

function Footer() {
  return (
    <div className="bg-black text-slate-200 mt-20 px-10 md:px-20 py-10">
      <div className="container flex gap-x-14 gap-y-20 flex-wrap justify-center md:justify-between">
        {/* footer links */}
        {footerSections.map((footer, i) => {
          return (
            <div key={i}>
              <p className="text-center text-lg mb-6">{footer.section}</p>
              {footer.items.map((section, index) => {
                return (
                  <Link
                    key={index}
                    to={section?.path || "/"}
                    className="hover:underline hover:text-slate-400"
                  >
                    <p className="text-center text-md mb-1">
                      {section?.itemTitle}
                    </p>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* footer meta details */}
      <div className="text-center text-sm mt-20">
        <p>&copy; 2024 ElectroNest. All rights reserved</p>
        <p>Made by ElectroNest tech team.</p>
      </div>
    </div>
  );
}

export default Footer;
