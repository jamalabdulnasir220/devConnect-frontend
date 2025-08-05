import { Route, Routes } from "react-router";
import Body from "./Body";
import Login from "./Login";
import Profile from "./Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Body />}>
        <Route index element={<div>Home Page</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="/login" element={<div>Login Page</div>} />
      <Route path="/test" element={<div>Test Page</div>} />
    </Routes>
  );
}

export default App;
