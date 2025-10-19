# 🧭 ClientHub

**ClientHub** is a lightweight CRM (Customer Relationship Manager) built with  
**ASP.NET Core 8 (C#)** and **React (Vite)**.  
It allows you to manage clients and their interactions in a clean, modern UI.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Backend** | ASP.NET Core 8, Entity Framework Core, SQLite |
| **Frontend** | React 18, Vite, Axios, React Router |
| **Design** | Custom CSS (responsive, mid-tone theme) |
| **Tooling** | Visual Studio 2022, GitHub Desktop |

---

## ✨ Features (Current MVP)

- 📋 **Clients Management**
  - Create new clients
  - List existing clients
  - Simple search (by name/company/email)
- 💬 **Client Interactions**
  - Log calls, emails, and meetings per client
  - Display all interactions in a clean table
- 🧭 **Modern UI**
  - Responsive layout
  - Mid-tone color palette (not too dark or light)
  - Gradient buttons and soft card design
- ⚙️ **Architecture**
  - ASP.NET Core API on port **5183**
  - React frontend (Vite) on port **5173**
  - Axios-based data fetching (`api.js`)

---

## 🧩 Project Structure

```
ClientHub/
├─ ClientHub.Api/             → ASP.NET Core Web API
│  ├─ Controllers/
│  ├─ Models/
│  ├─ Migrations/
│  ├─ Program.cs
│  └─ launchSettings.json
│
├─ ClientHub.React/           → React frontend (Vite)
│  ├─ src/
│  │  ├─ main.jsx
│  │  ├─ styles.css
│  │  ├─ api.js
│  │  └─ pages/
│  │     ├─ Clients.jsx
│  │     └─ ClientDetails.jsx
│  ├─ vite.config.js
│  └─ package.json
│
└─ README.md
```

---

## 🧠 Getting Started (Local Development)

### 1️⃣ Backend – ASP.NET Core
```bash
cd ClientHub.Api
dotnet restore
dotnet ef database update
dotnet run
```
→ The API runs on **http://localhost:5183**

### 2️⃣ Frontend – React (Vite)
```bash
cd ClientHub.React
npm install
npm run dev
```
→ The app runs on **http://localhost:5173**

> ✅ Both projects can be launched together from **Visual Studio**  
> (set multiple startup projects: `ClientHub.Api` + `ClientHub.React`).

---

## 🧪 Next Steps (Planned Improvements)

- ✏️ Edit & Delete clients  
- 🔍 Paging, sorting, and advanced search  
- ✅ Toast notifications for CRUD actions  
- 🧱 DTOs + FluentValidation  
- 🧰 xUnit tests  
- 🔐 JWT Authentication  
- 🐳 Docker setup  

---

## 📸 Preview
  
Example:  
![ClientHub UI Preview](./screenshot.png)

---

## 🧑‍💻 Author

**Dilyana Zheleva**  
Full Stack Developer (C# / React)  
[GitHub Profile](https://github.com/dizheleva)

---

## 📜 License

MIT License © 2025 Dilyana Zheleva  
Free to use and modify for learning and demonstration purposes.