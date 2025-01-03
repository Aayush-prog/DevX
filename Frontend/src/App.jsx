import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./loggedOut/Home.jsx";
import SignUp from "./loggedOut/SignUp.jsx";
// import Login from "./loggedOut/Login.jsx";
import ClientSignUp from "./loggedOut/ClientSignUp.jsx";
import DevSignUp from "./loggedOut/DevSignUp.jsx";
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<Home />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/client" element={<ClientSignUp />} />
        <Route path="/talent" element={<DevSignUp />} />
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/dev" element={<Try />}>
          <Route path=":id" element={<Nested />} />
        </Route> */}
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
