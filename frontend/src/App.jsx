import { useState } from "react";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import ResultsPage from "./pages/ResultsPage";

function App() {
  const [page, setPage] = useState("home");
  const [result, setResult] = useState(null);

  return (
    <div>
      {page === "home" && (
        <HomePage onStart={() => setPage("upload")} />
      )}
      {page === "upload" && (
        <UploadPage
          onResult={(data) => {
            setResult(data);
            setPage("results");
          }}
          onBack={() => setPage("home")}
        />
      )}
      {page === "results" && (
        <ResultsPage
          result={result}
          onBack={() => setPage("upload")}
        />
      )}
    </div>
  );
}

export default App;