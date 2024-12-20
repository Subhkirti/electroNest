import { Fragment, useEffect, useState } from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import AppIcons from "../../../../common/appIcons";
import AuthModal from "../auth/authModal";
import AppStrings from "../../../../common/appStrings";
import { getCurrentUser } from "../../utils/localStorageUtils";
import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "../../../../common/appRoutes";
import { logout } from "../../../../store/customer/auth/action";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import AdminAppRoutes from "../../../../common/adminRoutes";
import { getAllCategories } from "../../../../store/customer/product/action";
import { ExpandMore } from "@mui/icons-material";
import { CategoryState } from "../../types/productTypes";
import { getCart, getCartItems } from "../../../../store/customer/cart/action";
import { getCategoryPath } from "../../utils/productUtils";
import Search from "./search";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const { categories } = useSelector((state: RootState) => state.product);
  const { cart, cartItems } = useSelector((state: RootState) => state.cart);
  const [searchOpen, setSearchOpen] = useState(false);
  const openUserMenu = Boolean(anchorEl);
  const user = getCurrentUser();
  const authText = user
    ? AppStrings.logout
    : location?.pathname === AppRoutes.register
    ? AppStrings.register
    : AppStrings.login;

  useEffect(() => {
    const timer = setTimeout(() => {
      !categories?.length && dispatch(getAllCategories());
      categories?.length && !cart && dispatch(getCart());
      categories?.length && !cartItems?.length && dispatch(getCartItems());
    }, 10);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line
  }, [anchorEl, categories?.length, cart?.totalItems, cartItems?.length]);

  const handleUserClick = (event: { currentTarget: any }) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleAuth = () => {
    if (user) {
      dispatch(logout());
    } else {
      setOpenAuthModal(true);
    }
  };
  const handleClose = () => {
    setOpenAuthModal(false);
  };

  const handleCategoryClick = (category: any, section: any, item: any) => {
    navigate(
      getCategoryPath({
        categoryId: category?.categoryId,
        sectionId: section?.sectionId,
        itemId: item?.itemId,
      })
    );
    handleCloseUserMenu();
    setOpen(false);
    setShowMore(false);
  };

  const handleClickMenu = (
    e: { preventDefault: () => void; stopPropagation: () => void },
    type: "orders" | "profile" | "wishlist"
  ) => {
    handleCloseUserMenu();

    if (type === "orders") {
      window.location.href = AppRoutes.orders;
    } else if (type === "wishlist") {
      window.location.href = AppRoutes.wishList;
    } else if (type === "profile") {
      window.location.href =
        user?.role === "admin"
          ? AdminAppRoutes.dashboard
          : user?.id
          ? `/user/${user?.id}`
          : "";
    }
  };

  // Split categories into two parts: first 4 categories and the rest
  const firstFourCategories = categories.slice(0, 3);
  const remainingCategories = categories.slice(3);
  return (
    <div className="bg-white mb-10">
      {/* Mobile menu */}
      {MobileSideNavbar()}

      <header className="relative bg-white">
        {/* <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          Get free delivery on orders over ₹1000
        </p> */}

        {/* Web menu */}
        <nav aria-label="Top" className="mx-auto">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center px-11">
              <button
                type="button"
                className="rounded-md bg-white p-2 text-gray-400 lg:hidden"
                onClick={() => setOpen(true)}
              >
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0 w-[40%] lg:w-[20%]">
                <Link to={AppRoutes.home}>
                  <span className="sr-only">ElectroNest</span>
                  <img
                    src={AppIcons.imgLogo}
                    alt="ElectroNestLogo"
                    width={"200px"}
                    className=""
                  />
                </Link>
              </div>

              {/* Flyout menus */}
              <Popover.Group className="hidden lg:block lg:self-stretch z-10">
                <div className="flex h-full space-x-8">
                  {/* First four menus */}
                  {firstFourCategories.length > 0 &&
                    firstFourCategories.map((category: CategoryState) => (
                      <Popover key={category.categoryId} className="flex">
                        {({ open, close }) => (
                          <>
                            <div className="relative flex">
                              <Popover.Button
                                onClick={() => setShowMore(false)}
                                className={classNames(
                                  open
                                    ? "border-indigo-600 text-indigo-600"
                                    : "border-transparent text-gray-700 hover:text-gray-800",
                                  "relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out focus:outline-none"
                                )}
                              >
                                {category.categoryName}
                              </Popover.Button>
                            </div>

                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-200"
                              enterFrom="opacity-0"
                              enterTo="opacity-100"
                              leave="transition ease-in duration-150"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Popover.Panel className="absolute inset-x-0 top-full text-sm text-gray-500">
                                <div
                                  className="absolute inset-0 top-1/2 bg-white shadow"
                                  aria-hidden="true"
                                />

                                <div className="relative bg-white">
                                  <div className="mx-auto max-w-7xl px-8">
                                    <div className="grid grid-cols-5 gap-x-4 gap-y-10 py-16">
                                      {category?.sections &&
                                        category?.sections?.length > 0 &&
                                        category.sections.map(
                                          (section: {
                                            sectionId: string;
                                            sectionName: string;
                                            items: any[];
                                          }) => (
                                            <div key={section.sectionId}>
                                              <p
                                                onClick={() => {
                                                  close();
                                                  !section.items?.length &&
                                                    handleCategoryClick(
                                                      category,
                                                      section,
                                                      null
                                                    );
                                                }}
                                                id={`${section.sectionName}-heading`}
                                                className={
                                                  section.items?.length
                                                    ? "border-b-2 border-primary font-medium text-primary pb-2"
                                                    : "cursor-pointer font-normal hover:text-gray-800 pb-2"
                                                }
                                              >
                                                {section.sectionName}
                                              </p>
                                              {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
                                              <ul
                                                role="list"
                                                aria-labelledby={`${section.sectionName}-heading`}
                                                className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                              >
                                                {section.items?.length
                                                  ? section.items.map(
                                                      (item) => (
                                                        <li
                                                          key={item.itemId}
                                                          className="flex"
                                                        >
                                                          <p
                                                            onClick={() => {
                                                              close();
                                                              handleCategoryClick(
                                                                category,
                                                                section,
                                                                item
                                                              );
                                                            }}
                                                            className="cursor-pointer hover:text-gray-800"
                                                          >
                                                            {item.itemName}
                                                          </p>
                                                        </li>
                                                      )
                                                    )
                                                  : null}
                                              </ul>
                                            </div>
                                          )
                                        )}
                                    </div>
                                  </div>
                                </div>
                              </Popover.Panel>
                            </Transition>
                          </>
                        )}
                      </Popover>
                    ))}

                  {/* "More" Button for additional categories */}
                  {remainingCategories.length > 0 && (
                    <Popover className="flex">
                      {({ open, close }) => (
                        <>
                          <div className="relative flex">
                            <Popover.Button
                              className={classNames(
                                open
                                  ? "border-indigo-600 text-indigo-600"
                                  : "border-transparent text-gray-700 hover:text-gray-800",
                                "relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out focus:outline-none"
                              )}
                              onClick={() => {
                                setShowMore(!showMore);
                              }}
                            >
                              More
                            </Popover.Button>
                          </div>

                          {showMore && (
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-200"
                              enterFrom="opacity-0"
                              enterTo="opacity-100"
                              leave="transition ease-in duration-150"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Popover.Panel className="absolute inset-x-0 top-full text-sm text-gray-500">
                                <div
                                  className="absolute inset-0 top-1/2 bg-white shadow"
                                  aria-hidden="true"
                                />

                                <div className="relative bg-white">
                                  <div className="mx-auto max-w-7xl px-8">
                                    <div className="grid grid-cols-5 gap-x-6 gap-y-10 py-16">
                                      {remainingCategories.map(
                                        (category: CategoryState) => (
                                          <div key={category.categoryId}>
                                            <p
                                              id={`${category.categoryName}-heading`}
                                              className="font-medium text-primary pb-2 border-b-2 border-primary"
                                            >
                                              {category.categoryName}
                                            </p>
                                            {category.sections &&
                                              category.sections?.length > 0 &&
                                              category.sections.map(
                                                (section: {
                                                  sectionId: string;
                                                  sectionName: string;
                                                  items: any[];
                                                }) => (
                                                  <div key={section.sectionId}>
                                                    <p
                                                      onClick={() => {
                                                        close();
                                                        !section.items
                                                          ?.length &&
                                                          handleCategoryClick(
                                                            category,
                                                            section,
                                                            null
                                                          );
                                                      }}
                                                      id={`${section.sectionName}-heading`}
                                                      className={
                                                        section.items?.length
                                                          ? "text-gray-900 font-medium mt-6"
                                                          : "cursor-pointer font-normal mt-3 hover:text-gray-800"
                                                      }
                                                    >
                                                      {section.sectionName}
                                                    </p>
                                                    {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
                                                    <ul
                                                      role="list"
                                                      aria-labelledby={`${section.sectionName}-heading`}
                                                      className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                                    >
                                                      {section.items?.length
                                                        ? section.items.map(
                                                            (item) => (
                                                              <li
                                                                key={
                                                                  item.itemId
                                                                }
                                                                className="flex"
                                                              >
                                                                <p
                                                                  onClick={() => {
                                                                    close();
                                                                    handleCategoryClick(
                                                                      category,
                                                                      section,
                                                                      item
                                                                    );
                                                                  }}
                                                                  className="cursor-pointer hover:text-gray-800"
                                                                >
                                                                  {
                                                                    item.itemName
                                                                  }
                                                                </p>
                                                              </li>
                                                            )
                                                          )
                                                        : null}
                                                    </ul>
                                                  </div>
                                                )
                                              )}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Popover.Panel>
                            </Transition>
                          )}
                        </>
                      )}
                    </Popover>
                  )}
                </div>
              </Popover.Group>

              <div className="ml-auto flex items-center">
                {!searchOpen && (
                  <div className="mr-4 flex flex-1 items-center justify-end space-x-3">
                    {user && (
                      <div>
                        <Tooltip
                          arrow={true}
                          title={`${user.name}`}
                          placement="top"
                        >
                          <Avatar
                            className="text-white"
                            onClick={handleUserClick}
                            aria-controls={open ? "basic-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            sx={{
                              bgcolor: deepPurple[500],
                              color: "white",
                              cursor: "pointer",
                            }}
                          >
                            {user?.avatarText}
                          </Avatar>
                        </Tooltip>

                        <Menu
                          id="basic-menu"
                          anchorEl={anchorEl}
                          open={openUserMenu}
                          onClose={handleCloseUserMenu}
                          MenuListProps={{
                            "aria-labelledby": "basic-button",
                          }}
                        >
                          <MenuItem
                            onClick={(e) => handleClickMenu(e, "profile")}
                          >
                            {"Profile"}
                          </MenuItem>
                          <MenuItem
                            onClick={(e) => handleClickMenu(e, "orders")}
                          >
                            {"My Orders"}
                          </MenuItem>
                          <MenuItem
                            onClick={(e) => handleClickMenu(e, "wishlist")}
                          >
                            {"My Wishlist"}
                          </MenuItem>
                        </Menu>
                      </div>
                    )}
                    <div className="hidden lg:flex">
                      <Button
                        onClick={handleAuth}
                        className="text-sm text-primary font-medium"
                      >
                        {authText}
                      </Button>
                    </div>
                  </div>
                )}
                {/* Search */}

                {location?.pathname === AppRoutes.home && (
                  <Search
                    searchOpen={searchOpen}
                    setSearchOpen={setSearchOpen}
                  />
                )}

                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-6">
                  <Button
                    onClick={() => navigate("/cart")}
                    className="group -m-2 flex items-center p-2"
                  >
                    <ShoppingBagIcon
                      className="h-6 w-6  flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    {cart?.totalItems && cart?.totalItems > 0 ? (
                      <span className="-ml-3 mb-3 bg-yellow-300 px-2 rounded-full text-[12px] font-medium text-gray-700 group-hover:text-gray-800">
                        {cart?.totalItems}
                      </span>
                    ) : (
                      ""
                    )}
                    <span className="sr-only">items in cart, view bag</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <AuthModal handleClose={handleClose} open={openAuthModal} />
    </div>
  );

  function MobileSideNavbar() {
    return (
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Links */}
                {categories.length > 0 &&
                  categories.map((category: CategoryState) => {
                    return (
                      <Accordion elevation={0} key={category?.categoryId}>
                        {category?.sections && category?.sections.length ? (
                          <AccordionSummary
                            expandIcon={<ExpandMore className="text-black" />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                            className="text-black"
                          >
                            {category.categoryName}
                          </AccordionSummary>
                        ) : (
                          <AccordionDetails
                            onClick={() =>
                              handleCategoryClick(category, null, null)
                            }
                            className="text-black cursor-pointer"
                          >
                            {category.categoryName}
                          </AccordionDetails>
                        )}

                        {category?.sections &&
                          category?.sections?.length > 0 &&
                          category.sections.map(
                            (section: {
                              sectionId: string;
                              sectionName: string;
                              items: any[];
                            }) => {
                              return (
                                <Accordion
                                  elevation={0}
                                  key={section?.sectionId}
                                >
                                  {section.items.length ? (
                                    <AccordionSummary
                                      style={{
                                        boxShadow: "none",
                                        border: "none",
                                      }}
                                      expandIcon={
                                        <ExpandMore className="text-primary" />
                                      }
                                      aria-controls="panel1-content"
                                      id="panel1-header"
                                      className="text-primary"
                                    >
                                      {section.sectionName}
                                    </AccordionSummary>
                                  ) : (
                                    <AccordionDetails
                                      onClick={() =>
                                        handleCategoryClick(
                                          category,
                                          section,
                                          null
                                        )
                                      }
                                      className="text-slate-500 cursor-pointer"
                                    >
                                      {section.sectionName}
                                    </AccordionDetails>
                                  )}

                                  {section.items.length
                                    ? section.items.map(
                                        (item: {
                                          itemId: string;
                                          itemName: string;
                                        }) => {
                                          return (
                                            <AccordionDetails
                                              key={item?.itemId}
                                              onClick={() =>
                                                handleCategoryClick(
                                                  category,
                                                  section,
                                                  item
                                                )
                                              }
                                              className="text-slate-500 cursor-pointer"
                                            >
                                              {item.itemName}
                                            </AccordionDetails>
                                          );
                                        }
                                      )
                                    : null}
                                </Accordion>
                              );
                            }
                          )}
                      </Accordion>
                    );
                  })}

                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  <div className="flow-root">
                    <Button
                      onClick={handleAuth}
                      className="-m-2 block p-2 font-medium text-gray-900"
                    >
                      {authText}
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    );
  }
}
