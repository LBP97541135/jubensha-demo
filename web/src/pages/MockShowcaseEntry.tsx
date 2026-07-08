import React from "react";
import { Navigate } from "react-router-dom";

function MockShowcaseEntry() {
  React.useEffect(() => {
    window.localStorage.setItem("mock-showcase", "true");
  }, []);

  return <Navigate to="/play/xiutie-avenue-missing-three-minutes" replace />;
}

export { MockShowcaseEntry };
