import { Link, useNavigate } from "react-router-dom";
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import logoImg from '../../assets/logo.svg';
import Container from "../../components/container";
import Input from "../../components/input";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";
import { useEffect } from "react";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.email('Insira um email válido!').nonempty('O email é obrigatorio!'),
  password: z.string().nonempty('A senha é obrigatoria!')
})

type FormData = z.infer<typeof schema>

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange'
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function handleLogout() {
      await signOut(auth);
    }
    handleLogout();
  }, [])

  function onSubmit(data: FormData) {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        toast.success('LOGADO COM SUCESSO!', {
          style: {
            backgroundColor: '#121212',
            color: '#fff'
          }
        });
        navigate('/dashboard', { replace: true })
      })
      .catch(() => {
        toast.error('ERRO AO LOGAR!', {
          style: {
            backgroundColor: '#121212',
            color: '#fff'
          }
        })
      })
  }
  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link to='/' className="mg-6 max-w-sm w-full">
          <img
            className="w-full"
            src={logoImg}
            alt='Logo Web Carros'
          />
        </Link>

        <form
          className="bg-white max-w-xl w-full rounded-lg p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <Input
              type='email'
              placeholder='Digite seu e-mail...'
              name='email'
              error={errors.email?.message}
              register={register}
            />
          </div>

          <div className="mb-3">
            <Input
              type='password'
              placeholder='Digite sua senha...'
              name='password'
              error={errors.password?.message}
              register={register}
            />
          </div>

          <button
            type="submit"
            className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium"
          >
            Acessar
          </button>
        </form>
        <h1 className="text-sm mt-2">Ainda não tem uma conta?
          <Link to='/register'>
            <strong className="ml-2 hover:underline">Cadastre-se aqui</strong>
          </Link>
        </h1>
      </div>
    </Container>
  )
}