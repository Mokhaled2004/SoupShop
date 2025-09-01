# Soup Shop Frontend

This is the frontend application for the Soup Shop, a web application for ordering delicious soups online.

## Features

- Browse soups by category
- View detailed information about each soup
- Add soups to shopping cart
- Manage cart items (update quantity, remove items)
- User authentication (login/register)
- Checkout process
- Order history
- Order details

## Technologies Used

- React 18
- TypeScript
- React Router v6
- React Query
- Styled Components
- Axios
- Vite

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```
   cd frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```

### Running the Application

To start the development server:

```
npm run dev
```
or
```
yarn dev
```

The application will be available at http://localhost:3000

### Building for Production

To build the application for production:

```
npm run build
```
or
```
yarn build
```

The built files will be in the `dist` directory.

## Project Structure

- `src/components`: Reusable UI components
- `src/context`: React context providers
- `src/hooks`: Custom React hooks
- `src/pages`: Page components
- `src/services`: API service functions
- `src/types`: TypeScript type definitions

## Backend API

The frontend communicates with a backend API running on http://localhost:8080. The Vite development server is configured to proxy API requests to this backend server.
