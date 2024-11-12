import { Product } from "../../types/productTypes";
import ProductCard from "../product/productCard";

function SimilarProducts({
  products,
  productId,
}: {
  products: Product[];
  productId: number;
}) {
  return products?.length > 0 ? (
    <section className="pt-10">
      <h1 className="py-5 text-xl font-bold">Similar Products</h1>
      <div className="flex  flex-wrap  space-x-4">
        {products.map((product, index) => {
          return (
            product?.productId != productId && (
              <ProductCard key={index} product={product} />
            )
          );
        })}
      </div>
    </section>
  ) : (
    <></>
  );
}

export default SimilarProducts;
