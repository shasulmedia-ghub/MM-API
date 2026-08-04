import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import ROUTES from "../constants/routes";
import "../App.css";

// Optional logo
import mmlogo from "../assets/mm_logo/mariomart_logo.jpg";

function Navbar() {

  const navigate = useNavigate();

  const {
    user,
    logout,
    isAuthenticated,
  } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (

    <nav className="mario-header navbar navbar-expand-lg navbar-dark shadow sticky-top">
    {/* <nav className="navbar navbar-expand-lg navbar-dark bg-danger shadow sticky-top"> */}
      <div className="container">

        {/* Logo */}
        {/* <Link className="mario-imgStyle" to={ROUTES.HOME}>
        <img src={mmlogo} alt="MM_Logo" />
        </Link> */}

        {/* <Link className="navbar-brand fw-bold fs-3" to={ROUTES.HOME}> */}
        <Link className="mario-brand fw-bold fs-3" 
              style = {{textDecoration: "none"}}
              to={ROUTES.HOME}
        >
          MarioMart
        </Link>

        {/* <Link className="navbar-brand" to="/">
            <img src={Logo} height="50" alt="MarioMart"/>
        </Link> */}
       
        <button
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarNav"
        >

          <ul className="navbar-nav me-auto">

            <li className="nav-item">

              <NavLink
                className="mario-nav-link"
                to={ROUTES.HOME}
                style={{ marginLeft: "20px" }}
              >
                Home
              </NavLink>

            </li>

            {isAuthenticated && (

              <li className="nav-item">

                <NavLink
                  className="mario-nav-link"
                  to={ROUTES.DASHBOARD}
                  style={{ marginLeft: "10px" }}
                >
                  Dashboard
                </NavLink>

              </li>

            )}

          </ul>

          <ul className="navbar-nav align-items-center">
            {isAuthenticated ? (

              <>
                <li className="mario-nav-item me-3">

                  <NavLink
                    className="mario-nav-link"
                    to={ROUTES.CART}
                  >
                    <FaShoppingCart size={20} />
                  </NavLink>

                </li>

                <li className="mario-nav-item dropdown">
                  <a
                    href="#!"
                    className="mario-nav-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    <FaUserCircle size={20} />
                    <span className="ms-2">
                      {user.first_name}
                    </span>
                  </a>

                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <NavLink
                        className="mario-nav-link d-block text-center"
                        to={ROUTES.DASHBOARD}
                        style={{ color: "black",
                                padding: "10px"
                              }}
                      >
                        Dashboard
                      </NavLink>
                    </li>

                    <li>
                      <button
                        className="mario-nav-link text-danger text-center"
                        onClick={handleLogout}
                        style={{
                          marginLeft: "20px",
                          border: "1px solid black",
                          borderRadius: "8px",
                          padding: "6px 20px",
                          background: "transparent"
                        }}
                      >
                        Logout
                      </button>

                    </li>
                  </ul>
                </li>
              </>
            ) : (

              <>

                <li className="mario-nav-item">
                  <NavLink
                    className="mario-nav-link"
                    to={ROUTES.LOGIN}
                  >
                    Login
                  </NavLink>
                </li>

                <li className="mario-nav-item">

                  <NavLink
                    className="mario-btn-yellow fw-bold px-4"
                    to={ROUTES.REGISTER}
                    style={{ textAlign: "center",
                             fontFamily: "var(--font-retro)",
                             marginLeft: "10px",
                             textDecoration: "none",
                            }}
                  >
                    Register
                  </NavLink>
                </li>

              </>

            )}

          </ul>

        </div>

      </div>

    </nav>

  );

}

export default Navbar;