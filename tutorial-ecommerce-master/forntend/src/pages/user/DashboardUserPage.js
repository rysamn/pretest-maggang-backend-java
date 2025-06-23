import React from "react";
import MainPage from "../../components/MainPage";
    

const DashboardUserPage = () => {
    return (
        <MainPage>
            <div className="user-dashboard">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                    <p className="welcome-text">Welcome back to your dashboard</p>
                </div>
                
                <div className="dashboard-content">
                    <div className="activity-card">
                        <h3>Recent Activity</h3>
                        <p>Your recent activities will appear here</p>
                    </div>
                    
                    <div className="statistics-card">
                        <h3>Statistics</h3>
                        <p>Your statistics will appear here</p>
                    </div>
                </div>
            </div>
        </MainPage>
    );
};

export default DashboardUserPage;