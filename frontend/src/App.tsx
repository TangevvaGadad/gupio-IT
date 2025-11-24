import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProductInventory from './pages/ProductInventory';
import PlaceOrder from './pages/PlaceOrder';
import OrderList from './pages/OrderList';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ProductInventory />} />
        <Route path="/products" element={<ProductInventory />} />
        <Route path="/orders/new" element={<PlaceOrder />} />
        <Route path="/orders" element={<OrderList />} />
      </Routes>
    </Layout>
  );
}

export default App;

