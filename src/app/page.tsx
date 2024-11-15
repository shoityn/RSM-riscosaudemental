"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { db } from "./firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import styles from "./page.module.css";

// Função para gerar o hash SHA-256 de um CNS
const generateHash = async (input: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
};

const Home: React.FC = () => {
  const [cns, setCns] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value.replace(/(\d{3})(\d{4})(\d{4})(\d{4})?/, '$1 $2 $3 $4').trim();
    setCns(formattedValue);
    setError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const regex = /^\d{3} \d{4} \d{4} \d{4}$/;
    if (!regex.test(cns)) {
      setError('Por favor, preencha o CNS corretamente (15 dígitos).');
      return;
    }

    //Código para salvar com Id automático
    // try {
    //   const docRef = await addDoc(collection(db, "usuarios"), {
    //     cns: cns,    
    //   });
    //   console.log("Document written with ID: ", docRef.id);
    // } catch (e) {
    //   console.error("Error adding document: ", e);
    // }

    //TODO primeiro fazer o hashcode do CNS

    try {
      const hashedCns = await generateHash(cns);
      const userDocRef = doc(db, "usuarios", hashedCns);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        router.push(`/PHQ?cns=${hashedCns}`);
      } else {
        await setDoc(userDocRef, {
          cns: cns,
        });

        router.push(`/PHQ?cns=${hashedCns}`);
      }
    } catch (error) {
      console.error("Erro ao salvar o CNS:", error);
      setError('Erro ao salvar o CNS.');
    }
  };

  return (
    <>
      <Head>
        <title>Risco Saúde Mental</title>
      </Head>
      
      <header className={styles.header}>
        <h1 className={styles.title}>Risco Saúde Mental</h1>
      </header>

      <div className={styles.container}>
        <div className={styles.overlay}></div>
        <div className={styles.content}>
          <h1>Digite o CNS do Paciente:</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="000 0000 0000 0000"
              value={cns}
              onChange={handleChange}
              maxLength={18}
              className={styles.input}
            />
            <br />
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.button}>Fazer Teste</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Home;