import ProductList from '../../modules/products/ui/product-list';

function Products() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <div className="border-t border-gray-300 w-full mt-6 mb-12"></div>

      <ProductList />
    </div>
  );
}

export default Products;
