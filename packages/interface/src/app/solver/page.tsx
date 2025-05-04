import { DashboardHeader } from '@/components/solverDashboard/dashboard-header';
import { DataCards } from '@/components/solverDashboard/data-cards';
import { TransactionHistory } from '@/components/solverDashboard/transaction-history';
import { ActionButtons } from '@/components/solverDashboard/action-buttons';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#050914] text-white">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          <DataCards />
        </div>
        <div className="grid gap-6 md:grid-cols-3 mt-6">
          <div className="md:col-span-2">
            <TransactionHistory />
          </div>
          <div>
            <ActionButtons />
          </div>
        </div>
      </div>
    </div>
  );
}
