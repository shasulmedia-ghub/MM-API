import Layout from "../component/Layout";
import PageHeader from "../component/PageHeader";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

import "../App.css";

function Dashboard() {

    const navigate = useNavigate();
    const { user, logout } = useAuth();

    if (!user) {
        return <Navigate to="/pages/login" replace />;
    }

      const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

    return (
        <Layout>

                <PageHeader 
                title="Welcome Back"
                subtitle={` ${user.first_name} ${user.last_name} `}/>

            <div
                className="container py-5"
                style={{ minHeight: "80vh" }}
            >
                <div className="row">

                    {/* Welcome Card */}    

                    <div className="col-lg-8">
                        <div className="card shadow border-0 rounded-4">
                            <div className="card-body p-5">

                                {/* <h2 className="text-danger fw-bold mb-4">
                                    Welcome Back 👋
                                </h2>

                                <h4>
                                    {user.first_name} {user.last_name}
                                </h4> */}

                                <hr />

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <strong>Email</strong>
                                        <p>{user.email}</p>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <strong>Role</strong>
                                        <p className="text-capitalize">
                                            {user.role}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-danger"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>

                            </div>

                        </div>

                    </div>

                    {/* Quick Links */}

                    <div className="col-lg-4">
                        <div className="card shadow border-0 rounded-4">
                            <div className="card-body">
                                <h4 className="mb-4">
                                    Quick Access
                                </h4>

                                <button className="btn btn-warning w-100 mb-3">
                                    Browse Products
                                </button>

                                <button className="btn btn-success w-100 mb-3">
                                    My Orders
                                </button>

                                <button className="btn btn-primary w-100">
                                    Shopping Cart
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Layout>
    );

}

export default Dashboard;