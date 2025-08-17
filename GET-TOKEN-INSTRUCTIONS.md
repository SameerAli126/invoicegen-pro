# 🔑 How to Get Your JWT Token for Business Simulation

## 📋 **Step-by-Step Instructions:**

### **1. Open Your Browser Developer Tools**
- Open your InvoiceGen Pro app in the browser (`http://localhost:3000`)
- Make sure you're logged in
- Press `F12` or right-click and select "Inspect Element"

### **2. Navigate to Application/Storage Tab**
- In the developer tools, click on the **"Application"** tab (Chrome/Edge)
- Or click on the **"Storage"** tab (Firefox)

### **3. Find Local Storage**
- In the left sidebar, expand **"Local Storage"**
- Click on **"http://localhost:3000"**

### **4. Copy Your Token**
- Look for a key named **"token"**
- Click on it to select the value
- Copy the entire token value (it's a long string starting with "eyJ...")

### **5. Update the Simulation Script**
- Open the file: `invoicegen-pro/backend/simulate-business-data.js`
- Find the line: `const YOUR_TOKEN = 'YOUR_JWT_TOKEN_HERE';`
- Replace `'YOUR_JWT_TOKEN_HERE'` with your actual token (keep the quotes)
- Save the file

### **6. Run the Business Simulation**
```bash
cd invoicegen-pro/backend
node simulate-business-data.js
```

---

## 🎯 **What the Simulation Will Create:**

### **5 Professional Clients:**
1. **TechCorp Industries** - Enterprise client (Michael Chen)
2. **StartupXYZ** - Fast-growing startup (Emma Rodriguez)
3. **Wilson's Bakery** - Small local business (David Wilson)
4. **Thompson Photography** - Fellow freelancer (Lisa Thompson)
5. **Community Help Foundation** - Non-profit (Robert Garcia)

### **5 Realistic Invoices:**
1. **$10,600** - E-commerce website for TechCorp
2. **$2,300** - Landing page for StartupXYZ
3. **$4,300** - Website redesign for Wilson's Bakery
4. **$2,800** - Portfolio site for Thompson Photography
5. **$2,300** - Non-profit website for Community Help

### **Business Workflow Simulation:**
- All invoices sent
- 4 out of 5 invoices marked as paid
- 1 invoice left as pending (realistic scenario)
- Client financial statistics updated
- Payment patterns established

---

## 🚀 **After Running the Simulation:**

### **Your Dashboard Will Show:**
- **Total Revenue:** ~$22,000+
- **Payment Rate:** 80% (4 of 5 paid)
- **Average Invoice:** ~$4,400
- **5 Active Clients** with complete profiles

### **You Can Test:**
- **Client Management:** View all 5 clients with health scores
- **Invoice Filtering:** Filter by status, search by client
- **Business Analytics:** Real revenue and payment insights
- **Workflow:** See the complete invoice lifecycle

---

## 🔧 **Troubleshooting:**

### **If you get "Authentication failed":**
- Make sure you're logged into the app
- Get a fresh token from browser localStorage
- Ensure the token is copied completely

### **If you get "Client already exists":**
- This is normal if you've run the script before
- The script will skip existing clients and continue

### **If you get network errors:**
- Make sure your backend is running on port 5001
- Check that your frontend is running on port 3000

---

## 📱 **Quick Token Copy Method:**

**In Browser Console (F12 → Console tab):**
```javascript
console.log(localStorage.getItem('token'));
```
This will print your token in the console for easy copying.

---

**🎉 Once you run this simulation, your app will be populated with realistic business data that demonstrates all the features professionally!**
