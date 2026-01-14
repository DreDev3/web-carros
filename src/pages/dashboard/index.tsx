import { FiTrash2 } from "react-icons/fi";
import { useContext, useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";

import { db, storage } from "../../services/firebaseConnection";
import Container from "../../components/container";
import DashboradHeader from "../../components/panelheader";
import type { CarsData } from "../home";
import { AuthContext } from "../../contexts/AuthContext";
import { deleteObject, ref } from "firebase/storage";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [cars, setCars] = useState<CarsData[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {

    async function loadCars() {
      if (!user?.uid) {
        return;
      }

      const carRef = collection(db, 'cars');
      const queryRef = query(carRef, where('uid', '==', user.uid));

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
    loadCars();
  }, [user])

  async function handleDeleteCar(car: CarsData) {
    const itemCar = car;
    const docRef = doc(db, 'cars', itemCar.id);

    await deleteDoc(docRef);

    toast('Carro deletado.', {
      style: {
        backgroundColor: '#121212',
        color: '#fff'
      },
      icon: '👌'
    })

    setCars(cars.filter(car => car.id !== itemCar.id));
    itemCar.images.map(async image => {
      const imagePath = `images/${image.uid}/${image.name}`;

      const imageRef = ref(storage, imagePath);

      try {
        await deleteObject(imageRef);
      } catch (err) {
        console.log(err)
      }
    })
  }

  return (
    <Container>
      <DashboradHeader />

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

        {cars.map(car => (
          <section
            className="w-full bg-white rounded-lg relative"
            key={car.id}
          >
            <button
              className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow"
              onClick={() => { handleDeleteCar(car) }}
            >
              <FiTrash2 size={26} color="#000" />
            </button>
            <img
              className="w-full rounded-lg mb-2 max-h-70"
              src="https://www.webmotors.com.br/wp-content/uploads/2025/10/14133309/Honda-WR-V-EX-10-scaled.webp"
            />
            <label className="font-bold mt-1 px-2 mb-2">
              {car.name}
            </label>

            <div className="flex flex-col px-2">
              <span>Ano {car.year} | {car.km} km</span>
              <strong className="font-bold mt-4">R${car.price}</strong>
            </div>
            <div className="w-full h-px bg-slate-200 my-2"></div>

            <div className="px-2 pb-2">
              <span>{car.city}</span>
            </div>
          </section>
        ))}

      </main>
    </Container>
  )
}