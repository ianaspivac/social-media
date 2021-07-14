import "./App.css";
import Header from "./components/Layout/Header";
import { Switch, Route } from "react-router-dom";

function App() {
  return (
    <Switch>
      <Header />
      <Route path='/authentification'></Route>
      <Route path='/feed'></Route>
    </Switch>
  );
}

export default App;
