# 💰 Expense Tracker

[Expense Tracker Preview](https://ghoosted-jpg.github.io/ExpenseTracker-React/)  

A **simple yet powerful expense tracking web app** built with **React**, **Tailwind CSS**, and **Recharts**. Easily manage your daily expenses, view spending trends, and visualize category breakdowns — all without needing a backend!

---

## 📷 Preview (Coming Soon)

![Expense Tracker Screenshot](https://via.placeholder.com/800x400?text=Preview+Coming+Soon)

> 🔁 Want to see how it looks live?  
👉 [Live Demo](https://your-username.github.io/expense-tracker/) *(currently under construction)*

---

## ✨ Features

✅ Add, edit, and delete expenses  
✅ Filter by category and date range  
✅ View total amount spent  
✅ Visualize spending with charts:
- Pie Chart: Category-wise breakdown
- Bar Chart: Monthly trend (last 6 months)  
✅ Data persistence using `localStorage`  
✅ Fully responsive design (mobile + desktop friendly)  
✅ Smooth animations and modern UI

---

## 🛠 Technologies Used

| Tech | Description |
|------|-------------|
| **React** | Frontend framework |
| **Tailwind CSS** | Utility-first styling system |
| **Recharts** | Declarative charting library |
| **Lucide Icons** | Beautiful SVG icons |
| **LocalStorage** | Client-side data persistence |

---

## 🧩 Core Functionalities

| Feature | Description |
|--------|-------------|
| **Add Expense** | Add new transactions with title, amount, category, date, and optional notes |
| **Edit/Delete** | Modify or remove existing entries |
| **Filtering** | Filter expenses by category and custom date range |
| **Summary Dashboard** | See your total spending, number of transactions, and monthly trends |
| **Category Breakdown** | Pie chart showing where most of your money goes |
| **Monthly Trend** | Bar chart displaying monthly expense patterns |

---

## 📦 Folder Structure

```
expense-tracker/
│
├── public/
│   └── index.html
│
├── src/
│   ├── App.js
│   ├── index.js
│   └── components/ (optional)
│
├── package.json
├── README.md
└── tailwind.config.js
```

---

## 🚀 How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 How to Deploy on GitHub Pages

### 1. Install `gh-pages`
```bash
npm install gh-pages --save-dev
```

### 2. Update `package.json`
Add these lines:

```json
{
  "homepage": "https://your-username.github.io/expense-tracker",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

### 3. Deploy to GitHub Pages
```bash
npm run deploy
```

Your site will be available at:
```
https://your-username.github.io/expense-tracker
```

---

## 📋 How to Use

1. Click **"Add Expense"** to add a new transaction.
2. Use the **filters** to narrow down your view.
3. Switch to the **Summary tab** to see:
   - Total expenses
   - Spending breakdown by category
   - Monthly trends

---

## 📊 Charts Used

| Chart Type | Purpose |
|-----------|---------|
| **Pie Chart** | Visualizes how much you've spent in each category |
| **Bar Chart** | Shows monthly expense trends (last 6 months) |

Built using [Recharts](https://recharts.org), a powerful and flexible charting library for React.

---

## 🧪 Bonus Ideas (Optional Future Work)

- ✅ Export expenses to CSV/Excel  
- 🔐 Add user login/authentication  
- 💵 Budget tracking feature  
- 🌙 Dark mode toggle  
- ☁️ Connect to Firebase or Supabase for cloud storage

---

## 📄 License

MIT License – feel free to use and modify this code however you'd like.

---

## 📬 Feedback

If you have any questions, suggestions, or want to contribute, feel free to open an issue or reach out!

---

## 👨‍💻 Author

👤 **Your Name**  
📧 your.email@example.com  
🔗 [GitHub Profile](https://github.com/your-username)  
💼 [LinkedIn Profile](https://linkedin.com/in/your-profile)

---

## 🎯 Acknowledgements

This project was created as part of a technical assessment for **Innovaxel Internship Program**. Thank you for the opportunity!

---

## 🙌 Contributing

Contributions are welcome! Feel free to fork, improve, or enhance the app and submit a PR.

---

Let me know if you’d like me to generate a ZIP file with this README included, or help you host it online via Vercel or Netlify.

Would you like that? 😊
