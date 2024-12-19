# Product List App

This project is a product list application built with React, TypeScript, and other modern web technologies. It allows users to manage and interact with a list of products, including features for drag and drop functionality.

## Features

- Display a list of products
- Drag and drop functionality for product items
- Uses Radix UI for UI components
- Uses Zustand for state management
- Uses React Query for data fetching

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- Zustand
- React Query
- React DnD

## Dependencies

-   "@radix-ui/react-checkbox": "^1.1.3"
-   "@radix-ui/react-dialog": "^1.1.4"
-   "@radix-ui/react-select": "^1.2.2"
-   "@radix-ui/react-slot": "^1.0.2"
-   "@tanstack/react-query": "^4.29.12"
-   "@tanstack/react-virtual": "^3.0.0-beta.54"
-   "@types/node": "^16.18.34"
-   "class-variance-authority": "^0.6.0"
-   "clsx": "^1.2.1"
-   "lucide-react": "^0.233.0"
-   "react": "^18.3.1"
-   "react-dnd": "^16.0.1"
-   "react-dnd-html5-backend": "^16.0.1"
-   "react-dom": "^18.3.1"
-   "react-scripts": "5.0.1"
-   "tailwind-merge": "^1.13.0"
-   "tailwindcss": "^3.4.17"
-   "zustand": "^4.3.8"

## How to Run

1.  Clone the repository.
2.  Navigate to the project directory.
3.  Install dependencies using `bun install`.
4.  Run the development server using `bun run dev`.
5.  Add your API key to the `.env` file as `VITE_API_URL_MONK_COMMERCE_API_KEY`.
6.  Open your browser and navigate to the provided URL.

## Project Structure

-   `src/`: Contains the main source code for the application.
    -   `App.tsx`: The main application component.
    -   `components/`: Contains the React components.
        -   `ProductList.tsx`: Component for displaying a list of products.
        -   `ProductItem.tsx`: Component for displaying a single product item.
        -   `VaraintItem.tsx`: Component for displaying a product variant item.
        -   `DiscountPicker.tsx`: Component for picking a discount.
        -   `ProductPicker.tsx`: Component for picking a product.
        -   `ui/`: Contains the UI components.
    -   `store/`: Contains the Zustand store.
    -   `lib/`: Contains utility functions and react query setup.
    -   `types/`: Contains the TypeScript types.
    -   `styles/`: Contains the global styles.
    -   `assets/`: Contains the assets.
