import { Route, Routes } from "react-router";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Request from "./components/Request";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Body />}>
        <Route index element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/connections" element={<Connections />} />
        <Route path="/request" element={<Request />} />
      </Route>
      {/* <Route path="/login" element={<div>Login Page</div>} />
      <Route path="/test" element={<div>Test Page</div>} /> */}
    </Routes>
  );
}

export default App;
