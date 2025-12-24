<!DOCTYPE html>
<html lang="en">
<head>
  <base target="_blank">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FinanceTracker Pro - Personal Finance Management</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; }
    .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .card-hover { transition: all 0.3s ease; }
    .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
    .progress-bar { transition: width 1s ease-in-out; }
  </style>
</head>
<body>
  <div id="root"></div>
  
  <script type="text/babel">
    const { useState, useEffect } = React;
    
    const FinanceTracker = () => {
      const [activeTab, setActiveTab] = useState('dashboard');
      const [totalBalance, setTotalBalance] = useState(12547.83);
      const [monthlyIncome, setMonthlyIncome] = useState(5200);
      const [monthlyExpenses, setMonthlyExpenses] = useState(3654.21);
      const [transactions, setTransactions] = useState([
        { id: 1, type: 'income', amount: 2500, description: 'Salary', date: '2025-01-15', category: 'Work' },
        { id: 2, type: 'expense', amount: 1200, description: 'Rent', date: '2025-01-14', category: 'Housing' },
        { id: 3, type: 'expense', amount: 350, description: 'Groceries', date: '2025-01-13', category: 'Food' },
        { id: 4, type: 'income', amount: 500, description: 'Freelance', date: '2025-01-12', category: 'Work' },
        { id: 5, type: 'expense', amount: 80, description: 'Gas', date: '2025-01-11', category: 'Transportation' }
      ]);
      const [budgets, setBudgets] = useState([
        { category: 'Food', allocated: 800, spent: 350, color: 'bg-blue-500' },
        { category: 'Transportation', allocated: 300, spent: 180, color: 'bg-green-500' },
        { category: 'Entertainment', allocated: 400, spent: 245, color: 'bg-purple-500' },
        { category: 'Shopping', allocated: 500, spent: 320, color: 'bg-red-500' },
        { category: 'Utilities', allocated: 250, spent: 195, color: 'bg-yellow-500' }
      ]);

      const [newTransaction, setNewTransaction] = useState({
        type: 'expense',
        amount: '',
        description: '',
        category: 'Food'
      });

      const savings = monthlyIncome - monthlyExpenses;
      const savingsRate = ((savings / monthlyIncome) * 100).toFixed(1);

      const addTransaction = () => {
        if (newTransaction.amount && newTransaction.description) {
          const transaction = {
            id: Date.now(),
            ...newTransaction,
            amount: parseFloat(newTransaction.amount),
            date: new Date().toISOString().split('T')[0]
          };
          setTransactions([transaction, ...transactions]);
          setNewTransaction({ type: 'expense', amount: '', description: '', category: 'Food' });
          
          if (transaction.type === 'income') {
            setTotalBalance(totalBalance + transaction.amount);
          } else {
            setTotalBalance(totalBalance - transaction.amount);
          }
        }
      };

      const expensesByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {});

      const StatCard = ({ title, amount, subtitle, color, icon }) => (
        <div className={`${color} rounded-xl p-6 text-white card-hover`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">{title}</p>
              <p className="text-2xl font-bold mt-1">${amount.toLocaleString()}</p>
              {subtitle && <p className="text-white/70 text-xs mt-1">{subtitle}</p>}
            </div>
            <div className="text-white/80">
              {icon}
            </div>
          </div>
        </div>
      );

      const TransactionItem = ({ transaction }) => (
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {transaction.type === 'income' ? 
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/></svg> :
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/></svg>
              }
            </div>
            <div>
              <p className="font-medium text-gray-900">{transaction.description}</p>
              <p className="text-sm text-gray-500">{transaction.category} • {transaction.date}</p>
            </div>
          </div>
          <p className={`font-semibold ${
            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
          }`}>
            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
          </p>
        </div>
      );

      const BudgetItem = ({ budget }) => {
        const percentage = (budget.spent / budget.allocated) * 100;
        const isOverBudget = percentage > 100;
        
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">{budget.category}</h3>
              <span className={`text-sm font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
                ${budget.spent} / ${budget.allocated}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className={`h-3 rounded-full progress-bar ${isOverBudget ? 'bg-red-500' : budget.color}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
            <p className={`text-sm ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
              {percentage.toFixed(1)}% used {isOverBudget && '(Over budget!)'}
            </p>
          </div>
        );
      };

      const renderDashboard = () => (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Balance" 
              amount={totalBalance} 
              subtitle={`+${savingsRate}% this month`}
              color="gradient-bg"
              icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/></svg>}
            />
            <StatCard 
              title="Monthly Income" 
              amount={monthlyIncome} 
              color="bg-green-500"
              icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>}
            />
            <StatCard 
              title="Monthly Expenses" 
              amount={monthlyExpenses} 
              color="bg-red-500"
              icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/></svg>}
            />
            <StatCard 
              title="Monthly Savings" 
              amount={savings} 
              subtitle={`${savingsRate}% of income`}
              color="bg-blue-500"
              icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/></svg>}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Transactions</h2>
              <div className="space-y-4">
                {transactions.slice(0, 5).map(transaction => (
                  <TransactionItem key={transaction.id} transaction={transaction} />
                ))}
              </div>
              <button 
                onClick={() => setActiveTab('transactions')}
                className="w-full mt-4 text-center text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All Transactions
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Budget Overview</h2>
              <div className="space-y-4">
                {budgets.slice(0, 3).map(budget => (
                  <BudgetItem key={budget.category} budget={budget} />
                ))}
              </div>
              <button 
                onClick={() => setActiveTab('budgets')}
                className="w-full mt-4 text-center text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All Budgets
              </button>
            </div>
          </div>
        </div>
      );

      const renderTransactions = () => (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Transaction</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <select 
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <input 
                type="number"
                placeholder="Amount"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input 
                type="text"
                placeholder="Description"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select 
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Food">Food</option>
                <option value="Transportation">Transportation</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Shopping">Shopping</option>
                <option value="Utilities">Utilities</option>
                <option value="Work">Work</option>
                <option value="Housing">Housing</option>
              </select>
              <button 
                onClick={addTransaction}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Add Transaction
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">All Transactions</h2>
            <div className="space-y-4">
              {transactions.map(transaction => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
          </div>
        </div>
      );

      const renderBudgets = () => (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Budget Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map(budget => (
                <BudgetItem key={budget.category} budget={budget} />
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Spending by Category</h2>
            <div className="space-y-4">
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <span className="font-medium text-gray-900">{category}</span>
                  <span className="text-red-600 font-semibold">${amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

      const renderAnalytics = () => (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Income vs Expenses</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Income</span>
                  <span className="font-semibold text-green-600">${monthlyIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expenses</span>
                  <span className="font-semibold text-red-600">${monthlyExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-900 font-medium">Net Savings</span>
                  <span className="font-bold text-blue-600">${savings.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Rate</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{savingsRate}%</div>
                <p className="text-gray-600">of income saved</p>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full progress-bar"
                    style={{ width: `${Math.min(parseFloat(savingsRate), 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Health</h3>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {savingsRate > 20 ? 'Excellent' : savingsRate > 10 ? 'Good' : 'Needs Improvement'}
                </div>
                <p className="text-gray-600 text-sm">
                  {savingsRate > 20 ? 'Great job saving!' : savingsRate > 10 ? 'On the right track' : 'Consider reducing expenses'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Expense Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(expensesByCategory).map(([category, amount]) => {
                const percentage = ((amount / monthlyExpenses) * 100).toFixed(1);
                return (
                  <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{category}</p>
                      <p className="text-sm text-gray-600">{percentage}% of expenses</p>
                    </div>
                    <p className="font-bold text-gray-900">${amount.toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );

      return (
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                      </svg>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">FinanceTracker Pro</h1>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Welcome back, John!</span>
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </header>

          {/* Navigation */}
          <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex space-x-8">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                  { id: 'transactions', label: 'Transactions', icon: '💰' },
                  { id: 'budgets', label: 'Budgets', icon: '📋' },
                  { id: 'analytics', label: 'Analytics', icon: '📈' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'transactions' && renderTransactions()}
            {activeTab === 'budgets' && renderBudgets()}
            {activeTab === 'analytics' && renderAnalytics()}
          </main>

          {/* Footer */}
          <footer className="bg-gray-900 text-white border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold">FinanceTracker Pro</h3>
                  </div>
                  <p className="text-gray-400 mb-4">
                    Take control of your financial future with our comprehensive personal finance management platform. 
                    Track expenses, manage budgets, and achieve your financial goals.
                  </p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                        <circle cx="4" cy="4" r="2"/>
                      </svg>
                    </a>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-4">Product</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-4">Company</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2025 FinanceTracker Pro. All rights reserved. Built with React and Tailwind CSS.</p>
              </div>
            </div>
          </footer>
        </div>
      );
    };
    
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<FinanceTracker />);
  </script>
</body>
</html>