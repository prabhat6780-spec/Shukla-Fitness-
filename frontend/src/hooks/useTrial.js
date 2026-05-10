import { useState, useEffect } from "react";

/*
  ⭐ useTrial hook
  Returns { hasTrial, trialPlan, loading }

  Usage in any plan page:
    const { hasTrial, trialPlan } = useTrial();
    // hide "TRY FOR FREE" button if hasTrial === true
*/

const useTrial = () => {
  const [hasTrial,  setHasTrial]  = useState(false);
  const [trialPlan, setTrialPlan] = useState(null);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem("token");
      if (!token) { setLoading(false); return; }

      try {
        const res  = await fetch("/api/auth/trial/status", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.hasTrial) {
          setHasTrial(true);
          setTrialPlan(data.plan);
        }
      } catch (err) {
        console.error("Trial check failed:", err);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, []);

  return { hasTrial, trialPlan, loading };
};

export default useTrial;
