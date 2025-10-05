// pages/admin/dashboard.js
import AdminLayout from '../../components/AdminLayout';
import { ArrowUpRight } from 'lucide-react';

const KPI_Card = ({ title, value, change }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
    <p className="text-sm text-green-500 flex items-center mt-1">
      <ArrowUpRight className="h-4 w-4 mr-1" />
      {change}
    </p>
  </div>
);

export default function Dashboard() {
  return (
    // We pass the theme="light" prop to the layout
    <AdminLayout theme="light">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPI_Card title="Total Revenue" value="₹12,500" change="+12.5% this month" />
        <KPI_Card title="Orders" value="42" change="+5 this week" />
        <KPI_Card title="Customers" value="35" change="+8 new customers" />
        <KPI_Card title="Avg. Order Value" value="₹297" change="+3.2%" />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="font-semibold text-gray-700">Sales Figures</h2>
          <div className="h-80 flex items-center justify-center text-gray-400">
            {/* Chart component would go here. e.g., <RechartsChart /> */}
            Sales Chart Placeholder
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="font-semibold text-gray-700">Most Popular Items</h2>
          <ul className="mt-4 space-y-4">
            <li className="flex items-center justify-between">
              <span>Chicken Curry Cut</span>
              <span className="font-bold">98 orders</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Boneless Chicken</span>
              <span className="font-bold">76 orders</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Mutton Mince</span>
              <span className="font-bold">54 orders</span>
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}