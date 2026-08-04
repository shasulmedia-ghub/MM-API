import { Link } from "react-router-dom";
import {
  FaShoppingBag,
  FaTruck,
  FaLock,
  FaGift,
} from "react-icons/fa";
import "../App.css";
import mmlogo from "../assets/mm_logo/mariomart_logo.jpg";

const imgStyle = {
  height: "50px",
  width: "75px",
  borderRadius: "0%",
  margin: "10px"
};

function Hero() {
  return (
    <>
      {/* Hero Section */}
      <section
        className="mario-hero py-3"
        style={{
          background: "linear-gradient(135deg,#E52521,#FF7B00)",
          minHeight: "65vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="container">
          <div className="row align-items-center">

            {/* Left Side */}
            <div className="col-lg-6 text-white text-start">
              <div className="mario-hero-title text-bold fs-3 mb-5 d-block">
                Welcome to MarioMart
              </div>

              <h1
                className="mario-hero-subtitle display-3 fw-light mb-4 fs-5 text-white text-start"
                style={{ lineHeight: "1.2" }}
              >
                Your Favourite
                Online Store
              </h1>

              <p
                className="mario-hero-subtitle lead mb-4 text-start"
                style={{ 
                  maxWidth: "550px",
                  fontSize: "15px",
                  color: "white"
                 }}
              >
                Discover authentic Mario collectibles,
                accessories, apparel, and exclusive
                merchandise with fast delivery
                across Singapore.
              </p>

              <div className="d-flex flex-wrap gap-3">

                <Link
                  to="/register"
                  className="mario-btn-yellow btn-warning btn-lg fw-bold px-4"
                  style = {{
                    textDecoration: "none",
                    textAlign: "center",
                     justifyContent: "center"
                    }}
                >
                  Start Shopping
                </Link>

                <Link
                  to="/pages/login"
                  className="mario-hero-subtitle btn-outline-light btn-lg px-5"
                  style={{
                    textDecoration: "none",
                    textAlign: "center",
                    textJustify: "centre",
                    fontSize: "15px",
                    marginleft: "5px"
                  }}
                >
                  Login
                </Link>

              </div>

            </div>

            {/* Right Side */}
            <div className="col-lg-6 text-center mt-5 mt-lg-0">

              <img
                src="https://images.unsplash.com/photo-1602562887763-851fa56061e3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Mario Products"
                className="img-fluid rounded-6 shadow-lg"
                style={{
                  maxHeight: "500px",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "30px"
                }}
              />

            </div>

          </div>

        </div>
      </section>

      {/* Feature Section */}

      <section className="py-3 bg-light mt-4">
        <div className="container">
          <div className="row g-3 justify-content-center">

            <div className="col-md-3 col-lg-3 text-center d-flex">
              <div className="mario-btn h-80 w-100 d-flex flex-column justify-content-center align-items-center"
                  style={{
                 padding: "12px",
                 maxWidth: "450px",
                 margin: "0 auto"
                }}>

                <FaShoppingBag
                  className="text-primary mb-2"
                  size={45}
                />

                <h5 className="mario-hero-subtitle fw-bold"
                    style={{
                      fontSize: "0.75rem",
                      textAlign: "center"
                    }}
                >
                  Premium Products
                </h5>

                <p className="mario-hero-subtitle text-muted"
                    style={{
                      fontSize: "0.65rem",
                    }}>
                  Official Mario merchandise and accessories.
                </p>

              </div>

            </div>

            <div className="col-md-3 col-lg-3 text-center d-flex">

             <div className="mario-btn h-80 w-100 d-flex flex-column justify-content-center align-items-center"
                  style={{
                 padding: "12px",
                 maxWidth: "350px",
                 margin: "0 auto"
                }}>
                <FaTruck
                  className="text-primary mx-auto mb-3"
                  size={45}
                />

                  <h5 className="mario-hero-subtitle fw-bold"
                    style={{
                      fontSize: "0.75rem",
                    }}
                  >
                  Fast Delivery
                </h5>

                <p className="mario-hero-subtitle text-muted"
                    style={{
                      fontSize: "0.65rem",
                    }}>
                  Islandwide shipping with secure packaging.
                </p>

              </div>

            </div>

            <div className="col-md-3 col-lg-3 text-center d-flex">
              <div className="mario-btn h-80 w-100 d-flex flex-column justify-content-center align-items-center"
                  style={{
                 padding: "12px",
                 maxWidth: "450px",
                 margin: "0 auto"
                }}>
                <FaLock
                  className="text-success mx-auto mb-3"
                  size={45}
                />

                  <h5 className="mario-hero-subtitle fw-bold"
                    style={{
                      fontSize: "0.75rem",
                    }}
                  >
                  Secure Payment
                </h5>

                <p className="mario-hero-subtitle text-muted"
                    style={{
                      fontSize: "0.65rem",
                    }}>
                  Protected checkout powered by encrypted payment gateways.
                </p>

              </div>

            </div>

            <div className="col-md-3 col-lg-3 d-flex text-center">
              <div className="mario-btn h-80 w-100 d-flex flex-column justify-content-center align-items-center"
                  style={{
                 padding: "12px",
                 maxWidth: "450px",
                 margin: "0 auto"
                }}>
                <FaGift
                  className="text-warning mx-auto mb-3"
                  size={45}
                />

                 <h5 className="mario-hero-subtitle fw-bold"
                    style={{
                      fontSize: "0.75rem",
                    }}
                  >
                  Exclusive Rewards
                </h5>

               <p className="mario-hero-subtitle text-muted"
                    style={{
                      fontSize: "0.65rem",
                    }}>
                  Earn loyalty points every time you shop.
                </p>

              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;