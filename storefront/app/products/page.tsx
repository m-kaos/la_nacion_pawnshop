import ProductCard from '@/components/ProductCard';
import { graphqlClient } from '@/lib/graphql-client';
import { GET_PRODUCTS } from '@/lib/queries';
import { ProductListResponse } from '@/types';

// Force dynamic rendering - always fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getAllProducts() {
  try {
    const result = await graphqlClient.query<ProductListResponse>(
      GET_PRODUCTS,
      { options: { take: 50 } }
    );
    const allProducts = result.data?.products.items || [];

    // Filter out products where ALL variants have no stock (stockLevel === 'OUT_OF_STOCK')
    const inStockProducts = allProducts.filter(product => {
      return product.variants.some(variant => variant.stockLevel !== 'OUT_OF_STOCK');
    });

    return inStockProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">All Products</h1>

      {products.length > 0 ? (
        <>
          <p className="text-gray-600 mb-6">
            Showing {products.length} product{products.length !== 1 ? 's' : ''}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg mb-2">
            No products found.
          </p>
          <p className="text-sm text-gray-500">
            Please ensure the Vendure backend is running and has products.
          </p>
        </div>
      )}
    </div>
  );
}
