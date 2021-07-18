import "./App.css";
import Header from "./components/Layout/Header";
import { Switch, Route, Redirect } from "react-router-dom";
import Authentification from "./pages/Authentication";
import { useSelector } from "react-redux";
import Feed from "./pages/Feed";

function App() {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
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
          <Route path="/feed">
            <Feed />
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
