# Frontend - Athlete Performance Tracker

## Quick Start

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
```

## Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Pages

### `/login`
- Authentication page
- Default credentials provided

### `/` (Dashboard)
- Overview statistics
- Top 5 athletes preview
- Quick navigation

### `/leaderboard`
- Complete rankings
- Badge display
- Sport filters

### `/athletes` (Coach only)
- Athlete management
- CRUD operations
- Test score input

## Components

### `Layout.js`
- Navigation bar
- User info display
- Logout functionality

### `ProtectedRoute.js`
- Authentication guard
- Role-based access control

## Styling

- **Framework**: Tailwind CSS
- **Responsive**: Mobile-first design
- **Icons**: Emoji-based (no external dependencies)

## API Integration

All API calls are in `utils/api.js`:
- Automatic JWT token attachment
- Centralized error handling
- Local storage for auth state

## Build & Deploy

### Build for production
```bash
npm run build
```

### Deploy to Vercel
```bash
vercel deploy
```

Update `NEXT_PUBLIC_API_URL` to your production backend URL.
