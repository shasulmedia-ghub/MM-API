import Layout from "../component/Layout";
import Hero from "../component/Hero";

function Home() {
  return (
    <>
      <Layout>

      <main>

        {/* Hero Banner */}
        <Hero />

        {/* Featured Categories */}
        <section className="container py-2">

          <div className="mario-brand text-center mb-2">
            <h2 className="mario-brand text-center fw-bold"
              style={{
                fontSize: "1.5rem",
                marginLeft: "40px",
                marginBottom: "15px"
              }}  
          >
              Shop by Category
            </h2>
            <p className="text-muted"
              style={{
                fontSize: "1rem",
                marginLeft: "60px",
              }}  
            >
              Discover our exciting Mario-themed collections.
            </p>
          </div>

         <div className="row g-2">

            <div className="col-md-3 col-lg-3 text-center d-flex">
                <div className="card shadow-none h-75 w-100 text-center"
                  style={{
                      border: "3px solid var(--dark-text)",
                      borderRadius: "16px",
                      boxShadow: "0 6px 0 var(--dark-text)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  >
                  <div className="card-body d-flex flex-column align-items-center justify-content-center h-100">
                    
                    <div style={{ fontSize: "60px" }}>👕</div>
                    <h5 className="mario-brand mt-3" style={{ fontSize: "1rem" }}>
                      Shirts
                    </h5>
                    <p className="mario-brand text-muted" style={{ fontSize: "0.65rem" }}>
                      Polo style or T-shirts.
                    </p>

                  </div>
                </div>
              </div>

            <div className="col-md-3 col-lg-3 text-center d-flex">
              <div className="card shadow-none h-75 w-100 text-center"
                 style={{
                        border: "3px solid var(--dark-text)",
                        borderRadius: "16px",
                        boxShadow: "0 6px 0 var(--dark-text)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
              >
                <div className="card-body d-flex flex-column align-items-center justify-content-center h-100">
                  <div style={{ fontSize: "60px" }}>👖</div>
                  <h5 className="mario-brand mt-3" style={{ fontSize: "1rem" }}>
                    Pants
                  </h5>
                  <p className="mario-brand text-muted" style={{ fontSize: "0.65rem" }}>
                  Jeans, Business, Casual, Short.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-lg-3 text-center d-flex">
              <div className="card shadow-none h-75 w-100 text-center"
                 style={{
                     border: "3px solid var(--dark-text)",
                     borderRadius: "16px",
                     boxShadow: "0 6px 0 var(--dark-text)",
                     transition: "transform 0.2s ease, box-shadow 0.2s ease",
                 }}
              >
                <div className="card-body d-flex flex-column align-items-center justify-content-center h-100">
                 <div style={{ fontSize: "60px" }}>🧥</div>
                  <h5 className="mario-brand mt-3" style={{ fontSize: "1rem" }}>
                    Jackets
                  </h5>
                  <p className="mario-brand text-muted" style={{ fontSize: "0.65rem" }}>
                    Denim jackets, windbreakers, and winter jackets.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-lg-3 text-center d-flex">
              <div className="card shadow-none h-75 w-100 text-center"
                 style={{
                     border: "3px solid var(--dark-text)",
                     borderRadius: "16px",
                     boxShadow: "0 6px 0 var(--dark-text)",
                     transition: "transform 0.2s ease, box-shadow 0.2s ease",
                 }}
              >
                <div className="card-body d-flex flex-column align-items-center justify-content-center h-100">
                  <div style={{ fontSize: "60px" }}>🧢</div>
                  <h5 className="mario-brand mt-3" style={{ fontSize: "1rem" }}>
                    Accessories
                  </h5>
                  <p className="mario-brand text-muted" style={{ fontSize: "0.65rem" }}>
                    Cap, socks, and other accessories.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Shop With Us */}
        <section className="bg-light py-2">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="mario-brand mt-3"
                  style={{
                      fontSize: "1.5rem",
                      display: "flex", 
                      justifyContent: "center", 
                  }} 
         >
                Why Choose MarioMart?
              </h2>
               <p className="mario-brand text-muted"
                  style={{
                      fontSize: "0.65rem",
                      display: "flex", 
                      justifyContent: "center", 
                  }}  
               >
                We bring quality products with excellent customer service.
              </p>

            </div>

            <div className="row text-center">
              <div className="col-md-4 mb-4">
                <h1>🚚</h1>

                <h4 className="mario-brand mt-3"
                  style={{
                      fontSize: "1rem",
                      display: "flex", 
                      justifyContent: "center", 
                  }} 
                >
                  Fast Delivery
                </h4>

                 <p className="mario-brand text-muted"
                    style={{
                      fontSize: "0.65rem",
                      display: "flex", 
                      justifyContent: "center", 
                  }} 
                >
                  Receive your favourite products quickly with reliable
                  shipping across Singapore.
                </p>

              </div>

              <div className="col-md-4 mb-4">

                <h1>🔒</h1>

                <h4 className="mario-brand mt-3"
                  style={{
                      fontSize: "1rem",
                      display: "flex", 
                      justifyContent: "center", 
                  }} 
                >
                  Secure Shopping</h4>

                <p className="mario-brand text-muted"
                    style={{
                      fontSize: "0.65rem",
                      display: "flex", 
                      justifyContent: "center", 
                  }} 
                >
                  Your personal information and payments are always protected.
                </p>

              </div>

              <div className="col-md-4 mb-4">

                <h1>⭐</h1>

               <h4 className="mario-brand mt-3"
                  style={{
                      fontSize: "1rem",
                      display: "flex", 
                      justifyContent: "center", 
                  }} 
                >
                  Premium Quality</h4>

                  <p className="mario-brand text-muted"
                    style={{
                      fontSize: "0.65rem",
                      display: "flex", 
                      justifyContent: "center", 
                  }} 
                  >
                    Carefully selected authentic gaming merchandise.
                  </p>

              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section
          className="mario-header py-4 text-center text-white"
          style={{
            background: " linear-gradient(135deg,#E52521,#FF7B00)"
          }}
        >

          <div className="container">

            <h2 className="mario-brand text-center fs-3 fw-bold"
                 style={{ 
                      display: "flex", 
                      justifyContent: "center", 
                      marginTop: "1px" 
                    }}
            >

              Stay Updated
            </h2>

            <p className="mario-brand text-center fs-6 mb-4"
                 style={{ 
                      display: "flex", 
                      justifyContent: "center", 
                      marginTop: "1px" 
                    }}
            >
              Subscribe to receive exclusive offers and the latest products.
            </p>

            <div
              className="row justify-content-center"
            >

              <div className="col-md-6">

                <div className="input-group">

                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Enter your email"
                  />

                  <button
                    className="mario-btn-yellow"
                  >
                    Subscribe
                  </button>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>

      </Layout>
    </>
  );  
};

export default Home;
