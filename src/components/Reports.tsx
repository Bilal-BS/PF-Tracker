import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, TrendingDown, Calendar, Download, Filter } from 'lucide-react';
import { FinancialSummary, MonthlySummary } from '../types';
import { formatCurrency } from '../utils/calculations';

interface ReportsProps {
  summary: FinancialSummary;
  monthlySummaries: MonthlySummary[];
}

const Reports: React.FC<ReportsProps> = ({ summary, monthlySummaries }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'monthly' | 'categories'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<'3months' | '6months' | '1year' | 'all'>('6months');

  const getFilteredMonthlySummaries = () => {
    const sorted = [...monthlySummaries].sort((a, b) => b.month.localeCompare(a.month));
    
    switch (selectedPeriod) {
      case '3months':
        return sorted.slice(0, 3);
      case '6months':
        return sorted.slice(0, 6);
      case '1year':
        return sorted.slice(0, 12);
      default:
        return sorted;
    }
  };

  const filteredMonthlySummaries = getFilteredMonthlySummaries();
  const totalPeriodIncome = filteredMonthlySummaries.reduce((sum, month) => sum + month.income, 0);
  const totalPeriodExpenses = filteredMonthlySummaries.reduce((sum, month) => sum + month.expenses, 0);
  const averageMonthlyIncome = filteredMonthlySummaries.length > 0 ? totalPeriodIncome / filteredMonthlySummaries.length : 0;
  const averageMonthlyExpenses = filteredMonthlySummaries.length > 0 ? totalPeriodExpenses / filteredMonthlySummaries.length : 0;

  const topExpenseCategories = summary.categorySummaries
    .filter(cat => cat.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const topIncomeCategories = summary.categorySummaries
    .filter(cat => cat.total < 0) // Income categories have negative totals in our system
    .sort((a, b) => a.total - b.total) // Sort by most negative (highest income)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">Financial Reports</h2>
              <p className="text-sm text-gray-600">Analyze your financial patterns and trends</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as typeof selectedPeriod)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              >
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last 12 Months</option>
                <option value="all">All Time</option>
              </select>
            </div>
            
            <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex space-x-1 mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'monthly', label: 'Monthly Trends', icon: TrendingUp },
            { id: 'categories', label: 'Categories', icon: PieChart }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Total Income</p>
                    <p className="text-xl font-bold text-green-800">
                      {formatCurrency(totalPeriodIncome)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-700">Total Expenses</p>
                    <p className="text-xl font-bold text-red-800">
                      {formatCurrency(totalPeriodExpenses)}
                    </p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-red-600" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Avg Monthly Income</p>
                    <p className="text-xl font-bold text-blue-800">
                      {formatCurrency(averageMonthlyIncome)}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Avg Monthly Expenses</p>
                    <p className="text-xl font-bold text-purple-800">
                      {formatCurrency(averageMonthlyExpenses)}
                    </p>
                  </div>
                  <PieChart className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Savings Rate */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Savings Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {summary.savingsRate.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">Savings Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(summary.totalSavings)}
                  </p>
                  <p className="text-sm text-gray-600">Total Savings</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(summary.monthlyAverage)}
                  </p>
                  <p className="text-sm text-gray-600">Monthly Average</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Monthly Trends Tab */}
        {activeTab === 'monthly' && (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Performance</h3>
                <div className="space-y-3">
                  {filteredMonthlySummaries.map((month, index) => {
                    const maxAmount = Math.max(
                      ...filteredMonthlySummaries.map(m => Math.max(m.income, m.expenses))
                    );
                    
                    return (
                      <div key={month.month} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-800">
                            {new Date(month.month + '-01').toLocaleDateString('en-US', { 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </h4>
                          <span className={`font-bold ${month.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(month.balance)}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-green-600">Income</span>
                            <span className="font-medium">{formatCurrency(month.income)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(month.income / maxAmount) * 100}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-red-600">Expenses</span>
                            <span className="font-medium">{formatCurrency(month.expenses)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(month.expenses / maxAmount) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Expense Categories */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Expense Categories</h3>
                <div className="space-y-3">
                  {topExpenseCategories.map((category, index) => {
                    const maxExpense = topExpenseCategories[0]?.total || 1;
                    const percentage = (category.total / maxExpense) * 100;
                    
                    return (
                      <div key={category.category} className="p-3 bg-red-50 rounded-lg border border-red-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-800">{category.category}</span>
                          <span className="font-bold text-red-600">{formatCurrency(category.total)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>{category.transactions} transactions</span>
                          <span>{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-red-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Income Categories */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Income Categories</h3>
                <div className="space-y-3">
                  {topIncomeCategories.map((category, index) => {
                    const maxIncome = Math.abs(topIncomeCategories[0]?.total || 1);
                    const percentage = (Math.abs(category.total) / maxIncome) * 100;
                    
                    return (
                      <div key={category.category} className="p-3 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-800">{category.category}</span>
                          <span className="font-bold text-green-600">{formatCurrency(Math.abs(category.total))}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>{category.transactions} transactions</span>
                          <span>{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-green-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Category Summary */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-800">{summary.categorySummaries.length}</p>
                  <p className="text-sm text-gray-600">Total Categories</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{topExpenseCategories.length}</p>
                  <p className="text-sm text-gray-600">Expense Categories</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{topIncomeCategories.length}</p>
                  <p className="text-sm text-gray-600">Income Categories</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;