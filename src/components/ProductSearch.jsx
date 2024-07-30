import { useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/b4/products/search-by-name`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: searchQuery }),
        }
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching for product:", error);
    }
  };

  return (
    <div className=" text-white">
      <h2>Search Products</h2>
      <div className="form-group d-flex gap-2" style={{ height: "40px" }}>
        <input
          type="text"
          id="name"
          className="form-control"
          placeholder="Product name"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      <h4 className="m-0">Search Results:</h4>
      {searchResults.length > 0 ? (
        <ul className="d-flex justify-content-center">
          {searchResults.map((product) => (
            <ProductCard productProp={product} key={product._id} />
          ))}
        </ul>
      ) : (
        <p className="m-0">Product not found.</p>
      )}
    </div>
  );
}
