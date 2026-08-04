import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import "../App.css";
// import mmlogo from "../assets/mm_logo/mariomart_logo.jpg";
import ROUTES from "../constants/routes";

//   const imgStyle = {
//   height: "50px",
//   width: "75px",
//   borderRadius: "0%",
//   margin: "10px",
// };

function Footer() {
  const year = new Date().getFullYear();

  return (
    // <footer className="bg-dark text-light mt-5">
    <footer className="mario-footer">

      {/* Main Footer */}
      <div className="container py-2">

        <div className="row">

          {/* Company */}
            <div className="col-lg-4 col-md-5 mb-4">


            <h3 className="mario-brand fs-3">
            {/* < className="fw-bold text-warning"> */}
                        {/* <img src={mmlogo} alt="MM_Logo" style={imgStyle} /> */}
                        MarioMart
            </h3>
            
            <p className="mario-footer-credits"
               style={{ maxWidth: "260px" }} >
            {/* <p className="mario-footer-credits mt-3 text-secondary"> */}
              MarioMart is your trusted online destination for apparel
              merchandise and accessories.
            </p>

            <div className="d-flex gap-3 fs-4 mt-4">

              <a
                href="https://facebook.com"
                className="text-light"
                target="_blank"
                rel="noreferrer"
              >
                <FaFacebook />
              </a>

              <a
                href="https://instagram.com"
                className="text-light"
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram />
              </a>

              <a
                href="https://linkedin.com"
                className="text-light"
                target="_blank"
                rel="noreferrer"
              >
                <FaLinkedin />
              </a>

              <a
                href="https://youtube.com"
                className="text-light"
                target="_blank"
                rel="noreferrer"
              >
                <FaYoutube />
              </a>

            </div>

          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">

            {/* <h5 className="text-warning mb-3"> */}
            <h5 className="mario-footer-credits fs-6">
              Quick Links
            </h5>

            <ul className="list-unstyled">
              <li className="mario-footer-credits">
              {/* <li className="mb-2"> */}
             <Link
                  to={ROUTES.HOME}
                  className="mario-footer-credits"
                  style={{ 
                    color: "Lightgray", 
                    textDecoration: "none", 
                    fontSize: "12px",
                    fontWeight: "normal"
                  }}
              >
                Home
              </Link> 
</li>

              {/* <li className="mb-2"> */}
              <li className="mario-footer-credits">
              {/* <li className="mb-2"> */}
             <Link
                  to={ROUTES.LOGIN}
                  className="mario-footer-credits"
                  style={{ 
                    color: "Lightgray", 
                    textDecoration: "none", 
                    fontSize: "12px",
                    fontWeight: "normal"
                  }}
              >
                  Login
                </Link>
              </li>

              <li className="mario-footer-credits">
                   <Link
                  to={ROUTES.REGISTER}
                  className="mario-footer-credits"
                  style={{ 
                    color: "Lightgray", 
                    textDecoration: "none", 
                    fontSize: "12px",
                    fontWeight: "normal"
                  }}
              >
                  Register
                </Link>
              </li>

              <li className="mario-footer-credits">
                <Link
                  to={ROUTES.DASHBOARD}
                  className="mario-footer-credits"
                  style={{ 
                    color: "Lightgray", 
                    textDecoration: "none", 
                    fontSize: "12px",
                    fontWeight: "normal"
                  }}
              >
                  Dashboard
                </Link>
              </li>

            </ul>

          </div>

          {/* Customer Service */}
          <div className="col-lg-3 col-md-6 mb-4">

            <h5 className="mario-footer-credits fs-6">
              Customer Service
            </h5>

            <ul className="list-unstyled text-secondary">

              <li className="mario-footer-credits"
                   style={{ 
                    color: "Lightgray", 
                    textDecoration: "none", 
                    fontSize: "12px",
                    fontWeight: "normal"
                  }}
              >
                Help Centre
              </li>

          <li className="mario-footer-credits"
                   style={{ 
                    color: "Lightgray", 
                    textDecoration: "none", 
                    fontSize: "12px",
                    fontWeight: "normal"
                  }}
              >
                Shipping Information
              </li>

          <li className="mario-footer-credits"
                   style={{ 
                    color: "Lightgray", 
                    textDecoration: "none", 
                    fontSize: "12px",
                    fontWeight: "normal"
                  }}
              >
                Return Policy
              </li>

          <li className="mario-footer-credits"
                   style={{ 
                    color: "Lightgray", 
                    textDecoration: "none", 
                    fontSize: "12px",
                    fontWeight: "normal"
                  }}
              >
                Privacy Policy
              </li>

          <li className="mario-footer-credits"
                   style={{ 
                    color: "Lightgray", 
                    textDecoration: "none", 
                    fontSize: "12px",
                    fontWeight: "normal"
                  }}
              >
                Terms & Conditions
              </li>

            </ul>

          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-6 mb-4">

            <h5 className="mario-footer-credits fs-6">
              Contact Us
            </h5>

            <p className="mario-footer-credits"
                   style={{ 
                    color: "Lightgray", 
                    textDecoration: "none", 
                    fontSize: "12px",
                    fontWeight: "normal"
                  }}
            >
              <FaMapMarkerAlt className="me-2" />
              Singapore
            </p>

            <p className="mario-footer-credits"
                   style={{ 
                    color: "Lightgray", 
                    textDecoration: "none", 
                    fontSize: "12px",
                    fontWeight: "normal"
                  }}
            >
              <FaPhoneAlt className="me-2" />
              +65 6123 4567
            </p>

            <p className="mario-footer-credits"
                   style={{ 
                    color: "Lightgray", 
                    textDecoration: "none", 
                    fontSize: "12px",
                    fontWeight: "normal"
                  }}
            >
              <FaEnvelope className="me-2" />
              support@mariomart.com
            </p>

          </div>

        </div>

      </div>

      {/* Bottom Footer */}
      <div
        className="text-center py-3"
        style={{
          backgroundColor: "#111",
          borderTop: "1px solid #444",
          borderRadius: "20px",
          padding: "40px",
          marginLeft: "10px",
          marginRight: "10px"
        }}
      >

        <small className="mario-footer-credits fw-200">
          © {year} MarioMart. All Rights Reserved.
          <br />
          Capstone Project by Shahul, Johnny and YingTong
        </small>

      </div>

    </footer>
  );
}

export default Footer;