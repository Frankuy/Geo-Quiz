import React from 'react';
import Setting from "./pages/Setting";
import MainMenu from "./pages/MainMenu";
import Game from "./pages/Game";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

const App = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <MainMenu />
                </Route>
                <Route path="/setting">
                    <Setting />
                </Route>
                <Route path="/play/:mode/:time" children={<Game />} />
            </Switch>
        </Router>
    )
}

export default App;
