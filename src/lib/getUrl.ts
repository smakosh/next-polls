export const getURL = (path: string = "") => {
  return process.env.NODE_ENV === "development"
    ? `http://localhost:3000${path}`
    : `https://next-polls-chi.vercel.app${path}`;
};
