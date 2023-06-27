import  { useState, useEffect } from "react";
import LoadingPage from "./pages/Loading";
import LoginPage from "./pages/Login";
import AdsLayoutManager from "./pages/AdsLayoutManager";

function App() {
  const [userValid, setUserValid] = useState(false);
  const [showLoadingPage, setShowLoadingPage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingPage(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {showLoadingPage ? (
        <LoadingPage setUserValid={setUserValid} />
      ) : userValid ? (
        <AdsLayoutManager/>
      ) : (
        <LoginPage />
      )}
    </div>
  );
}

export default App;
