import React from "react";
import { Route, Routes } from "react-router-dom";
import Array from "./Array";
import Linked from "./Linked_List";
import Landing from "./Landing";
import Grid from "./Grid";
import Binary from "./Binary";
import Graph from "./Graph";

const RRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />}></Route> 
        <Route path="/array" element={<Array />}></Route>  
        <Route path="/linked_list" element={<Linked />}></Route> 
        <Route path="/grid" element={<Grid />}></Route>  
        <Route path="/binary_tree" element={<Binary />}></Route>  
        <Route path="/graph" element={<Graph />}></Route> 
      </Routes>
    </div>
  );
};

export default RRoutes;