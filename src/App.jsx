import "./App.css";
import { Routes, Route } from "react-router-dom";
import Join from "./pages/Join";
import Chat from "./pages/Chat";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" exact Component={Join}></Route>
        <Route path="/chat" exact Component={Chat}></Route>
      </Routes>
    </>
  );
}

export default App;
