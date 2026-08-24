import type { User } from "../types/User";

const USERS_API =
  "https://jsonplaceholder.typicode.com/users";

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(USERS_API);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
};

export const fetchUserById = async (
  id: number
): Promise<User> => {
  const response = await fetch(
    `${USERS_API}/${id}`
  );

  if (!response.ok) {
    throw new Error("User not found");
  }

  return response.json();
};