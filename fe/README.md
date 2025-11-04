# Frontend - Website Hỗ Trợ Dạy Học Toán THCS

This folder contains both **Client** (student-facing) and **Admin** (teacher/admin-facing) frontend applications built with React and Vite.

## 📁 Project Structure

```
fe/
├── client/           # Student-facing application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── index.css      # Global styles with CSS variables
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json
│
└── admin/            # Admin dashboard application
    ├── src/
    │   ├── pages/         # Admin pages
    │   ├── index.css      # Global styles
    │   ├── App.jsx        # Main app component
    │   └── main.jsx       # Entry point
    └── package.json
```

## 🎨 Design System

### Color Palette (Educational-Friendly)

The color scheme is designed to be **calming and not too flashy**, suitable for an educational environment:

- **Primary (Blue)**: `#4A90E2` - Calming and professional
- **Success (Green)**: `#10B981` - Completed lessons
- **Warning (Orange)**: `#F59E0B` - In-progress lessons
- **Error (Red)**: `#EF4444` - Difficult lessons
- **Neutral Grays**: Various shades for text and backgrounds

### Components

#### Client Application

1. **Header**
   - Logo and site title
   - Search functionality
   - User dropdown menu with navigation links

2. **Hero Banner**
   - Welcome message with gradient background
   - Responsive design for all screen sizes

3. **Quick Stats**
   - Display total lessons, completed lessons, and average score
   - Card-based layout with hover effects

4. **Filter Bar**
   - Grade filters (Lớp 6, 7, 8, 9)
   - Status filters (All, In Progress, Completed, Not Started)
   - Search input with real-time filtering
   - Sort dropdown

5. **Lesson Cards**
   - Thumbnail image with hover overlay
   - Lesson title, grade, and duration
   - Star rating and review count
   - Difficulty badge (Easy/Medium/Hard)
   - Progress bar with dots visualization
   - CTA button (Start/Continue/Review)

6. **Lessons Grid**
   - Responsive grid layout (3 columns → 2 columns → 1 column)
   - Skeleton loading states
   - Empty state with helpful message
   - Load more functionality

7. **Footer**
   - Copyright information
   - School name

#### Admin Application

1. **Admin Dashboard**
   - Sidebar navigation
   - Statistics overview
   - Quick actions
   - Recent activity feed
   - Responsive design with mobile-friendly navigation

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation & Running

#### Client Application

```bash
cd fe/client
npm install
npm run dev
```

The client app will be available at `http://localhost:5173`

#### Admin Application

```bash
cd fe/admin
npm install
npm run dev
```

The admin app will be available at `http://localhost:5173`

**Note**: Only run one application at a time, or configure different ports.

### Building for Production

#### Client

```bash
cd fe/client
npm run build
```

#### Admin

```bash
cd fe/admin
npm run build
```

The production-ready files will be in the `dist/` folder.

## 📱 Responsive Design

Both applications are fully responsive with breakpoints:

- **Desktop**: > 1280px (3-column grid)
- **Tablet**: 768px - 1280px (2-column grid)
- **Mobile**: < 768px (1-column grid, simplified navigation)

### Mobile Features

- Bottom navigation bar
- Collapsible filters
- Touch-friendly interactions
- Optimized card layouts

## 🎯 Features

### Client Features

- ✅ Browse lessons by grade level
- ✅ Filter lessons by status (not started, in progress, completed)
- ✅ Search lessons by title
- ✅ Sort lessons (newest, popular, highest rated, A-Z, progress)
- ✅ View lesson details (rating, difficulty, duration)
- ✅ Track learning progress with visual indicators
- ✅ Responsive design for all devices
- ✅ Smooth animations and transitions
- ✅ Loading states with skeleton screens
- ✅ Empty states with helpful messages

### Admin Features

- ✅ Dashboard with statistics overview
- ✅ Quick action buttons
- ✅ Recent activity feed
- ✅ Sidebar navigation
- ✅ Responsive design
- 🔄 Lesson management (to be implemented)
- 🔄 Student management (to be implemented)
- 🔄 Results tracking (to be implemented)

## 🔧 Technology Stack

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: CSS with CSS Variables
- **Icons**: Unicode emojis (no external icon library needed)

## 🎨 CSS Architecture

### Global Styles (`index.css`)

- CSS Custom Properties (variables) for colors, spacing, shadows
- Reset and base styles
- Utility classes
- Animation keyframes (shimmer, spin)
- Responsive breakpoints
- Custom scrollbar styling

### Component Styles

Each component has its own CSS file following BEM-like naming conventions:
- Clear component-specific class names
- No global scope pollution
- Easy to maintain and update

## 🔄 Future Enhancements

### Client
- [ ] Connect to backend API
- [ ] User authentication and authorization
- [ ] Real-time lesson progress sync
- [ ] Interactive lesson content viewer
- [ ] Quiz and test taking interface
- [ ] Video player integration
- [ ] Downloadable materials
- [ ] Dark mode toggle
- [ ] Accessibility improvements

### Admin
- [ ] Full CRUD operations for lessons
- [ ] Student management interface
- [ ] Results and analytics dashboard
- [ ] Content editor for lessons
- [ ] File upload functionality
- [ ] Bulk operations
- [ ] Report generation
- [ ] Settings management

## 📝 Mock Data

The application currently uses mock data for demonstration. Lesson data includes:

```javascript
{
  id: number,
  title: string,
  thumbnail: string,
  grade: number,
  duration: number,
  rating: number,
  reviewCount: number,
  difficulty: 'easy' | 'medium' | 'hard',
  progress: number (0-100),
  slug: string
}
```

## 🤝 Contributing

When adding new features:

1. Follow the existing component structure
2. Use CSS variables for colors and spacing
3. Ensure responsive design
4. Add loading and empty states
5. Test on different screen sizes
6. Keep the educational theme (not too flashy)

## 📄 License

© 2025 - Website dạy học Toán - Trường THCS Như Quỳnh
