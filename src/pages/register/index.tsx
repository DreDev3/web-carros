import { Link, useNavigate } from "react-router-dom";
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { useContext, useEffect } from "react";

import logoImg from '../../assets/logo.svg';
import Container from "../../components/container";
import Input from "../../components/input";
import { auth } from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/AuthContext";

const schema = z.object({
  name: z.string().nonempty('O campo nome é obrigatório!'),
  email: z.email('Insira um email válido!').nonempty('O email é obrigatório!'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres!').nonempty('A senha é obrigatória!')
})

type FormData = z.infer<typeof schema>

export default function Register() {
  const { handleInfoUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange'
  });

  useEffect(() => {
    async function handleLogout() {
      await signOut(auth);
    }
    handleLogout();
  }, [])


  async function onSubmit(data: FormData) {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async user => {
        await updateProfile(user.user, {
          displayName: data.name
        })
        handleInfoUser({
          name: data.name,
          email: data.email,
          uid: user.user.uid
        })
        navigate('/dashboard', { replace: true });
      })
      .catch(err => {
        console.log('ERRO AO CADASTRAR: ', err)
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
              type='text'
              placeholder='Digite seu nome completo...'
              name='name'
              error={errors.name?.message}
              register={register}
            />
          </div>

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
            Cadastrar
          </button>
        </form>
        <h1 className="text-sm mt-2">Já possui uma conta?
          <Link to='/login'>
            <strong className="ml-2 hover:underline">Faça o login</strong>
          </Link>
        </h1>
      </div>
    </Container>
  )
}