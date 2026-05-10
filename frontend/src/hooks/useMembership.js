import { useEffect, useState } from "react";
import API from "../api";

const useMembership = () => {
  const [hasMembership, setHasMembership] = useState(false);
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await API.get("/membership/status");

        if (res.data.hasMembership) {
          setHasMembership(true);
          setMembership(res.data.membership);
        }
      } catch (err) {
        console.error("Membership status error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  return { hasMembership, membership, loading };
};

export default useMembership;