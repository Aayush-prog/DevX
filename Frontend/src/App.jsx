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
import FindWork from "./loggedIn/FindWork.jsx";
import FindTalent from "./loggedIn/FindTalent.jsx";
import JobDisplay from "./loggedIn/jobDisplay.jsx";
import DevDisplay from "./loggedIn/DevDisplay.jsx";
import WhyDevX from "./loggedOut/WhyDevX.jsx";
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
        <Route path="/whyDevX" element={<WhyDevX />} />
        <Route path="/forgot-password/" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/job/:jobId" element={<JobDisplay />} />
        <Route path="/dev/:devId" element={<DevDisplay />} />
        {/* Private Routes */}
        <Route path="/home" element={<PrivateRouter element={<Home />} />} />
        <Route path="/chat" element={<PrivateRouter element={<Chat />} />} />
        <Route
          path="/findWork"
          element={<PrivateRouter element={<FindWork />} />}
        />
        <Route
          path="/findTalent"
          element={<PrivateRouter element={<FindTalent />} />}
        />
        {/* <Route path="/dev" element={<Try />}>
          <Route path=":id" element={<Nested />} />
        </Route> */}
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
