import { Outlet, Link } from "react-router-dom";
import './stylesheet.css';
import './App.css';
import logo from './logo.svg';


function Layout() {
    return (
        <body>
            <nav id="nav-bar">
                <div id="flex-links">
                    <div> <img src={logo} className="App-logo" alt="logo" /> </div>
                    <div id="links">
                        <Link to="/">Home</Link>
                    </div>
                    <div id="links">
                        <Link to="/check">Check-in/Checkout</Link>
                    </div>
                    <div> <img src={logo} className="App-logo" alt="logo" /> </div>
                </div>
            </nav>

            <Outlet />
        </body>
    )
};

export default Layout;