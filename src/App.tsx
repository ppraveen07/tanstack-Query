import { useState } from "react";

import Users from "./components/Users";
import Products from "./components/Products";
import UserDetails from "./components/UserDetails";

type Page =
  | "users"
  | "products"
  | "details";

function App() {

  const [page, setPage] =
    useState<Page>("users");

  const [selectedUserId, setSelectedUserId] =
    useState<number | null>(null);

  const handleViewDetails = (id: number) => {
    setSelectedUserId(id);
    setPage("details");
  };

  const handleBackToUsers = () => {
    setSelectedUserId(null);
    setPage("users");
  };

  return (
    <>
      <nav className="navbar">

        <h2>
          TanStack Query Tasks
        </h2>

        <div className="nav-buttons">

          <button
            className={
              page === "users" ||
              page === "details"
                ? "active"
                : ""
            }
            onClick={() => {
              setSelectedUserId(null);
              setPage("users");
            }}
          >
            Users
          </button>

          <button
            className={
              page === "products"
                ? "active"
                : ""
            }
            onClick={() => setPage("products")}
          >
            Products
          </button>

        </div>

      </nav>

      {page === "users" && (
        <Users
          onViewDetails={handleViewDetails}
        />
      )}

      {page === "products" && (
        <Products />
      )}

      {page === "details" &&
        selectedUserId !== null && (
          <UserDetails
            userId={selectedUserId}
            onBack={handleBackToUsers}
          />
        )}

    </>
  );
}

export default App;