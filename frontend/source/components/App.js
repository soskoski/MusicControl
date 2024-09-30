import React, {Component} from "react";
import { createRoot } from "react-dom/client";

export default class App extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (<h1>Testing react code</h1>)
    }
}

const root = createRoot(appDiv);
root.render(<App />);