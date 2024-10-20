import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import JoinRoom from "./JoinRoomPage";
import CreateRoom from "./CreateRoomPage";
import Room from "./Room";

// export default class App extends Component {
//   render() {
//     return (
//       <Router>
//         <Routes>
//           <Route path="/" element={<p>This is the Home Page</p>} />
//           <Route path="/join" element={<JoinRoom />} />
//           <Route path="/create" element={<CreateRoom />} />
//           <Route path="/room/:roomCode" element={<Room />} />
//         </Routes>
//       </Router>
//     );
//   }
// }

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<p>This is the Home Page</p>} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/room/:roomCode" element={<Room />} />
      </Routes>
    </Router>
  );
};

export default App;
