# EduCore CRM Frontend

Professional React frontend for EduCore CRM platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── pages/          # Page components
│   ├── admin/      # Admin dashboard
│   ├── teacher/    # Teacher dashboard
│   ├── student/    # Student dashboard
│   └── auth/       # Authentication pages
├── layouts/        # Layout components
├── contexts/       # React contexts (Auth)
├── stores/         # State management
├── lib/            # API client & utilities
└── routes/         # Route configuration
```

## 🎨 Features

- Modern, responsive UI with Tailwind CSS
- Role-based routing and access control
- Real-time data with React Query
- Professional dashboard designs
- Mobile-friendly interface

## 🔧 Configuration

The frontend automatically connects to the backend running on `http://localhost:3000` via proxy.

To change the backend URL, update `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://your-backend-url:3000',
      changeOrigin: true,
    },
  },
}
```
