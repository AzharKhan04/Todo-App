import React from "react";
import { hot } from "react-hot-loader/root";
import { Provider } from "react-redux";
import { store } from "./Store";
import Dashboard from "./App/Components/Dashboard";

const Main: React.FC = () => {
  return (
    <Provider store={store}>
      <Dashboard></Dashboard>
    </Provider>
  );
};

export default hot(Main);
