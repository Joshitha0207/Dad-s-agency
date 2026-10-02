import { productService } from './productService';
import { orderService } from './orderService';
import { customerService } from './customerService';
import { Product } from '../types/product';

export interface DashboardStats {
  todaysOrders: number;
  todaysSales: number;
  totalOrders: number;
  totalSales: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  outForDelivery: number;
  lowStockProducts: Product[];
}

export interface SalesReportData {
  totalRevenue: number;
  totalOrdersCount: number;
  averageOrderValue: number;
  salesByCategory: Record<string, number>;
  statusBreakdown: Record<string, number>;
  topProducts: { name: string; qty: number; revenue: number }[];
  dailyChartData: { date: string; sales: number; orders: number }[];
}

export const adminService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const [products, orders, customers] = await Promise.all([
      productService.getProducts(),
      orderService.getAllOrders(),
      customerService.getAllCustomers()
    ]);

    const todayStr = new Date().toISOString().split('T')[0];

    const todaysOrdersList = orders.filter(o => o.created_at && o.created_at.startsWith(todayStr));
    const todaysSales = todaysOrdersList
      .filter(o => o.order_status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);

    const totalSales = orders
      .filter(o => o.order_status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);

    const pendingOrders = orders.filter(o => o.order_status === 'Pending' || o.order_status === 'Confirmed' || o.order_status === 'Preparing').length;
    const outForDelivery = orders.filter(o => o.order_status === 'Out for Delivery').length;

    const lowStockProducts = products.filter(p => p.stock_quantity <= (p.low_stock_limit || 5));

    return {
      todaysOrders: todaysOrdersList.length,
      todaysSales,
      totalOrders: orders.length,
      totalSales,
      totalCustomers: customers.length,
      totalProducts: products.length,
      pendingOrders,
      outForDelivery,
      lowStockProducts
    };
  },

  async getSalesReport(): Promise<SalesReportData> {
    const orders = await orderService.getAllOrders();
    const validOrders = orders.filter(o => o.order_status !== 'Cancelled');

    const totalRevenue = validOrders.reduce((sum, o) => sum + o.total_amount, 0);
    const totalOrdersCount = validOrders.length;
    const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

    // Group by date
    const salesByDate: Record<string, { date: string; sales: number; orders: number }> = {};
    validOrders.forEach(o => {
      const dateKey = o.created_at ? o.created_at.split('T')[0] : 'Unknown';
      if (!salesByDate[dateKey]) {
        salesByDate[dateKey] = { date: dateKey, sales: 0, orders: 0 };
      }
      salesByDate[dateKey].sales += o.total_amount;
      salesByDate[dateKey].orders += 1;
    });

    const dailyChartData = Object.values(salesByDate)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14);

    // Group by product category & calculate top products
    const salesByCategory: Record<string, number> = { 'Ice Cream': 0, 'Dairy': 0, 'Chocolates': 0 };
    const productStats: Record<string, { qty: number; revenue: number }> = {};

    validOrders.forEach(o => {
      o.items?.forEach(item => {
        const nameLower = item.product_name.toLowerCase();
        let cat = 'Ice Cream';
        if (nameLower.includes('milk') || nameLower.includes('curd') || nameLower.includes('paneer') || nameLower.includes('butter') || nameLower.includes('cheese') || nameLower.includes('ghee')) {
          cat = 'Dairy';
        } else if (nameLower.includes('silk') || nameLower.includes('kitkat') || nameLower.includes('chocolate') || nameLower.includes('snickers')) {
          cat = 'Chocolates';
        }

        salesByCategory[cat] = (salesByCategory[cat] || 0) + item.total_price;

        if (!productStats[item.product_name]) {
          productStats[item.product_name] = { qty: 0, revenue: 0 };
        }
        productStats[item.product_name].qty += item.quantity;
        productStats[item.product_name].revenue += item.total_price;
      });
    });

    // Status Breakdown
    const statusBreakdown: Record<string, number> = {};
    orders.forEach(o => {
      statusBreakdown[o.order_status] = (statusBreakdown[o.order_status] || 0) + 1;
    });

    const topProducts = Object.entries(productStats)
      .map(([name, stat]) => ({ name, qty: stat.qty, revenue: stat.revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      totalRevenue,
      totalOrdersCount,
      averageOrderValue,
      salesByCategory,
      statusBreakdown,
      topProducts,
      dailyChartData
    };
  }
};
