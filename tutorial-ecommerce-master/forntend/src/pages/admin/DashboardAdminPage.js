import React from "react";
import { Link } from "react-router-dom";
import MainPage from "../../components/MainPage";


const DashboardAdminPage = () => {
    return (
        <MainPage>
            <div className="admin-dashboard">
                {/* Sidebar */}
                <div className="admin-sidebar">
                    <div className="sidebar-header">
                        <h3>E-Commerce Admin</h3>
                        <div className="user-info">
                            <i className="pi pi-user"></i>
                            <span>User</span>
                        </div>
                    </div>
                    
                    <ul className="admin-menu">
                        <li className="menu-item active">
                            <i className="pi pi-home"></i>
                            <span>Dashboard</span>
                            <span className="badge">88</span>
                        </li>
                        <li className="menu-item">
                            <i className="pi pi-shopping-cart"></i>
                            <Link to="/admin/pesanan">Pesanan</Link>
                        </li>
                        <li className="menu-item">
                            <i className="pi pi-tags"></i>
                            <Link to="/admin/kategori">Kategori</Link>
                        </li>
                        <li className="menu-item">
                            <i className="pi pi-box"></i>
                            <Link to="/admin/produk">Produk</Link>
                        </li>
                        <li className="menu-item">
                            <i className="pi pi-users"></i>
                            <Link to="/admin/pengguna">Pengguna</Link>
                        </li>
                        <li className="menu-item sign-out">
                            <i className="pi pi-sign-out"></i>
                            <span>Sign Out</span>
                        </li>
                    </ul>
                </div>
                
                {/* Main Content */}
                <div className="admin-content">
                    <div className="content-header">
                        <h1>Dashboard</h1>
                    </div>
                    
                    <div className="dashboard-widgets">
                        <div className="widget">
                            <h3><i className="pi pi-chart-bar"></i> Sales Overview</h3>
                            <div className="widget-content">
                                {/* Sales chart or data will go here */}
                                <p>Sales data visualization</p>
                            </div>
                        </div>
                        
                        <div className="widget">
                            <h3><i className="pi pi-list"></i> Recent Orders</h3>
                            <div className="widget-content">
                                {/* Recent orders list will go here */}
                                <p>List of recent orders</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainPage>
    );
};

export default DashboardAdminPage;