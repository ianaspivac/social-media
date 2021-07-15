import "./App.css";
import Header from "./components/Layout/Header";
import { Switch, Route } from "react-router-dom";
import Authentification from "./pages/Authentication";
import { Fragment } from "react";

function App() {
  return (
    <main>
       <Header /> 
    <Switch>
      <Route path='/login'><Authentification/></Route>
      <Route path='/signup'><Authentification/></Route>
      <Route path='/feed'></Route>
    </Switch>
    </main>
  );
}

export default App;
