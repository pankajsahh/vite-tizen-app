// import { useState } from "react";
// import "./App.css";
// import LoadingPage from "./pages/Loading";

// function App() {
//   const [UserValid, setUserValid] = useState(false);

//   return <LoadingPage setUserValid={setUserValid} />;
// }

// export default App;



import  { useState, useEffect } from "react";
import "./App.css";
import LoadingPage from "./pages/Loading";
import LoginPage from "./pages/Login";
import AdsPlayer from "./pages/AdsPlayer";

function App() {
  const [userValid, setUserValid] = useState(false);
  const [showLoadingPage, setShowLoadingPage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingPage(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {showLoadingPage ? (
        <LoadingPage setUserValid={setUserValid} />
      ) : userValid ? (
        <AdsPlayer />
      ) : (
        <LoginPage />
      )}
    </div>
  );
}

export default App;
