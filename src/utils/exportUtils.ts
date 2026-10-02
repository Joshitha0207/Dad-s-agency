import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '../types/order';
import { Product } from '../types/product';
import { CustomerProfile } from '../types/customer';
import { formatDate, formatCurrency } from './formatting';

// Export CSV / Excel
export const exportToExcel = (data: Record<string, unknown>[], filename: string, sheetName: string = 'Sheet1') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export PDF for Orders
export const exportOrdersPDF = (orders: Order[], title: string = "Dad's Agency - Orders Report") => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.setTextColor(219, 39, 119); // Pink-600
  doc.text("Dad's Agency 🍦", 14, 20);
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text("Vivekanandar Nagar, College Road, Tiruppur, Tamil Nadu | Ph: 9843041633", 14, 26);
  doc.text(title, 14, 32);
  doc.text(`Generated on: ${formatDate(new Date().toISOString())}`, 14, 38);

  const tableRows = orders.map((o) => [
    o.order_number,
    o.customer_name,
    o.customer_phone,
    formatCurrency(o.total_amount),
    o.payment_method,
    o.order_status,
    formatDate(o.created_at)
  ]);

  autoTable(doc, {
    startY: 44,
    head: [['Order #', 'Customer', 'Phone', 'Total', 'Payment', 'Status', 'Date']],
    body: tableRows,
    headStyles: { fillColor: [244, 114, 182] }, // Pink-400
    theme: 'grid'
  });

  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
};

// Export PDF for Products
export const exportProductsPDF = (products: Product[]) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setTextColor(219, 39, 119);
  doc.text("Dad's Agency 🍦 - Inventory & Product Catalog", 14, 20);
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text(`Generated on: ${formatDate(new Date().toISOString())}`, 14, 26);

  const tableRows = products.map((p) => [
    p.name,
    p.category,
    p.product_type,
    formatCurrency(p.price),
    formatCurrency(p.mrp),
    `${p.stock_quantity} (${p.unit})`,
    p.is_available ? 'Available' : 'Out of Stock'
  ]);

  autoTable(doc, {
    startY: 32,
    head: [['Product Name', 'Category', 'Type', 'Price', 'MRP', 'Stock', 'Status']],
    body: tableRows,
    headStyles: { fillColor: [236, 72, 153] },
    theme: 'striped'
  });

  doc.save('dads_agency_products.pdf');
};

// Export PDF for Individual Order Invoice
export const generateOrderPdfInvoice = (order: Order) => {
  const doc = new jsPDF();

  // Header Title
  doc.setFontSize(20);
  doc.setTextColor(219, 39, 119); // Pink-600
  doc.text("Dad's Agency 🍦", 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text("Ice Cream, Dairy & Chocolate Shop", 14, 26);
  doc.text("Vivekanandar Nagar, College Road, Tiruppur, Tamil Nadu", 14, 31);
  doc.text("Phone: 9843041633 | Instagram: @jagannathen", 14, 36);

  doc.setLineWidth(0.5);
  doc.setDrawColor(244, 114, 182);
  doc.line(14, 40, 196, 40);

  // Invoice Meta Info
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(`INVOICE / RECEIPT: #${order.order_number}`, 14, 48);

  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(`Order Date: ${formatDate(order.created_at)}`, 14, 54);
  doc.text(`Status: ${order.order_status}`, 14, 59);
  doc.text(`Payment Method: ${order.payment_method} (${order.payment_status})`, 14, 64);

  // Customer Details
  doc.text(`Customer Name: ${order.customer_name}`, 110, 48);
  doc.text(`Mobile: ${order.customer_phone}`, 110, 54);
  doc.text(`Email: ${order.customer_email}`, 110, 59);

  // Address
  const splitAddress = doc.splitTextToSize(`Delivery Address: ${order.delivery_address}`, 85);
  doc.text(splitAddress, 110, 64);

  // Items Table
  const itemRows = order.items.map((i) => [
    i.product_name,
    formatCurrency(i.unit_price),
    i.quantity.toString(),
    formatCurrency(i.total_price)
  ]);

  autoTable(doc, {
    startY: 80,
    head: [['Product Item', 'Unit Price', 'Quantity', 'Total']],
    body: itemRows,
    headStyles: { fillColor: [236, 72, 153] },
    theme: 'grid'
  });

  // Totals Breakdown
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY || 120;
  doc.setFontSize(10);
  doc.text(`Subtotal: ${formatCurrency(order.subtotal)}`, 140, finalY + 10);
  doc.text(`Delivery Fee: ${formatCurrency(order.delivery_fee)}`, 140, finalY + 16);
  doc.setFontSize(12);
  doc.setTextColor(219, 39, 119);
  doc.text(`Grand Total: ${formatCurrency(order.total_amount)}`, 140, finalY + 24);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text("Thank you for ordering from Dad's Agency! ❤️ Enjoy your treats!", 14, finalY + 36);

  doc.save(`Invoice_${order.order_number}.pdf`);
};

export const exportCustomersToExcel = (customers: CustomerProfile[]) => {
  const data = customers.map((c) => ({
    'Customer Name': c.full_name,
    'Email Address': c.email,
    Phone: c.phone,
    Address: c.address,
    'Total Orders': c.total_orders || 1,
    'Joined Date': formatDate(c.created_at)
  }));
  exportToExcel(data, 'Dads_Agency_Customers', 'Customers');
};

export const exportSalesReportToExcel = (report: {
  totalRevenue: number;
  totalOrdersCount: number;
  averageOrderValue: number;
  topProducts: { name: string; qty: number; revenue: number }[];
}) => {
  const summaryData = [
    { Metric: 'Total Revenue', Value: formatCurrency(report.totalRevenue) },
    { Metric: 'Total Orders', Value: report.totalOrdersCount },
    { Metric: 'Average Order Value', Value: formatCurrency(report.averageOrderValue) }
  ];

  const productsData = report.topProducts.map((p) => ({
    Product: p.name,
    'Quantity Sold': p.qty,
    'Total Revenue': formatCurrency(p.revenue)
  }));

  const worksheet1 = XLSX.utils.json_to_sheet(summaryData);
  const worksheet2 = XLSX.utils.json_to_sheet(productsData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet1, 'Summary');
  XLSX.utils.book_append_sheet(workbook, worksheet2, 'Top Products');
  XLSX.writeFile(workbook, 'Dads_Agency_Sales_Report.xlsx');
};

