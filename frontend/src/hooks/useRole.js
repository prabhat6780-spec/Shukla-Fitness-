import { useEffect, useState } from "react";
import API from "../api";

const useRole = () => {
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await API.get("/auth/profile");
        setRole(res.data.role);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  return { role, loading, isAdmin: role === "admin" };
};

export default useRole;