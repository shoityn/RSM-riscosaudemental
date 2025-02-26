import { doc, updateDoc, getDoc, arrayUnion, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const salvarResultado = async (cns: string, tipo: string, valor: number, risco: string) => {
  try {
    const docRef = doc(db, "resultados", cns);
    const docSnap = await getDoc(docRef);

    const novoResultado = {
      pontuacao: valor,
      risco: risco,
      data: new Date(),
    };

    if (docSnap.exists()) {
      // O documento já existe, então adicionamos o novo teste ao array dentro do tipo correspondente
      await updateDoc(docRef, {
        [`resultados.${tipo}`]: arrayUnion(novoResultado),
      });
    } else {
      // Criamos um novo documento com o primeiro resultado dentro de um array
      await setDoc(docRef, {
        CNS: cns,
        data: new Date(),
        resultados: {
          [tipo]: [novoResultado], // Inicializa com um array
        },
      });
    }
  } catch (e) {
    console.error("Erro ao salvar resultado:", e);
  }
};
