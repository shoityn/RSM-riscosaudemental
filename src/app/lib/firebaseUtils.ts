import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const salvarResultado = async (cns: string, tipo: string, valor: number, risco: string) => {
  try {
    const docRef = doc(db, "resultados", cns);

    const dados = {
      CNS: cns,
      resultados: {
        [tipo]: {
          pontuacao: valor,
          risco: risco,
        },
      },
      
      data: new Date(),
    };

    await setDoc(docRef, dados, { merge: true });

    console.log("Resultado salvo com sucesso no documento do usuário:", cns);
  } catch (e) {
    console.error("Erro ao salvar resultado:", e);
  }
}