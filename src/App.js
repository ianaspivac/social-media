import "./App.css";
import Header from "./components/Layout/Header";
import { Switch, Route, Redirect } from "react-router-dom";
import Authentification from "./pages/Authentication";
import { useSelector } from "react-redux";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";

function App() {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const userId=localStorage.getItem("userId");
 
  return (
    <main>
      <Header />
      <Switch>
        <Route path="/social-media" exact>
          {!isLoggedIn && (
            <Redirect to="/social-media/login">
              <Authentification />
            </Redirect>
          )}
          {isLoggedIn && (
            <Redirect to="/social-media/feed">
              <Feed />
            </Redirect>
          )}
        </Route>
        {!isLoggedIn && (
          <Route path="/social-media/login">
            <Authentification />
          </Route>
        )}
        {!isLoggedIn && (
          <Route path="/social-media/signup">
            <Authentification />
          </Route>
        )}
         {isLoggedIn && (
          <Route path="/social-media/profile">
           <Profile/>
          </Route>
        )}
        {isLoggedIn && (
          <Route path="/social-media/feed">
            <Feed />
          </Route>
        )}
        {isLoggedIn && (
          <Route path={`/social-media/user/${userId}`}>
            <Redirect to="/social-media/profile" />
          </Route>
        )}
         {isLoggedIn && (
          <Route path="/social-media/user">
            <Profile/>
          </Route>
        )}
        <Route path="*">
          <Redirect to = "/index.html" />
        </Route>
      </Switch>
    </main>
  );
}

export default App;
