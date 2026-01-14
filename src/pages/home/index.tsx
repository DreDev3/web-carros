import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";

import { db } from "../../services/firebaseConnection";
import Container from "../../components/container";
import toast from "react-hot-toast";

export type CarsData = {
  id: string;
  name: string;
  year: string;
  uid: string;
  price: string | number;
  city: string;
  km: string;
  images: CarImageData[]
}

type CarImageData = {
  name: string;
  uid: string;
  url: string;
}

export default function Home() {
  const [cars, setCars] = useState<CarsData[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const [input, setInput] = useState<string>();

  useEffect(() => {
    loadCars();
  }, [])

  async function loadCars() {
    const carRef = collection(db, 'cars');
    const queryRef = query(carRef, orderBy('createdDate', 'desc'));

    getDocs(queryRef)
      .then(snapshot => {
        let listCars = [] as CarsData[];

        snapshot.forEach(doc => {
          listCars.push({
            id: doc.id,
            name: doc.data().name,
            year: doc.data().year,
            km: doc.data().km,
            city: doc.data().city,
            price: doc.data().price,
            images: doc.data().images,
            uid: doc.data().uid
          })
        })

        setCars(listCars)
      })
  }

  function handleImageLoad(id: string) {
    setLoadImages(prev => [...prev, id])
  }

  async function handleSearchCar() {
    if (input === '') {
      loadCars();
      return;
    }

    setCars([]);
    setLoadImages([]);

    const q = query(collection(db, 'cars'),
      where('name', '>=', input?.toLocaleUpperCase()),
      where('name', '<=', input?.toLocaleUpperCase() + '\uf8ff')
    )

    const querySnapshot = await getDocs(q);

    let listCars = [] as CarsData[];

    querySnapshot.forEach(doc => {
      listCars.push({
        id: doc.id,
        name: doc.data().name,
        year: doc.data().year,
        km: doc.data().km,
        city: doc.data().city,
        price: doc.data().price,
        images: doc.data().images,
        uid: doc.data().uid
      })
    })

    if (listCars.length === 0) {
      toast('Carro não encontrado!', {
        style: {
          backgroundColor: '#121212',
          color: '#fff'
        },
        icon: '⚠️'
      })
    }

    setCars(listCars);
  }
  return (
    <Container>
      <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input
          className="w-full border-2 border-gray-200 rounded-lg h-9 px-3 outline-none"
          type="text"
          placeholder="Digite o nome do carro"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSearchCar()
          }}
        />
        <button
          className="bg-red-600 h-9 px-8 rounded-lg text-white font-medium text-lg transition-colors hover:bg-red-700"
          onClick={handleSearchCar}
        >
          Buscar
        </button>
      </section>

      <h1 className="font-bold text-center mt-6 text-2xl mb-4">
        Carros novos e usados em todo o Brasil
      </h1>

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map(car => (
          <Link to={`/car/${car.id}`}>
            <section className="w-full bg-white rounded-lg" key={car.id}>
              <div
                className="w-full h-72 rounded-lg bg-slate-200"
                style={{ display: loadImages.includes(car.id) ? 'none' : 'block' }}
              >
              </div>
              <img
                className="w-full rounded-lg mb-2 max-h-72 max-md:object-contain transition-all hover:scale-105"
                src="https://www.webmotors.com.br/wp-content/uploads/2025/10/14133309/Honda-WR-V-EX-10-scaled.webp"
                alt="Carro"
                onLoad={() => handleImageLoad(car.id)}
                style={{ display: loadImages.includes(car.id) ? 'block' : 'none' }} />
              <p className="font-bold mt-1 mb-2 px-2">{car.name}</p>

              <div className="flex flex-col px-2">
                <span className="text-zinc-700 mb-6">Ano {car.year} | {car.km} km</span>
                <strong className="text-black font-medium text-xl">
                  R${car.price}
                </strong>
              </div>

              <div className="w-full h-px bg-slate-200 my-2"></div>

              <div className="px-2 pb-2">
                <span className="text-zinc-700">
                  {car.city}
                </span>
              </div>
            </section>
          </Link>
        ))}
      </main>
    </Container>
  )
}