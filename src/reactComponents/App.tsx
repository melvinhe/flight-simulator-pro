/**

 Root component for the application's routing.
 @return {JSX.Element} The JSX element representing the root component.
 */
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";

function App() {
  return (
    <Router aria-label="Application routing">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
