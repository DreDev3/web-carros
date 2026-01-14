import { useNavigate, useParams } from "react-router-dom"
import Container from "../../components/container";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../../services/firebaseConnection";
import { FaWhatsapp } from "react-icons/fa";

const MOCK_IMAGES = [
  {
    id: '1',
    name: 'mustang1',
    url: 'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202601/20260106/ford-mustang-5.0-v8-gasolina-dark-horse-selectshift-wmimagem09150385862.jpg?s=fill&w=552&h=414&q=60'
  },
  {
    id: '2',
    name: 'mustang2',
    url: 'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202601/20260106/ford-mustang-5.0-v8-gasolina-dark-horse-selectshift-wmimagem09150857767.jpg?s=fill&w=552&h=414&q=60'
  },
  {
    id: '3',
    name: 'mustang3',
    url: 'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202601/20260106/ford-mustang-5.0-v8-gasolina-dark-horse-selectshift-wmimagem09151483713.jpg?s=fill&w=552&h=414&q=60'
  }
]

interface CarsData {
  id: string;
  name: string;
  model: string;
  city: string;
  year: string;
  km: string;
  description: string;
  createdDate: string;
  price: string | number;
  owner: string;
  uid: string;
  whatsapp: string;
  images: CarImageData[];
}

interface CarImageData {
  name: string;
  url: string;
  uid: string;
}

export default function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState<CarsData>();
  const [sliderPreviw, setSliderPreviw] = useState<number>(2);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCar() {
      if (!id) { return };

      const docRef = doc(db, 'cars', id);
      getDoc(docRef)
        .then(snapshot => {

          if (!snapshot.data()) {
            navigate('/');
          }
          setCar({
            id: snapshot.data()?.id,
            name: snapshot.data()?.name,
            model: snapshot.data()?.model,
            city: snapshot.data()?.city,
            year: snapshot.data()?.year,
            km: snapshot.data()?.km,
            description: snapshot.data()?.description,
            createdDate: snapshot.data()?.createdDate,
            price: snapshot.data()?.price,
            owner: snapshot.data()?.owner,
            uid: snapshot.data()?.uid,
            whatsapp: snapshot.data()?.whatsapp,
            images: snapshot.data()?.images,
          })
        })
    }
    loadCar();
  }, [id])

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 720) {
        setSliderPreviw(1);
      }
    };
    handleResize();

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <Container>
      {car && (
        <Swiper
          slidesPerView={sliderPreviw}
          pagination={{ clickable: true }}
          navigation
        >
          {MOCK_IMAGES.map(image => (
            <SwiperSlide key={image.name}>
              <img
                src={image.url}
                className="w-full h-96 object-cover"
              />

            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {car && (
        <main className="w-full bg-white rounded-lg p-6 my-4">
          <div className="flex flex-col sm:flex-row mg-4 items-center justify-between">
            <h1 className="font-bold text-3xl">{car?.name}</h1>
            <h1 className="font-bold text-3xl">R${car?.price}</h1>
          </div>

          <p className="">{car?.model}</p>

          <div className="flex w-full gap-6 my-4">
            <div className="flex flex-col gap-4">
              <div className="">
                <p className="">Cidade</p>
                <strong>{car?.city}</strong>
              </div>
              <div>
                <p className="">Ano</p>
                <strong>{car?.year}</strong>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="">
                <p className="">KM</p>
                <strong>{car?.km}</strong>
              </div>
            </div>
          </div>

          <strong>Descição:</strong>
          <p className="mb-4">{car?.description}</p>

          <strong>Telefone / Whatsapp</strong>
          <a
            className="w-full bg-green-500 text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium cursor-pointer"
            href={`https://api.whatsapp.com/send?phone${car?.whatsapp}&text=Olá vi esse ${car.name} no site WebCarros e fiquei interessado!`}
            target="_blank"
          >
            Conversar com o vendedor
            <FaWhatsapp size={26} color="#fff" />
          </a>
        </main>
      )}
    </Container>
  )
}