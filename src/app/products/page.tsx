'use client';
import { useEffect, useState } from 'react';
import { fetchProducts } from '@/utils/apiFunctions'; // Adjust the import path as necessary

interface Product {
  product_id: string;
  name: string;
  base_price: number;
  exclusive_to_niche?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const res = await fetchProducts();
      setProducts(res);
    };
    loadProducts();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.product_id} className="p-4 bg-gray-100 rounded-lg shadow">
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p>${product.base_price}</p>
            <p className="text-sm text-gray-500">{product.exclusive_to_niche}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
