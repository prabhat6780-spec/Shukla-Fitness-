import { useEffect } from "react";

const GoogleSuccess = () => {

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const role = params.get("role");

    if (token) {

      localStorage.setItem("token", token);

      if (role) {
        localStorage.setItem("role", role);
      }

      // HARD REDIRECT (OAuth best practice)
      window.location.href = "/";

    } else {

      window.location.href = "/login";

    }

  }, []);

  return (
    <div style={{
      height:"100vh",
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      background:"#000",
      color:"#fff",
      fontSize:"22px"
    }}>
      Logging you in with Google...
    </div>
  );
};

export default GoogleSuccess;
