import {Link} from 'react-router-dom';
import "./Header.css";
const Header = () => {
    return(<header>
        <nav>
            <ul>
                <li><Link to='/feed'>Feed</Link></li>
                <li><button>Logout</button></li>
                <li><Link to='/authentification'>Sign in</Link></li>
                <li><Link to='/authentification'>Sign up</Link></li>
            </ul>
        </nav>
    </header>);
};
export default Header;
