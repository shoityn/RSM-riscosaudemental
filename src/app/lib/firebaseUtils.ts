import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const salvarResultado = async (cns: string, tipo: string, valor: number) => {
  try {
    const docRef = doc(db, "resultados", cns);

    await setDoc(docRef, {
      [tipo]: valor,
      data: new Date(),
    }, { merge: true });
    
    console.log("Resultado salvo com sucesso no documento do usuário:", cns);
  } catch (e) {
    console.error("Erro ao salvar resultado:", e);
  }
};