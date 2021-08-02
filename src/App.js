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
        <Route path="/" exact>
          {!isLoggedIn && (
            <Redirect to="/login">
              <Authentification />
            </Redirect>
          )}
          {isLoggedIn && (
            <Redirect to="/feed">
              <Feed />
            </Redirect>
          )}
        </Route>
        {!isLoggedIn && (
          <Route path="/login">
            <Authentification />
          </Route>
        )}
        {!isLoggedIn && (
          <Route path="/signup">
            <Authentification />
          </Route>
        )}
         {isLoggedIn && (
          <Route path="/profile">
           <Profile/>
          </Route>
        )}
        {isLoggedIn && (
          <Route path="/feed">
            <Feed />
          </Route>
        )}
        {isLoggedIn && (
          <Route path={`/user/${userId}`}>
            <Redirect to="/profile" />
          </Route>
        )}
         {isLoggedIn && (
          <Route path="/user">
            <Profile/>
          </Route>
        )}
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </main>
  );
}

export default App;
