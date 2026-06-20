# Go Business Referral Dashboard

This project was built as part of the Go Business Frontend Assessment.

The application allows users to log in, view referral statistics, search and sort referrals, and open a detailed page for each referral. Authentication is handled using a JWT token stored in cookies, and protected routes prevent unauthenticated access.

## Features

- User authentication
- Protected dashboard
- Overview metrics
- Service summary
- Referral link and referral code with copy functionality
- Search referrals by name or service
- Sort referrals by date
- Client-side pagination
- Individual referral details page
- Custom 404 page

## Tech Stack

- React
- React Router
- Vite
- js-cookie
- Plain CSS

## Running the Project

Clone the repository and install the dependencies.

```bash
npm install
```

Start the development server.

```bash
npm run dev
```

Create a production build.

```bash
npm run build
```

## Login Credentials

```
Email: admin@example.com
Password: admin123
```

## Project Structure

```
src
 ├── components
 │     └── Navbar.jsx
 ├── pages
 │     ├── LoginPage.jsx
 │     ├── DashboardPage.jsx
 │     ├── ReferralDetailPage.jsx
 │     └── NotFoundPage.jsx
 ├── App.jsx
 ├── main.jsx
 └── index.css
```

## Notes

I tried to keep the implementation simple and follow the assessment requirements as closely as possible. The referral table supports searching, sorting, and client-side pagination, while the detail page fetches information for a single referral using the provided API.

## Deployment

Vercel:
```
<your-vercel-link>
```