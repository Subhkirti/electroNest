import { Link } from "react-router-dom";
import { CategoryBreadcrumbs } from "../../types/productTypes";

function Breadcrumbs({
  categoryBreadcrumbs,
}: {
  categoryBreadcrumbs: CategoryBreadcrumbs[];
}) {
  return (
    <div>
      {categoryBreadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb">
          <ol className="mx-auto flex items-center space-x-2 max-w-full ">
            {categoryBreadcrumbs.map((breadcrumb, index) => (
              <li key={index}>
                <div className="flex items-center">
                  <Link
                    to={breadcrumb.path}
                    className="mr-2 text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    {breadcrumb.category}
                  </Link>
                  {categoryBreadcrumbs?.length - 1 !== index && (
                    <svg
                      fill="currentColor"
                      width={16}
                      height={20}
                      viewBox="0 0 16 20"
                      aria-hidden="true"
                      className="h-5 w-4 text-gray-300"
                    >
                      <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                    </svg>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </div>
  );
}

export default Breadcrumbs;
