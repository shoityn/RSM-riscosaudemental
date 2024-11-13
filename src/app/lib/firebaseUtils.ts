import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const salvarResultado = async (tipo: string, valor: number) => {
  try {
    const docRef = await addDoc(collection(db, "resultados"), {
      tipo,
      valor,
      data: new Date(),
    });
    console.log("Documento salvo com ID: ", docRef.id);
  } catch (e) {
    console.error("Erro ao adicionar documento: ", e);
  }
};