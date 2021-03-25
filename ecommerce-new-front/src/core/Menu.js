import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";
import { itemTotal } from "./cartHelpers";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#FF9900" };
  }
  return { color: "#ffffff" };
};

const Menu = ({ history }) => (
  <div>
    <ul className="nav nav-tabs bg-primary">
      <li className="nav-item">
        <Link className="nav-link" style={isActive(history, "/")} to="/">
          Home
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className="nav-link"
          style={isActive(history, "/shop")}
          to="/shop"
        >
          Shop
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className="nav-link"
          style={isActive(history, "/cart")}
          to="/cart"
        >
          Cart{" "}
          <sup>
            <small className="cart-badge">{itemTotal()}</small>
          </sup>
        </Link>
      </li>
      {isAuthenticated() && isAuthenticated().user.role === 0 && (
        <li className="nav-item">
          <Link
            className="nav-link"
            style={isActive(history, "/user/dashboard")}
            to="/user/dashboard"
          >
            Dashboard
          </Link>
        </li>
      )}
      {isAuthenticated() && isAuthenticated().user.role === 1 && (
        <li className="nav-item">
          <Link
            className="nav-link"
            style={isActive(history, "/admin/dashboard")}
            to="/admin/dashboard"
          >
            Dashboard
          </Link>
        </li>
      )}
      {!isAuthenticated() && (
        <>
          <li className="nav-item">
            <Link
              className="nav-link"
              to="/signin"
              style={isActive(history, "/signin")}
            >
              Signin
            </Link>
          </li>
          <li className="nav-item">
            <Link
              style={isActive(history, "/signup")}
              className="nav-link"
              to="/signup"
            >
              Signup
            </Link>
          </li>
        </>
      )}
      {isAuthenticated() && (
        <li className="nav-item">
          <span
            style={{ cursor: "pointer", color: "#ffffff" }}
            className="nav-link"
            onClick={() =>
              signout(() => {
                history.push("/");
              })
            }
          >
            Signout
          </span>
        </li>
      )}
    </ul>
  </div>
);

export default withRouter(Menu);
