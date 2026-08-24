import { useQuery } from "@tanstack/react-query";
import type { User } from "../types/User";

interface UserDetailsProps {
  userId: number;
  onBack: () => void;
}

async function fetchUser(userId: number): Promise<User> {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  if (!response.ok) {
    throw new Error("User not found");
  }

  const user: User = await response.json();

  return user;
}

function UserDetails({
  userId,
  onBack,
}: UserDetailsProps) {

  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<User, Error>({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
  });

  /* =========================
     LOADING
  ========================= */

  if (isLoading) {
    return (
      <div className="details-loading">
        <div className="details-loader"></div>

        <h2>Loading User...</h2>

        <p>
          Fetching user information for ID {userId}
        </p>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (isError) {
    return (
      <div className="details-error">

        <div className="details-error-icon">
          !
        </div>

        <h2>Unable to Load User</h2>

        <p>
          {error.message}
        </p>

        <div className="details-error-actions">

          <button
            className="details-back-btn"
            onClick={onBack}
          >
            ← Back to Users
          </button>

          <button
            className="details-retry-btn"
            onClick={() => refetch()}
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  /* =========================
     INVALID USER
  ========================= */

  if (!user) {
    return (
      <div className="details-error">

        <div className="details-error-icon">
          ?
        </div>

        <h2>User Not Found</h2>

        <p>
          No user information is available for
          user ID {userId}.
        </p>

        <button
          className="details-back-btn"
          onClick={onBack}
        >
          ← Back to Users
        </button>

      </div>
    );
  }

  /* =========================
     SUCCESS
  ========================= */

  const initials = user.name
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="user-details-page">

      {/* HEADER */}

      <div className="details-page-header">

        <div>
          <span className="details-label">
            USER PROFILE
          </span>

          <h1>User Details</h1>

          <p>
            View complete information about this user.
          </p>
        </div>

        <button
          className="details-back-btn"
          onClick={onBack}
        >
          ← Back to Users
        </button>

      </div>

      {/* PROFILE CARD */}

      <section className="profile-card">

        <div className="profile-top">

          <div className="profile-avatar">
            {initials}
          </div>

          <div className="profile-heading">

            <h2>{user.name}</h2>

            <p>@{user.username}</p>

            <span className="profile-status">
              ● Active User
            </span>

          </div>

        </div>

        {/* INFORMATION */}

        <div className="profile-information">

          <div className="information-section">

            <div className="information-title">
              Contact Information
            </div>

            <div className="information-grid">

              <div className="information-item">
                <span className="information-icon">
                  ✉
                </span>

                <div>
                  <small>Email</small>
                  <strong>{user.email}</strong>
                </div>
              </div>

              <div className="information-item">
                <span className="information-icon">
                  ☎
                </span>

                <div>
                  <small>Phone</small>
                  <strong>{user.phone}</strong>
                </div>
              </div>

              <div className="information-item">
                <span className="information-icon">
                  🌐
                </span>

                <div>
                  <small>Website</small>
                  <strong>{user.website}</strong>
                </div>
              </div>

              <div className="information-item">
                <span className="information-icon">
                  📍
                </span>

                <div>
                  <small>City</small>
                  <strong>{user.address.city}</strong>
                </div>
              </div>

            </div>

          </div>

          {/* COMPANY */}

          <div className="information-section">

            <div className="information-title">
              Company Information
            </div>

            <div className="company-card">

              <div className="company-icon">
                🏢
              </div>

              <div>
                <small>Company</small>

                <h3>{user.company.name}</h3>

                <p>
                  {user.company.catchPhrase}
                </p>
              </div>

            </div>

          </div>

          {/* ADDRESS */}

          <div className="information-section">

            <div className="information-title">
              Address
            </div>

            <div className="address-card">

              <div>
                <small>Street</small>

                <strong>
                  {user.address.street}
                </strong>
              </div>

              <div>
                <small>Suite</small>

                <strong>
                  {user.address.suite}
                </strong>
              </div>

              <div>
                <small>City</small>

                <strong>
                  {user.address.city}
                </strong>
              </div>

              <div>
                <small>Zip Code</small>

                <strong>
                  {user.address.zipcode}
                </strong>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* QUERY INFORMATION */}

      <div className="query-info">

        <span>TanStack Query Key</span>

        <code>
          ["user", {userId}]
        </code>

      </div>

    </main>
  );
}

export default UserDetails;