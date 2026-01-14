import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import { auth } from "../../services/firebaseConnection";

export default function DashboradHeader() {
  const navigate = useNavigate();
  async function handleLogout() {
    await signOut(auth);
    navigate('/login')

  }
  return (
    <div className="w-full items-center flex h-10 bg-red-600 rounded-lg text-white font-medium gap-4 px-4 mb-4">
      <Link to='/dashboard'>
        Dashboard
      </Link>
      <Link to='/dashboard/new'>
        Cadastrar carro
      </Link>

      <button
        className="ml-auto"
        onClick={handleLogout}
      >
        Sair da conta
      </button>
    </div>
  )
}