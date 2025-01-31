import React from "react";

export const URLBASE = "http://localhost:8080";

export const getToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

const VariablesAndMethods: React.FC = () => {
  return (
    <div>
      <h1>Variable URLBASE</h1>
      <p>{URLBASE}</p>
    </div>
  );
};

export default VariablesAndMethods;
