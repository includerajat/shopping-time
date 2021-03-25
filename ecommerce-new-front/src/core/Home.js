import { useState, useEffect } from "react";
import Layout from "./Layout";
import { getProducts } from "./apiCore";
import Card from "./Card";
import Search from "./Search";

const Home = () => {
  const [productsBySell, setProductsBySell] = useState([]);
  const [productsByArrival, setProductsByArrival] = useState([]);
  const [error, setError] = useState(false);
  const loadProductBySell = () => {
    getProducts("sold").then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProductsBySell(data);
      }
    });
  };
  const loadProductByArrival = () => {
    getProducts("createdAt").then((data) => {
      if (data && data.error) {
        setError(data.error);
      } else {
        setProductsByArrival(data);
      }
    });
  };
  useEffect(() => {
    loadProductByArrival();
    loadProductBySell();
  }, []);
  return (
    <Layout
      className="container-fluid"
      title="Home Page"
      description="Node React E-commerce App"
    >
      <Search />
      <h2 className="mb-4">New Arrivals</h2>
      <div className="row">
        {productsByArrival.map((product, i) => (
          <div className="col-lg-4 mb-3" key={i}>
            <Card product={product} />
          </div>
        ))}
      </div>
      <h2 className="mb-4">Best Seller</h2>
      <div className="row">
        {productsBySell.map((product, i) => (
          <div className="col-lg-4 mb-3" key={i}>
            <Card product={product} />
          </div>
        ))}
      </div>
    </Layout>
  );
};
export default Home;
