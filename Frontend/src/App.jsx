import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import PrivateRouter from "./PrivateRouter.jsx";
import LandingPage from "./loggedOut/Home.jsx";
import SignUp from "./loggedOut/SignUp.jsx";
import Login from "./loggedOut/Login.jsx";
import ClientSignUp from "./loggedOut/ClientSignUp.jsx";
import DevSignUp from "./loggedOut/DevSignUp.jsx";
import ForgotPassword from "./loggedOut/ForgotPassword.jsx";
import ResetPassword from "./loggedOut/ResetPassword.jsx";
import Home from "./loggedIn/Home.jsx";
import Chat from "./loggedIn/Chat.jsx";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/client" element={<ClientSignUp />} />
        <Route path="/talent" element={<DevSignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password/" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Private Routes */}
        <Route path="/home" element={<PrivateRouter element={<Home />} />} />
        <Route path="/chats" element={<PrivateRouter element={<Chat />} />} />
        {/* <Route path="/dev" element={<Try />}>
          <Route path=":id" element={<Nested />} />
        </Route> */}
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
