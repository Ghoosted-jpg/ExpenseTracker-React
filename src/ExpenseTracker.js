import React, { useState, useEffect, useMemo } from 'react';
import { PlusCircle, Edit3, Trash2, DollarSign, Calendar, Filter, X, Save, TrendingUp, PieChart } from 'lucide-react';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Pie } from 'recharts';

const ExpenseTracker = () => {
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [expenses, setExpenses] = useState(() => {
        try {
            const saved = localStorage.getItem('expenses');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Failed to load expenses from localStorage", error);
            return [];
        }
    });
    const [showForm, setShowForm] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [activeTab, setActiveTab] = useState('expenses');
    const [filters, setFilters] = useState({
        category: '',
        dateFrom: '',
        dateTo: '',
        showFilters: false
    });

    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });

        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    const categories = ['Food', 'Transportation', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Education', 'Other'];
    const categoryColors = {
        Food: '#ff6b6b',
        Transportation: '#4ecdc4',
        Utilities: '#45b7d1',
        Entertainment: '#96ceb4',
        Healthcare: '#feca57',
        Shopping: '#ff9ff3',
        Education: '#54a0ff',
        Other: '#5f27cd'
    };

    // Load expenses from memory on component mount
    useEffect(() => {
        const savedExpenses = JSON.parse(localStorage?.getItem('expenses') || '[]');
        setExpenses(savedExpenses);
    }, []);

    // Save expenses to memory whenever expenses change
    useEffect(() => {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('expenses', JSON.stringify(expenses));
        }
    }, [expenses]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Input validation
        if (!formData.title.trim() && !formData.amount && parseFloat(formData.amount) <= 0) {
            alert('Please fill in all required fields with valid values');
            return;
        }

        if (!formData.title.trim()) {
            alert("Please enter a title");
            return;
        }

        if ((!formData.amount) || parseFloat(formData.amount) <= 0) {
            alert("Amount must be Positive.");
            return;
        }

        const expenseData = {
            ...formData,
            amount: parseFloat(formData.amount),
            id: editingExpense ? editingExpense.id : Date.now()
        };

        if (editingExpense) {
            setExpenses(expenses.map(exp => exp.id === editingExpense.id ? expenseData : exp));
            showNotification('Expense updated successfully!', 'success');
        } else {
            setExpenses([...expenses, expenseData]);
            showNotification('Expense added successfully!', 'success');
        }

        // Reset form
        setFormData({
            title: '',
            amount: '',
            category: 'Food',
            date: new Date().toISOString().split('T')[0],
            notes: ''
        });
        setShowForm(false);
        setEditingExpense(null);
    };

    const handleEdit = (expense) => {
        setFormData(expense);
        setEditingExpense(expense);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        const userConfirmed = window.confirm('Are you sure you want to delete this expense?');
        if (userConfirmed) {
            setExpenses(expenses.filter(exp => exp.id !== id));
            // In handleDelete
            setExpenses(expenses.filter(exp => exp.id !== id));
            showNotification('Expense deleted successfully!', 'success');
        }
    };

    const filteredExpenses = useMemo(() => {
        return expenses
            .filter(expense => {
                if (filters.category && expense.category !== filters.category) return false;
                if (filters.dateFrom && expense.date < filters.dateFrom) return false;
                if (filters.dateTo && expense.date > filters.dateTo) return false;
                return true;
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [expenses, filters]);

    const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    const categoryBreakdown = useMemo(() => {
        const breakdown = {};
        filteredExpenses.forEach(expense => {
            breakdown[expense.category] = (breakdown[expense.category] || 0) + expense.amount;
        });
        return Object.entries(breakdown).map(([category, amount]) => ({
            name: category,
            value: amount,
            color: categoryColors[category]
        }));
    }, [filteredExpenses]);

    const monthlyData = useMemo(() => {
        const monthly = {};
        filteredExpenses.forEach(expense => {
            const month = expense.date.substring(0, 7);
            monthly[month] = (monthly[month] || 0) + expense.amount;
        });
        return Object.entries(monthly)
            .map(([month, amount]) => ({ month, amount }))
            .sort((a, b) => a.month.localeCompare(b.month))
            .slice(-6);
    }, [filteredExpenses]);


    return (

        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">

            <div className="container mx-auto p-4 max-w-6xl">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-white/20 backdrop-blur-sm">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                        <DollarSign className="text-green-500" />
                        Expense Tracker
                    </h1>
                    <p className="text-gray-600">Track your spending and visualize your financial habits</p>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-2 mb-6">
                    {[
                        { id: 'expenses', label: 'Expenses', icon: Calendar },
                        { id: 'summary', label: 'Summary', icon: TrendingUp }
                    ].map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                                    : 'bg-white text-gray-600 hover:bg-blue-50 shadow-md hover:shadow-lg'
                                    }`}
                            >
                                <Icon size={20} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {activeTab === 'expenses' && (
                    <div className="space-y-6">
                        {/* Add Expense Button and Filters */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <PlusCircle size={20} />
                                Add Expense
                            </button>

                            <button
                                onClick={() => setFilters(prev => ({ ...prev, showFilters: !prev.showFilters }))}
                                className="bg-white text-gray-700 px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg border"
                            >
                                <Filter size={20} />
                                Filters
                            </button>
                        </div>

                        {/* Filter Panel */}
                        {filters.showFilters && (
                            <div className="bg-white rounded-xl p-6 shadow-lg border animate-in slide-in-from-top-2 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                        <select
                                            value={filters.category}
                                            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">All Categories</option>
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                                        <input
                                            type="date"
                                            value={filters.dateFrom}
                                            onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                                        <input
                                            type="date"
                                            value={filters.dateTo}
                                            onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => setFilters({ category: '', dateFrom: '', dateTo: '', showFilters: false })}
                                    className="mt-4 text-blue-500 hover:text-blue-700 font-medium"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}

                        {/* Total Amount Display */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-6 shadow-xl">
                            <h2 className="text-2xl font-bold mb-2">Total Expenses</h2>
                            <p className="text-4xl font-bold">${totalAmount.toFixed(2)}</p>
                            <p className="text-blue-100 mt-2">{filteredExpenses.length} transactions</p>
                        </div>

                        {/* Expense Form Modal */}
                        {showForm && (
                            <div className="fixed inset-0 -top-6 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                                <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-800 text-center">
                                            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
                                        </h2>
                                        <button
                                            onClick={() => {
                                                setShowForm(false);
                                                setEditingExpense(null);
                                                setFormData({
                                                    title: '',
                                                    amount: '',
                                                    category: 'Food',
                                                    date: new Date().toISOString().split('T')[0],
                                                    notes: ''
                                                });
                                            }}
                                            className="text-gray-500 hover:text-gray-700 transition-colors"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="e.g., Dinner with friends"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                                            <input
                                                type="number"
                                                value={formData.amount}
                                                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                                required
                                                title='Value Should be 0 or Above'
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                            <input
                                                type="date"
                                                value={formData.date}
                                                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                                            <textarea
                                                value={formData.notes}
                                                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                rows="3"
                                                placeholder="Optional notes..."
                                            />
                                        </div>

                                        <button
                                            onClick={handleSubmit}
                                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                                            type='submit'
                                        >
                                            <Save size={20} />
                                            {editingExpense ? 'Update Expense' : 'Add Expense'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Expenses List */}
                        <div className="space-y-4">
                            {filteredExpenses.length === 0 ? (
                                <div className="bg-white rounded-xl p-12 text-center shadow-lg">
                                    <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No expenses found</h3>
                                    <p className="text-gray-500">Add your first expense to get started!</p>
                                </div>
                            ) : (
                                filteredExpenses.map(expense => (
                                    <div
                                        key={expense.id}
                                        className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 animate-in slide-in-from-bottom-2"
                                    >
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div
                                                        className="w-4 h-4 rounded-full"
                                                        style={{ backgroundColor: categoryColors[expense.category] }}
                                                    />
                                                    <h3 className="text-xl font-semibold text-gray-800">{expense.title}</h3>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <DollarSign size={16} />
                                                        ${expense.amount.toFixed(2)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={16} />
                                                        {new Date(expense.date).toLocaleDateString()}
                                                    </span>
                                                    <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium">
                                                        {expense.category}
                                                    </span>
                                                </div>
                                                {expense.notes && (
                                                    <p className="text-gray-600 mt-2 text-sm">{expense.notes}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(expense)}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(expense.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'summary' && (
                    <div className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-xl">
                                <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
                                <p className="text-3xl font-bold">${totalAmount.toFixed(2)}</p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl p-6 shadow-xl">
                                <h3 className="text-lg font-semibold mb-2">Transactions</h3>
                                <p className="text-3xl font-bold">{filteredExpenses.length}</p>
                            </div>
                            <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl p-6 shadow-xl">
                                <h3 className="text-lg font-semibold mb-2">Categories</h3>
                                <p className="text-3xl font-bold">{categoryBreakdown.length}</p>
                            </div>
                        </div>

                        {/* Charts */}
                        {categoryBreakdown.length > 0 && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Pie Chart */}
                                <div className="bg-white rounded-2xl p-6 shadow-xl">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <PieChart size={24} />
                                        Category Breakdown
                                    </h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <RechartsPieChart>
                                            <Pie
                                                data={categoryBreakdown}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                dataKey="value"
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {categoryBreakdown.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Monthly Trend */}
                                <div className="bg-white rounded-2xl p-6 shadow-xl">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <TrendingUp size={24} />
                                        Monthly Expense
                                    </h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={monthlyData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
                                            <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* Category Details */}
                        {categoryBreakdown.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 shadow-xl">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Category Details</h3>
                                <div className="space-y-3">
                                    {categoryBreakdown
                                        .sort((a, b) => b.value - a.value)
                                        .map(category => (
                                            <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-4 h-4 rounded-full"
                                                        style={{ backgroundColor: category.color }}
                                                    />
                                                    <span className="font-medium text-gray-800">{category.name}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-bold text-gray-800">${category.value.toFixed(2)}</span>
                                                    <div className="text-sm text-gray-600">
                                                        {((category.value / totalAmount) * 100).toFixed(1)}%
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {notification.show && (
                <div
                    className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white max-w-xs transition-opacity duration-300 ease-in-out z-50
          ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}
        `}
                >
                    <div className="flex items-center gap-2">
                        {notification.type === 'success' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                        <span>{notification.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpenseTracker;