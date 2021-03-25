import { useState, useEffect } from "react";
import Layout from "./Layout";
import { read, listRelated } from "./apiCore";
import Card from "./Card";

const Product = (props) => {
  const [product, setProduct] = useState({});
  const [relatedProduct, setrelatedProduct] = useState([]);
  const [error, setError] = useState(false);

  const loadSingleProduct = (productId) => {
    read(productId).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProduct(data);
        // fetch related products
        listRelated(data._id).then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setrelatedProduct(data);
          }
        });
      }
    });
  };
  useEffect(() => {
    const productId = props.match.params.productId;
    loadSingleProduct(productId);
  }, [props]);

  return (
    <Layout
      className="container-fluid"
      title={product && product.name}
      description={product && product.description && product.description}
    >
      <div className="row">
        <div className="col-8">
          {product &&
            product.description &&
            product.description.substring(0, 100) && (
              <Card showViewProductButton={false} product={product} />
            )}
        </div>
        <div className="col-4">
          <h4>Realted Products</h4>
          {relatedProduct.map((p, i) => (
            <div key={i} className="mb-3">
              <Card product={p} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Product;
