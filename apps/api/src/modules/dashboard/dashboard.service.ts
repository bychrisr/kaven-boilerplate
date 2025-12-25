import { prisma } from '../../lib/prisma';

export class DashboardService {
  /**
   * Get summary metrics for the dashboard
   * - Total Active Users
   * - Total Installed (Revenue)
   * - Total Downloads (Invoices/Orders)
   */
  async getSummaryMetrics() {
    // 1. Total Active Users (count users)
    const totalUsers = await prisma.user.count({
      where: { deletedAt: null },
    });

    // 2. Total Revenue (sum of PAId invoices)
    const totalRevenueResult = await prisma.invoice.aggregate({
      _sum: { amountPaid: true },
      where: { status: 'PAID' },
    });
    
    // Handle Decimal result
    const totalRevenue = totalRevenueResult._sum.amountPaid 
      ? Number(totalRevenueResult._sum.amountPaid) 
      : 0;

    // 3. Total Invoices/Orders (Count)
    const totalInvoices = await prisma.invoice.count();
    const totalOrders = await prisma.order.count();

    return {
      totalUsers,
      revenue: totalRevenue,
      invoices: totalInvoices,
      orders: totalOrders,
    };
  }

  /**
   * Get chart data for Revenue and Users over time (e.g. last 12 months)
   */
  async getCharts() {
    // Example: Revenue per month for current year
    const currentYear = new Date().getFullYear();
    const invoices = await prisma.invoice.findMany({
        where: {
            status: 'PAID',
            createdAt: {
                gte: new Date(`${currentYear}-01-01`),
            }
        },
        select: { createdAt: true, amountPaid: true }
    });

    const users = await prisma.user.findMany({
        where: {
            createdAt: {
                gte: new Date(`${currentYear}-01-01`),
            }
        },
        select: { createdAt: true }
    });

    // Aggregate
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const chartData = months.map((name, index) => {
        const monthRevenue = invoices
            .filter(i => i.createdAt.getMonth() === index)
            .reduce((sum, i) => sum + Number(i.amountPaid), 0);
        
        const monthUsers = users
            .filter(u => u.createdAt.getMonth() === index)
            .length;

        return { name, revenue: monthRevenue, users: monthUsers };
    });

    return chartData;
  }
}

export const dashboardService = new DashboardService();
