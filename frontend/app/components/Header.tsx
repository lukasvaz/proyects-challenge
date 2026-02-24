import { Link } from "react-router";

export default function Header() {
  return (
    <header className="w-full  bg-white">
      <nav className="container mx-auto p-4 flex items-center gap-4">
        <Link to="/" >
          Home
        </Link>
        <Link to="/projects">
          New Project
        </Link>
        <Link to="/workers" >
          New Worker
        </Link>
      </nav>
    </header>
  );
}
