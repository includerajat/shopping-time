import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import {
  getProducts,
  getBraintreeClientToken,
  processPaymnet,
  createOrder,
} from "./apiCore";
import { emptyCart } from "./cartHelpers";
import Card from "./Card";
import { isAuthenticated } from "../auth";
import DropIn from "braintree-web-drop-in-react";

const Checkout = ({ products }) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
    address: "",
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = (userId, token) => {
    getBraintreeClientToken(userId, token).then((data) => {
      if (data && data.error) {
        setData({ ...data, error: data.error });
      } else {
        setData({ clientToken: data.clientToken });
      }
    });
  };

  useEffect(() => {
    getToken(userId, token);
  }, []);

  const getTotal = () => {
    return products.reduce((curentValue, nextValue) => {
      return curentValue + nextValue.count * nextValue.price;
    }, 0);
  };
  const showCheckout = () => {
    return isAuthenticated() ? (
      <div>{showDropIn()}</div>
    ) : (
      <Link to="/signin">
        <button className="btn btn-primary">Sign in to checkout</button>
      </Link>
    );
  };

  let deliveryAddress = data.address;

  const buy = () => {
    // send the nonce to your server
    // nonce = data.instance.requestPaymentMethod()
    setData({ loading: true });
    let nonce;
    let getNonce =
      data.instance &&
      data.instance
        .requestPaymentMethod()
        .then((data) => {
          // console.log(data);
          nonce = data.nonce;
          // once you have nonce (card type,card number ) send nonce as
          // 'paymentMethodNonce' and also total to be charged
          // console.log(
          //   "send nonce and total to process : ",
          //   nonce,
          //   getTotal(products)
          // );
          const paymentData = {
            paymentMethodNonce: nonce,
            amount: getTotal(products),
          };
          processPaymnet(userId, token, paymentData)
            .then((response) => {
              console.log(response);
              // empty cart
              // create order
              const createOrderData = {
                products,
                transaction_id: response.transaction.id,
                amount: response.transaction.amount,
                address: deliveryAddress,
              };
              createOrder(userId, token, createOrderData).then((response) => {
                emptyCart(() => {
                  console.log("payment success and empty cart");
                  setData({ loading: false, success: true });
                });
              });
            })
            .catch((error) => {
              console.log(error);
              setData({ loading: false });
            });
        })
        .catch((error) => {
          // console.log("Dropin error ", error);
          setData({ ...data, error: error.message });
        });
  };

  const handleAddress = (event) => {
    setData({ ...data, address: event.target.value });
  };

  const showDropIn = () => {
    return (
      <div>
        {data.clientToken !== null && products.length > 0 ? (
          <div onBlur={() => setData({ ...data, error: "" })}>
            <DropIn
              options={{
                authorization: data.clientToken,
              }}
              onInstance={(instance) => (data.instance = instance)}
            />
            <div className="form-group mb-3">
              <label className="text-muted">Delivery address:</label>
              <textarea
                onChange={handleAddress}
                className="form-control"
                value={data.address}
                placeholder="Type your delivery address here...."
              />
            </div>
            <button onClick={buy} className="btn btn-success btn-block">
              Pay
            </button>
          </div>
        ) : null}
      </div>
    );
  };

  const showError = (error) => {
    return (
      <div
        className="alert alert-danger"
        style={{ display: error ? "" : "none" }}
      >
        {error}
      </div>
    );
  };
  const showLoading = (loading) => loading && <h2>Loading....</h2>;
  const showSuccess = (success) => {
    return (
      <div
        className="alert alert-info"
        style={{ display: success ? "" : "none" }}
      >
        Thanks! Your payment was successful (Please refresh your page)
      </div>
    );
  };

  return (
    <div>
      <h2>{`Total: $${getTotal()}`}</h2>
      {showLoading(data.loading)}
      {showSuccess(data.success)}
      {showError(data.error)}
      {showCheckout()}
    </div>
  );
};

export default Checkout;
