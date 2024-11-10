import { useState } from "react";
import Carousel from "react-multi-carousel";
import { carouselBreakpoints } from "../../../../common/constants";
import { formatAmount } from "../../../admin/utils/productUtil";
import { Button, Rating } from "@mui/material";
import { Product } from "../../types/productTypes";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../common/appRoutes";
import {
  KeyboardDoubleArrowRight,
  ShoppingCartOutlined,
} from "@mui/icons-material";

function ProductImageGallery({ product }: { product: Product }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const navigate = useNavigate();

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10 px-4 pt-4">
      {/* Image gallery */}
      <div className="flex flex-col items-center">
        <div className="overflow-hidden rounded-lg max-w-[30rem] max-h-[35rem]">
          <img
            alt={"thumbnail"}
            src={product?.images[selectedImageIndex]}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <Carousel
          responsive={carouselBreakpoints}
          containerClass="w-full my-6"
          dotListClass="carousel-dots"
          showDots={true}
        >
          {product?.images?.length > 0 &&
            product?.images.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex justify-center m-2 py-3 rounded-lg cursor-pointer ${
                    selectedImageIndex == index
                      ? "border-2 border-primary"
                      : "border"
                  }`}
                >
                  <img
                    alt={`product-image ${index}`}
                    src={item}
                    className="max-w-[6rem] max-h-[6rem] object-cover object-center"
                  />
                </div>
              );
            })}
        </Carousel>
      </div>

      {/* Product info */}
      <div className="lg:col-span-1 py-8 max-h-auto max-w-2xl px-4 pb-16 sm:px-6 lg:max-w-7xl lg:px-8 lg:pb-24">
        <div className="lg:col-span-2">
          <h1 className="text-lg lg:text-xl font-semibold text-gray-900">
            {product?.brand}
          </h1>
          <h1 className="text-lg lg:text-xl text-gray-900 opacity-60 pt-1">
            {product?.productName}
          </h1>
        </div>

        {/* Product meta details */}
        <div className=" mt-4">
          <ul className="text-md pt-1">
            <RenderColumnStack
              title="Stock"
              sensitiveValue={product?.stock <= 10}
              value={
                product?.stock < 1
                  ? "Item is out of stock"
                  : product?.stock <= 10
                  ? `Only ${product?.stock} items are left.`
                  : product?.stock + " items"
              }
            />

            {product?.quantity > 0 && (
              <RenderColumnStack
                title="Net Quantity"
                value={product?.quantity}
              />
            )}
            {product?.warrantyInfo && (
              <RenderColumnStack
                title="Warranty"
                value={product?.warrantyInfo}
              />
            )}

            {product?.returnPolicy && (
              <RenderColumnStack
                title="Return Policy"
                value={product?.returnPolicy}
              />
            )}
          </ul>
        </div>

        {/* Price Details */}
        <div className="mt-4 lg:row-span-3 lg:mt-0">
          <h2 className="sr-only">Product information</h2>
          <div className="flex space-x-5 items-center   text-gray-900 mt-6">
            <p className="font-semibold text-2xl">
              {formatAmount(product?.netPrice)} {/* Saved price */}
              {product?.price > 0 && product?.price - product?.netPrice > 0 && (
                <span className="text-sm text-blue-500 font-normal">
                  ( save {formatAmount(product?.price - product?.netPrice)})
                </span>
              )}
            </p>

            {product?.price > 0 && product?.price !== product?.netPrice && (
              <p className="line-through text-lg opacity-50">
                {formatAmount(product?.price)}
              </p>
            )}

            {product?.discountPercentage > 0 && (
              <p className="text-secondary text-sm font-semibold">
                {product?.discountPercentage}% Off
              </p>
            )}
          </div>

          {/* Reviews */}
          <div className="mt-6">
            <div className="flex items-center space-x-3">
              <Rating name="read-only" value={5.5} readOnly />
              <p className="opacity-50 text-sm">56540 Ratings</p>
              <p className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                3870 Reviews
              </p>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex space-x-10 mt-10">
            <Button
              startIcon={<ShoppingCartOutlined />}
              variant="outlined"
              onClick={() => navigate(AppRoutes.cart)}
              className=" w-[50%] px-8 py-3 shadow-none hover:shadow-none hover:bg-primary hover:text-white"
            >
              Add to cart
            </Button>

            <Button
              variant="contained"
              startIcon={
                <KeyboardDoubleArrowRight style={{ fontSize: "26px" }} />
              }
              onClick={() => navigate(AppRoutes.cart)}
              className="w-[50%]  px-8 py-3 shadow-none hover:shadow-none"
            >
              Buy now
            </Button>
          </div>
        </div>
      </div>

      <div className="py-10 lg:col-span-2 lg:col-start-1 lg:pb-16 lg:pr-8 lg:pt-6">
        {/* Description and details */}
        <div>
          <h3 className="sr-only">Description</h3>

          <div className="space-y-6">
            <p
              className="text-base text-gray-900"
              dangerouslySetInnerHTML={{
                __html: product?.description || "",
              }}
            ></p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RenderColumnStack({
  title,
  value,
  sensitiveValue,
}: {
  title: string;
  value: string | number;
  sensitiveValue?: boolean;
}) {
  return (
    <li className="text-slate font-medium">
      {title}:{" "}
      <span
        className={
          sensitiveValue
            ? "text-red font-normal"
            : "text-slate opacity-60 font-normal"
        }
      >
        {value}
      </span>
    </li>
  );
}
export default ProductImageGallery;
