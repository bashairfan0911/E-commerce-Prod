import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../../utils/api';

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
`;

const CardNumber = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: #007BFF;
`;

const LoadingText = styled.p`
  font-size: 16px;
  color: #666;
  text-align: center;
  padding: 20px;
`;

function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCategories: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch products
        const productsRes = await api.get('/api/allproducts');
        const totalProducts = productsRes.data.products?.length || 0;

        // Fetch categories
        const categoriesRes = await api.get('/api/allcategory');
        const totalCategories = categoriesRes.data.categories?.length || 0;

        // Fetch orders
        const ordersRes = await api.get('/api/allorders');
        const totalOrders = ordersRes.data.count || 0;

        // Fetch users
        const usersRes = await api.get('/api/allusers');
        const totalUsers = usersRes.data.count || 0;

        setStats({
          totalProducts,
          totalOrders,
          totalCategories,
          totalUsers
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingText>Loading dashboard...</LoadingText>;
  }

  return (
    <>
      <DashboardContainer>
        <Card>
          <CardTitle>All Products</CardTitle>
          <CardNumber>{stats.totalProducts}</CardNumber>
        </Card>

        <Card>
          <CardTitle>All Categories</CardTitle>
          <CardNumber>{stats.totalCategories}</CardNumber>
        </Card>

        <Card>
          <CardTitle>Total Orders</CardTitle>
          <CardNumber>{stats.totalOrders}</CardNumber>
        </Card>

        <Card>
          <CardTitle>Total Users</CardTitle>
          <CardNumber>{stats.totalUsers}</CardNumber>
        </Card>
      </DashboardContainer>
    </>
  );
}

export default Dashboard;
