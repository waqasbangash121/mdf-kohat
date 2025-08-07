# Dairy Farm Management System

A comprehensive web application for managing dairy farm operations, cattle health, milk production, staff management, and scheduling.

## Features

### 🐄 Cattle Management

- Track individual cattle records (ID, name, breed, age, weight)
- Monitor health status and medical history
- Manage cattle inventory and status (active, pregnant, sick, retired)
- Search and filter cattle by various criteria

### 🥛 Milk Production

- Record daily milk production data
- Track production trends and analytics
- Monitor individual cattle production
- Generate production reports and exports

### 🏥 Health Records

- Maintain comprehensive health records
- Schedule and track vaccinations
- Monitor medical treatments and appointments
- Health alerts and notifications

### 👥 Staff Management

- Manage farm employees and roles
- Track staff schedules and assignments
- Monitor performance and attendance
- Department and role-based organization

### 📅 Schedule Management

- Plan and schedule farm activities
- Manage milking schedules
- Track appointments and health checks
- Calendar view with multiple timeframes

### ⚙️ Settings & Configuration

- Farm information and preferences
- User profile management
- Security settings and 2FA
- Notification preferences
- Data backup and export

## Technology Stack

- **Frontend**: Next.js 15, React 18
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Charts**: Recharts (planned)
- **Date Handling**: date-fns
- **Utilities**: clsx, tailwind-merge

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd dairy-farm-management
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
dairy-farm-management/
├── app/                    # Next.js app directory
│   ├── cattle/            # Cattle management pages
│   ├── milk/              # Milk production pages
│   ├── health/            # Health records pages
│   ├── staff/             # Staff management pages
│   ├── schedule/          # Schedule management pages
│   ├── settings/          # Settings pages
│   ├── globals.css        # Global styles
│   ├── layout.jsx         # Root layout
│   └── page.jsx           # Dashboard
├── components/            # Reusable components
├── public/               # Static assets
├── styles/               # Additional styles
└── package.json          # Dependencies and scripts
```

## Key Components

### Dashboard

- Overview of farm statistics
- Quick actions and recent activity
- Navigation to all major sections

### Cattle Management

- Grid view of all cattle
- Search and filtering capabilities
- Individual cattle detail views

### Milk Production

- Production tracking and analytics
- Individual cattle production records
- Trend analysis and reporting

### Health Records

- Comprehensive health tracking
- Appointment scheduling
- Medical history management

### Staff Management

- Employee records and roles
- Schedule management
- Performance tracking

### Schedule

- Activity scheduling
- Calendar views
- Event management

### Settings

- Farm configuration
- User preferences
- Security settings
- Data management

## Development

### Adding New Features

1. Create new pages in the appropriate directory under `app/`
2. Add navigation items to the main dashboard
3. Implement responsive design using Tailwind CSS
4. Add proper TypeScript types (if using TypeScript)

### Styling Guidelines

- Use Tailwind CSS classes for styling
- Follow the existing color scheme and design patterns
- Ensure responsive design for mobile devices
- Use consistent spacing and typography

### State Management

- Use React hooks for local state management
- Consider implementing global state management for larger features
- Follow React best practices for component structure

## Deployment

### Netlify Deployment

This project is configured for Netlify deployment:

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Deploy automatically on push to main branch

### Environment Variables

Create a `.env.local` file for local development:

```env
# Add any environment variables here
NEXT_PUBLIC_APP_NAME="Dairy Farm Management"
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.
