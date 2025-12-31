import { prisma } from '../../lib/prisma';

export class DashboardService {
  /**
   * Get summary metrics for the dashboard
   * - Total Active Users
   * - Total Installed (Revenue)
   * - Total Downloads (Invoices/Orders)
   */
  /**
   * Helper to calculate percentage trend
   */
  private calculateTrend(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number((((current - previous) / previous) * 100).toFixed(1));
  }

  /**
   * Get summary metrics for the dashboard
   * Including 7-day trends
   */
  async getSummaryMetrics() {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    const fourteenDaysAgo = new Date(now);
    fourteenDaysAgo.setDate(now.getDate() - 14);

    // 1. Total Active Users (and trend)
    const totalUsersCurrent = await prisma.user.count({ where: { deletedAt: null } });
    const totalUsersPrevious = await prisma.user.count({ 
        where: { 
            deletedAt: null,
            createdAt: { lt: sevenDaysAgo } // Users existing before the last 7 days
        } 
    });
    // This logic creates a "Net Growth" trend. 
    // Usually "Trend vs previous 7 days" implies comparing net growth vs previous net growth?
    // User requested "Total Active Users ... +2.6% vs previous 7 days". 
    // This usually means (TotalNow - Total7DaysAgo) / Total7DaysAgo.
    const totalUsersTrend = this.calculateTrend(totalUsersCurrent, totalUsersPrevious);


    // 2. New Signups (Last 7 days vs Previous 7 days)
    const newSignupsCurrent = await prisma.user.count({
        where: { createdAt: { gte: sevenDaysAgo } }
    });
    const newSignupsPrevious = await prisma.user.count({
        where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } }
    });
    const newSignupsTrend = this.calculateTrend(newSignupsCurrent, newSignupsPrevious);


    // 3. Activation Rate (Verified users / Total users in period)
    const verifiedCurrent = await prisma.user.count({
        where: { 
            createdAt: { gte: sevenDaysAgo },
            emailVerified: true
        }
    });
    const activationRateCurrent = newSignupsCurrent > 0 
        ? (verifiedCurrent / newSignupsCurrent) * 100 
        : 0;

    const verifiedPrevious = await prisma.user.count({
        where: { 
            createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
            emailVerified: true
        }
    });
    const activationRatePrevious = newSignupsPrevious > 0 
        ? (verifiedPrevious / newSignupsPrevious) * 100 
        : 0;
    
    // Trend is difference in percentage points (pp) or percentage change of the rate?
    // "↓ -5.2%" implies percentage change usually.
    // Let's use percentage change of the rate value.
    const activationRateTrend = this.calculateTrend(activationRateCurrent, activationRatePrevious);


    // 4. Revenue (Last 7 days vs Previous 7 days) - Mocked logic or based on Invoices if available
    // Implementing simpler aggregation for Revenue to match trend
    const revenueCurrentResult = await prisma.invoice.aggregate({
        _sum: { amountPaid: true },
        where: { status: 'PAID', updatedAt: { gte: sevenDaysAgo } }
    });
    const revenuePreviousResult = await prisma.invoice.aggregate({
        _sum: { amountPaid: true },
        where: { status: 'PAID', updatedAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } }
    });
    const revenueCurrent = Number(revenueCurrentResult._sum.amountPaid || 0);
    const revenuePrevious = Number(revenuePreviousResult._sum.amountPaid || 0);
    
    // Total Revenue (All time)
    const totalRevenueResult = await prisma.invoice.aggregate({ _sum: { amountPaid: true }, where: { status: 'PAID' } });
    const totalRevenue = Number(totalRevenueResult._sum.amountPaid || 0);


    // 5. Invoices (7 days trend)
    // Using Count
    const invoicesCurrent = await prisma.invoice.count({ where: { createdAt: { gte: sevenDaysAgo } } });
    const invoicesPrevious = await prisma.invoice.count({ where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } } });
    const totalInvoices = await prisma.invoice.count();


    return {
      totalUsers: { value: totalUsersCurrent, trend: totalUsersTrend },
      newSignups: { value: newSignupsCurrent, trend: newSignupsTrend },
      activationRate: { value: Number(activationRateCurrent.toFixed(1)), trend: activationRateTrend },
      revenue: { value: totalRevenue, trend: this.calculateTrend(revenueCurrent, revenuePrevious) },
      invoices: { value: totalInvoices, trend: this.calculateTrend(invoicesCurrent, invoicesPrevious) },
      orders: { value: await prisma.order.count(), trend: 0 }, // Stubbed
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
