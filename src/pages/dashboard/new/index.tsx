import { useContext, useState, type ChangeEvent } from "react";
import { FiTrash, FiUpload } from "react-icons/fi";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidV4 } from 'uuid';

import Container from "../../../components/container";
import DashboradHeader from "../../../components/panelheader";
import Input from "../../../components/input";
import { AuthContext } from "../../../contexts/AuthContext";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../../services/firebaseConnection";
import { addDoc, collection } from "firebase/firestore";
import toast from "react-hot-toast";



const schema = z.object({
  name: z.string().nonempty('O campo nome é obrigatório!'),
  model: z.string().nonempty('O modelo é obrigatório!'),
  year: z.string().nonempty('O ano do carro é obrigatório!'),
  km: z.string().nonempty('O KM do carro é obrigatório!'),
  price: z.string().nonempty('O preço é obrigatório!'),
  city: z.string().nonempty('A cidade é obrigatória!'),
  wpp: z.string().min(1, 'O telefone é obrigatório!').refine(value => /^(\d{11,12})$/.test(value), {
    message: 'Número de telefone inválido!'
  }),
  description: z.string().nonempty('A descrição é obrigatória!')
})

type FormData = z.infer<typeof schema>;

type ImageItemData = {
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
}

export default function New() {
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })
  const [carImages, setCarImages] = useState<ImageItemData[]>([]);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === 'image/jpeg' || image.type === 'image/png') {
        await handleUpload(image);
      } else {
        alert('Envie uma imagem jpeg ou png!');
        return;
      }
    }
  }

  function handleUpload(image: File) {
    if (!user?.uid) {
      return;
    }

    const currentUid = user?.uid;

    const uidImage = uuidV4();

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`);

    uploadBytes(uploadRef, image)
      .then(snapshot => {
        getDownloadURL(snapshot.ref).then(downloadUrl => {
          const imageItem = {
            name: uidImage,
            uid: currentUid,
            previewUrl: URL.createObjectURL(image),
            url: downloadUrl,
          }

          setCarImages((images) => [...images, imageItem])
        })
      });
  }

  function onSubmit(data: FormData) {

    const carListImages = carImages.map(car => {
      return {
        uid: car.uid,
        name: car.name,
        url: car.url
      }
    });

    addDoc(collection(db, 'cars'), {
      name: data.name.toLocaleUpperCase(),
      whatsapp: data.wpp,
      city: data.city,
      year: data.year,
      km: data.km,
      model: data.model,
      price: data.price,
      description: data.description,
      createdDate: new Date(),
      owner: user?.name,
      uid: user?.uid,
      images: carListImages
    })
      .then(() => {
        toast.success('Carro cadastrado com sucesso!', {
          style: { backgroundColor: '#121212', color: '#fff' }
        })
        reset();
        setCarImages([]);
      })
      .catch(err => {
        console.log(err)
      })
  }

  async function handleDeleteImage(item: ImageItemData) {
    const imagePath = `images/${item.uid}/${item.name}`;

    const imageRef = ref(storage, imagePath);

    try {
      await deleteObject(imageRef);
      setCarImages(carImages.filter(car => car.url !== item.url));
    } catch {
      toast.error('Erro ao deletar imagem!', {
        style: {
          backgroundColor: '#121212',
          color: '#fff'
        }
      })
    }
  }
  return (
    <Container>
      <DashboradHeader />

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
        <button className="border-2 w-48 rounded-lg flex items-center justify-center border-gray-600 h-32">
          <div className="absolute">
            <FiUpload size={30} color='#000' />
          </div>
          <div className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="opacity-0 cursor-pointer"
              onChange={handleFile}
            />
          </div>
        </button>
        {carImages.map(item => (
          <div
            className="w-full h-32 flex items-center justify-center relative"
            key={item.name}
          >
            <button className="absolute" onClick={() => handleDeleteImage(item)}>
              <FiTrash size={28} color="#fff" />
            </button>
            <img
              className="rounded-lg w-full h-32 object-cover"
              src={item.previewUrl}
              alt='Imagem do carro'
            />
          </div>
        ))}
      </div>

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
        <form
          className="w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <p className="mb-2 font-medium">
              Nome do carro
              <Input
                type="text"
                register={register}
                name='name'
                error={errors.name?.message}
                placeholder="Ex: Onix 1.0"
              />
            </p>
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">
              Modelo do carro
              <Input
                type="text"
                register={register}
                name='model'
                error={errors.model?.message}
                placeholder="Ex: LT flex"
              />
            </p>
          </div>

          <div className="w-full flex mb-3 items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">
                Ano
                <Input
                  type="text"
                  register={register}
                  name='year'
                  error={errors.year?.message}
                  placeholder="Ex: 2016/2016"
                />
              </p>
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">
                KM rodados
                <Input
                  type="text"
                  register={register}
                  name='km'
                  error={errors.km?.message}
                  placeholder="Ex: 60.000"
                />
              </p>
            </div>
          </div>

          <div className="w-full flex mb-3 items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">
                Telefone/Whatspp
                <Input
                  type="text"
                  register={register}
                  name='wpp'
                  error={errors.wpp?.message}
                  placeholder="Ex: 4199999999"
                />
              </p>
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">
                Cidade
                <Input
                  type="text"
                  register={register}
                  name='city'
                  error={errors.city?.message}
                  placeholder="Ex: Curitiba - PR"
                />
              </p>
            </div>
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">
              Preço do carro
              <Input
                type="text"
                register={register}
                name='price'
                error={errors.price?.message}
                placeholder="Ex: R$50.000"
              />
            </p>
          </div>
          <div className="mb-3">
            <p className="mb-2 font-medium">Descrição</p>
            <textarea
              className="w-full border-2 border-gray-200 rounded-md h-24 px-2"
              {...register('description')}
              name="description"
              id="description"
              placeholder="Digite a descrição completa sobre o carro"
            />
            {errors.description && <p className="mb-1 text-red-600">{errors.description?.message}</p>}
          </div>

          <button className="w-full h-10 rounded-md bg-zinc-900 text-white font-medium">
            Cadastrar
          </button>
        </form>
      </div>
    </Container>
  )
}