"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import styles from "./page.module.css";

const Home: React.FC = () => {
  const [cns, setCns] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value.replace(/(\d{3})(\d{4})(\d{4})(\d{4})?/, '$1 $2 $3 $4')
            .trim();
    setCns(formattedValue);
    setError(''); // Limpa o erro ao alterar o input
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const regex = /^\d{3} \d{4} \d{4} \d{4}$/;
    if (!regex.test(cns)) {
      setError('Por favor, preencha o CNS corretamente (15 dígitos).');
      return;
    }

    router.push(`/PHQ?cns=${cns}`);
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
            /><br></br>
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.button}>Fazer Teste</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Home;