import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Jūsų pirkiniai</h1>
      <div className="links">
  <Link to="/" className="flag-button en">
    EN
  </Link>
  <Link to="/" className="flag-button ukr">
    UKR
  </Link>
</div>
    </nav>
  );
}
 
export default Navbar;