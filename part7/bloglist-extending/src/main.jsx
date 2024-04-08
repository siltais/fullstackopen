import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { Container } from "semantic-ui-react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Container style={{ margin: 20 }}>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </Container>,
);
