# HazardReport Admin Dashboard

A comprehensive administrative dashboard for managing hazard reports, built with React, TypeScript, and Vite. This application provides tools for content moderation, user management, announcements, and real-time hazard tracking.

## Features

- **Dashboard**: View key metrics including total reports, active users, and active hazards
- **Hazard Tracking**: Interactive heat map visualization and detailed reports table for Ghana
- **Content Moderation**: Review and manage user-generated content
- **User Management**: Administer user accounts and permissions
- **Announcements**: Create and manage system-wide announcements
- **Settings**: Configure application preferences and admin settings
- **Authentication**: Secure login system with protected routes
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **API Client**: Axios
- **UI Components**: Lucide React, React Icons
- **Notifications**: React Hot Toast
- **Linting**: ESLint with TypeScript support

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Fork the repository on GitHub

2. Clone your forked repository:

```bash
git clone https://github.com/<your-username>/HazardReport-Admin.git
cd HazardReport-Admin
```

1. Install dependencies:

```bash
npm install
```

1. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Available Scripts

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build the project for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## Project Structure

```javascript
src/
├── components/          # Reusable UI components
├── pages/              # Page components for different routes
├── layouts/            # Layout wrappers
├── context/            # Context API for state management
├── services/           # API service layer
├── assets/             # Images and static files
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Development

This project uses:

- TypeScript for type safety
- ESLint for code quality
- Vite for fast development and optimized builds
- Tailwind CSS for utility-first styling

## Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started with Contributing

1. **Fork the repository** on GitHub
2. **Create a feature branch** from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** and test thoroughly
4. **Commit your changes** with clear, descriptive messages:

   ```bash
   git commit -m "Add: brief description of changes"
   ```

5. **Push to your fork** and submit a pull request

### Code Standards

- **TypeScript**: Always use TypeScript for type safety
- **Formatting**: Code is automatically formatted - run `npm run lint` before committing
- **Component Style**: Use functional components with hooks
- **Naming Conventions**: Use PascalCase for components, camelCase for functions/variables
- **Component Structure**: Keep components focused and reusable
- **Props**: Define prop types using TypeScript interfaces

### Pull Request Guidelines

- Provide a clear description of what your PR does
- Reference any related issues using `#issue-number`
- Ensure all tests pass and linting is clean
- Keep PR scope focused - one feature or fix per PR
- Update documentation as needed

### Commit Message Format

```text
Type: Brief description

Detailed explanation of changes (optional)

Resolves: #issue-number (if applicable)
```

**Types**: `Add`, `Fix`, `Update`, `Refactor`, `Remove`, `Docs`

## Development Workflow

### Local Development

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test in the dev server: `npm run dev`
3. Check code quality: `npm run lint`
4. Build locally to verify: `npm run build`
5. Commit and push to your fork
6. Create a pull request

### Best Practices

- Test your changes locally before submitting
- Keep components small and focused on a single responsibility
- Reuse existing components when possible
- Add meaningful comments for complex logic
- Follow the existing code patterns in the project

## Environment Setup

### Environment Variables

Create a `.env.local` file in the root directory (this file is in `.gitignore` and should not be committed):

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_ENV=development
```

### Local Development Checklist

- [ ] Node.js installed (v16+)
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` file configured
- [ ] Development server runs without errors (`npm run dev`)
- [ ] Linting passes (`npm run lint`)

## Issues & Support

### Reporting Bugs

Found a bug? Please open an issue on GitHub with:

- Clear title and description
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots or error logs if applicable
- Your environment (OS, Node version, browser if applicable)

### Feature Requests

Have an idea for improvement? Open an issue with:

- Clear description of the feature
- Use case and benefits
- Possible implementation approach (optional)

### Getting Help

- Check existing issues and discussions for similar questions
- Review the project documentation
- Ask in an issue with the `question` label

## License

See the [LICENSE](LICENSE) file for details.
