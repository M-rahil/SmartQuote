# SmartQuote

SmartQuote is a full-stack freelance pricing platform that helps freelancers generate market-based project quotations using configurable pricing factors such as skill, experience, project complexity, urgency, and regional market rates.

---

## Features

- User authentication using JWT
- Dynamic pricing engine
- Market-based hourly rate calculation
- Categorized freelance services
- PDF quote generation
- Quote history management
- User profile management
- Responsive user interface
- MongoDB Atlas data persistence

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router
- Recharts

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Helmet
- Express Rate Limit

---

## Project Structure

```
SmartQuote/
│
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

## Pricing Engine

Project estimates are generated using the following parameters:

- Skill / Service
- Experience Level
- Country
- Project Complexity
- Timeline / Urgency
- Market Multiplier
- Overhead Cost
- Profit Margin

---

## Installation

### Clone the repository

```bash
git clone https://github.com/M-rahil/SmartQuote.git
cd SmartQuote
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

### Backend

```env
PORT=5000
MONGODB_URI=
JWT_SECRET=
FRONTEND_URL=
```

### Frontend

```env
VITE_API_URL=
```

---

## Deployment

| Component | Platform |
|----------|----------|
| Frontend | Render |
| Backend | Render |
| Database | MongoDB Atlas |

---

## Live Demo

- **Frontend:** https://smartquote-ksl0.onrender.com
- **Backend API:** https://smartquote-backend-meho.onrender.com/api/health

---

## Future Improvements

- AI-assisted proposal generation
- Multi-currency pricing
- Email quote sharing
- Invoice generation
- Client management
- Team collaboration

---

## Author

**Mohammed Rahil Raza Thanay Nalumasa**

GitHub: https://github.com/M-rahil

---

## License

This project is licensed under the MIT License.
