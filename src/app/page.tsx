"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { db } from "./firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { CnsProvider, useCns } from './cnsContext';
import styles from "./page.module.css";

const generateHash = async (input: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
};

const Home: React.FC = () => {
  const { setCns } = useCns();
  const [inputCns, setInputCns] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const formatCns = (cns: string) => {
    const onlyNumbers = cns.replace(/\D/g, '');
    return onlyNumbers.replace(/(\d{3})(\d{4})(\d{4})(\d{4})?/, '$1 $2 $3 $4').trim();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setInputCns(value); 
    setError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const regex = /^\d{3} \d{4} \d{4} \d{4}$/;
    if (!regex.test(inputCns)) {
      setError('Por favor, preencha o CNS corretamente (15 dígitos).');
      return;
    }

    try {
      const hashedCns = await generateHash(inputCns);
      const userDocRef = doc(db, "usuarios", hashedCns);
      const userDocSnap = await getDoc(userDocRef);

      setCns(inputCns);

      if (userDocSnap.exists()) {
        router.push(`/PHQ?cns=${hashedCns}`);
      } else {
        await setDoc(userDocRef, { cns: inputCns });
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
              value={formatCns(inputCns)}
              onChange={handleChange}
              maxLength={18}
              className={styles.input}
            />
            <br />
            {error && <p className={styles.error}>{error}</p>} {}
            <button type="submit" className={styles.button}>Fazer Teste</button>
          </form>
        </div>
      </div>
    </>
  );
};

const HomeWithProvider: React.FC = () => {
  return (
    <CnsProvider>
      <Home />
    </CnsProvider>
  );
};

export default Home;