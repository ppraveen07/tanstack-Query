import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchUsers } from "../api/usersApi";
import type { User } from "../types/User";

interface UsersProps {
  onViewDetails: (id: number) => void;
}

function Users({ onViewDetails }: UsersProps) {
  const [search, setSearch] = useState("");

  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isLoading) {
    return (
      <div className="loading-page">
        <div className="loader"></div>
        <h3>Loading users...</h3>
        <p>Fetching users from the server</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="error-page">
        <div className="error-icon">!</div>
        <h2>Something went wrong</h2>
        <p>{error.message}</p>

        <button onClick={() => refetch()}>
          Try Again
        </button>
      </div>
    );
  }

  const filteredUsers = users?.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="users-page">

      {/* Header */}
      <section className="users-header">
        <div>
          <span className="page-label">USER MANAGEMENT</span>

          <h1>Users</h1>

          <p>
            Manage and explore all registered users
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={() => refetch()}
        >
          <span className={isFetching ? "refresh-icon spinning" : "refresh-icon"}>
            ↻
          </span>

          {isFetching ? "Refreshing..." : "Refresh Users"}
        </button>
      </section>

      {/* Statistics */}
      <section className="stats-row">

        <div className="stat-card">
          <div className="stat-icon users-icon">
            👥
          </div>

          <div>
            <span>Total Users</span>
            <strong>{users?.length ?? 0}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active-icon">
            ✓
          </div>

          <div>
            <span>Active Users</span>
            <strong>{users?.length ?? 0}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon search-icon">
            🔎
          </div>

          <div>
            <span>Search Results</span>
            <strong>{filteredUsers?.length ?? 0}</strong>
          </div>
        </div>

      </section>

      {/* Search */}
      <section className="users-toolbar">

        <div className="search-box">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search users by name..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          {search && (
            <button
              className="clear-search"
              onClick={() => setSearch("")}
            >
              ×
            </button>
          )}
        </div>

        <div className="results-count">
          {filteredUsers?.length} users found
        </div>

      </section>

      {/* Users */}
      {filteredUsers?.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>

          <h2>No Users Found</h2>

          <p>
            Try searching with a different name.
          </p>

          <button onClick={() => setSearch("")}>
            Clear Search
          </button>
        </div>
      ) : (
        <section className="users-grid">

          {filteredUsers?.map((user) => (
            <div
              className="user-card"
              key={user.id}
            >

              {/* Card Top */}
              <div className="user-card-top">

                <div className="avatar">
                  {user.name
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div className="online-dot"></div>

              </div>

              {/* User Info */}
              <div className="user-info">

                <h2>{user.name}</h2>

                <span className="username">
                  @{user.username}
                </span>

              </div>

              {/* Details */}
              <div className="user-details">

                <div className="detail-row">
                  <span className="detail-icon">
                    ✉
                  </span>

                  <span>{user.email}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-icon">
                    ☎
                  </span>

                  <span>{user.phone}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-icon">
                    📍
                  </span>

                  <span>{user.address.city}</span>
                </div>

              </div>

              {/* Button */}
              <button
                className="details-btn"
                onClick={() =>
                  onViewDetails(user.id)
                }
              >
                View Details
                <span>→</span>
              </button>

            </div>
          ))}

        </section>
      )}

    </main>
  );
}

export default Users;