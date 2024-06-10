import {Link} from 'react-router-dom';
import {useLogout} from '../hooks/useLogout';
import {useAuthContext} from '../hooks/useAuthContext';


const Navbar = () => {
    const {logout} = useLogout();
    const {user} = useAuthContext();

    const handleClick = () => {
        logout();
    };

    return (
        <header>
            <div className="container">
                <Link to="/">
                    <img src="/ivsane.jpg" className='logo'/>
                </Link>
                {user?.role === 'admin' && (
                    <>
                        <Link to="/categories">
                            <h3>Categories</h3>
                        </Link>
                        <Link to="/formateur">
                            <h3>Formateurs</h3>
                        </Link>
                    </>
                )}
                <Link to="/formations">
                    <h3>Formations</h3>
                </Link>
                {user?.role !== 'admin' &&
                    <Link to="/myformations">
                        <h3>Mes Formations</h3>
                    </Link>
                }
                <Link to="/">
                    <h3>Accueil</h3>
                </Link>
                <Link to="/contact">
                    <h3>Contact</h3>
                </Link>
                <Link to="/formations">
                    <h3>À propos</h3>
                </Link>
                {user && (
                    <>
                        <Link to="/profile">
                            <h3>Profile</h3>
                        </Link>
                        <div>
                            <span>{user.role}</span>
                            <button onClick={handleClick}>Log out</button>
                        </div>
                    </>
                )}     </div>
        </header>
    );
};

export default Navbar;
