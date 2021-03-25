import { useState, useEffect } from "react";
import Layout from "./Layout";
import Card from "./Card";
import { getCategories, getFilteredProducts } from "./apiCore";
import Checkbox from "./Checkbox";
import { prices } from "./fixedPrices";
import RadioBox from "./RadioBox";

const Shop = () => {
  const [myFilters, setMyFilters] = useState({
    filters: {
      category: [],
      price: [],
    },
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(false);
  const [limit, setLimit] = useState(6);
  const [skip, setSkip] = useState(0);
  const [size, setsize] = useState(0);
  const [filteredResults, setFilteredResults] = useState([]);
  const init = () => {
    getCategories().then((data) => {
      if (data.skip) {
        setError(data.error);
      } else {
        setCategories(data);
      }
    });
  };

  const loadFilteredResults = (newFilters) => {
    // console.log(newFilters);
    getFilteredProducts(skip, limit, newFilters).then((data) => {
      if (data && data.error) {
        setError(data.error);
      } else {
        setFilteredResults(data.data);
        setsize(data.size);
        setSkip(0);
      }
    });
  };
  const loadMore = () => {
    let toSkip = skip + limit;
    getFilteredProducts(toSkip, limit, myFilters.filters).then((data) => {
      if (data && data.error) {
        setError(data.error);
      } else {
        setFilteredResults([...filteredResults, ...data.data]);
        setsize(data.size);
        setSkip(toSkip);
      }
    });
  };
  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <button onClick={loadMore} className="btn btn-warning mb-5">
          Load more
        </button>
      )
    );
  };
  useEffect(() => {
    init();
    loadFilteredResults(myFilters.filters);
  }, []);
  const handlePrice = (value) => {
    const data = prices;
    let array = [];
    for (let key in data) {
      if (data[key]._id === parseInt(value)) {
        array = data[key].array;
      }
    }
    return array;
  };

  const handleFilters = (filters, filterBy) => {
    // console.log("Shop", filters, filterBy);
    const newFilters = { ...myFilters };
    newFilters.filters[filterBy] = filters;
    if (filterBy === "price") {
      let priceValues = handlePrice(filters);
      newFilters.filters[filterBy] = priceValues;
    }
    loadFilteredResults(myFilters.filters);
    setMyFilters(newFilters);
  };

  return (
    <Layout
      className="container-fluid"
      title="Shop Page"
      description="Search and find books of your choice"
    >
      <div className="row">
        <div className="col-4">
          <h4>Filter by categories</h4>
          <ul>
            <Checkbox handleFilters={handleFilters} categories={categories} />
          </ul>
          <h4>Filter by price range</h4>
          <div>
            <RadioBox handleFilters={handleFilters} prices={prices} />
          </div>
        </div>
        <div className="col-8">
          <h2 className="mb-4">Products</h2>
          <div className="row">
            {filteredResults.map((p, i) => {
              return (
                <div className="col-lg-4 mb-3" key={i}>
                  <Card product={p} />
                </div>
              );
            })}
          </div>
          <hr />
          {loadMoreButton()}
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
