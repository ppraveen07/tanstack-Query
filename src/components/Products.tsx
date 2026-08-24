import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchProducts } from "../api/productsApi";
import type { ProductsResponse } from "../types/Product";

function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<ProductsResponse, Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const products = data?.products ?? [];

  const categories = useMemo(() => {
    return [
      "all",
      ...new Set(
        products.map((product) => product.category)
      ),
    ];
  }, [products]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "all" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="product-loading">
        <div className="product-loader"></div>
        <h2>Loading Products</h2>
        <p>Fetching the latest products...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="product-error">
        <div className="product-error-icon">!</div>

        <h2>Unable to Load Products</h2>

        <p>{error.message}</p>

        <button onClick={() => refetch()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <main className="products-page">

      {/* Product Header */}
      <section className="products-header">

        <div>
          <span className="products-label">
            PRODUCT CATALOG
          </span>

          <h1>Product Explorer</h1>

          <p>
            Discover and explore our product collection
          </p>
        </div>

        <button
          className="products-refresh"
          onClick={() => refetch()}
        >
          <span
            className={
              isFetching
                ? "product-refresh-icon spinning"
                : "product-refresh-icon"
            }
          >
            ↻
          </span>

          {isFetching
            ? "Refreshing..."
            : "Refresh Products"}
        </button>

      </section>

      {/* Product Summary */}
      <section className="product-summary">

        <div className="summary-item">
          <div className="summary-symbol">▦</div>

          <div>
            <span>Total Products</span>
            <strong>{products.length}</strong>
          </div>
        </div>

        <div className="summary-item">
          <div className="summary-symbol category-symbol">
            ◈
          </div>

          <div>
            <span>Categories</span>
            <strong>
              {categories.length - 1}
            </strong>
          </div>
        </div>

        <div className="summary-item">
          <div className="summary-symbol result-symbol">
            ✓
          </div>

          <div>
            <span>Showing</span>
            <strong>
              {filteredProducts.length}
            </strong>
          </div>
        </div>

      </section>

      {/* Filters */}
      <section className="product-filters">

        <div className="product-search">

          <span>⌕</span>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="product-clear"
            >
              ×
            </button>
          )}

        </div>

        <select
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
        >
          {categories.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item === "all"
                ? "All Categories"
                : item}
            </option>
          ))}
        </select>

      </section>

      {/* Products */}
      {filteredProducts.length === 0 ? (
        <div className="no-products">

          <div className="no-product-icon">
            🛍️
          </div>

          <h2>No Products Found</h2>

          <p>
            Try changing your search or category filter.
          </p>

          <button
            onClick={() => {
              setSearch("");
              setCategory("all");
            }}
          >
            Clear Filters
          </button>

        </div>
      ) : (
        <section className="products-grid">

          {filteredProducts.map((product) => (

            <article
              className="product-card-new"
              key={product.id}
            >

              {/* Image */}
              <div className="product-image-wrapper">

                <img
                  src={product.thumbnail}
                  alt={product.title}
                />

                <span className="category-badge">
                  {product.category}
                </span>

              </div>

              {/* Content */}
              <div className="product-card-content">

                <h2>{product.title}</h2>

                <div className="rating-row">

                  <span className="stars">
                    ★
                  </span>

                  <strong>
                    {product.rating}
                  </strong>

                  <span className="rating-text">
                    Rating
                  </span>

                </div>

                <div className="product-bottom">

                  <div>
                    <span className="price-label">
                      PRICE
                    </span>

                    <div className="product-price">
                      ${product.price}
                    </div>
                  </div>

                  <div className="stock-box">

                    <span className="stock-label">
                      STOCK
                    </span>

                    <span
                      className={
                        product.stock > 10
                          ? "stock-good"
                          : "stock-low"
                      }
                    >
                      {product.stock} left
                    </span>

                  </div>

                </div>

                {/* Stock bar */}
                <div className="stock-progress">

                  <div
                    className="stock-progress-fill"
                    style={{
                      width: `${Math.min(
                        product.stock * 3,
                        100
                      )}%`,
                    }}
                  ></div>

                </div>

              </div>

            </article>

          ))}

        </section>
      )}

    </main>
  );
}

export default Products;