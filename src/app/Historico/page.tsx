"use client";

import React, { useEffect, useState } from 'react';
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useRouter } from 'next/navigation';
import styles from "./Historico.module.css";

const Historico: React.FC = () => {
  const [resultados, setResultados] = useState<{ cns: string; data: string; testes: { nome: string; valor: number; risco: string }[] }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const carregarResultados = async () => {
      const cnsAtual = sessionStorage.getItem('cns');
  
      if (!cnsAtual) {
        router.push('/');
        return;
      }
      
      try {
        const resultadosQuery = query(collection(db, "resultados"), where("cns", "==", cnsAtual));
        const querySnapshot = await getDocs(resultadosQuery);
        
        const resultadosCarregados = querySnapshot.docs.map(doc => ({
          cns: doc.data().cns,
          data: doc.data().data.toDate().toLocaleDateString(),
          testes: [
            { nome: "PHQ", valor: doc.data().PHQ_valor, risco: doc.data().PHQ_risco },
            { nome: "TagHamilton", valor: doc.data().TagHamilton_valor, risco: doc.data().TagHamilton_risco },
            { nome: "ERSM_SESA", valor: doc.data().ERSM_SESA_valor, risco: doc.data().ERSM_SESA_risco }
          ]
        }));
        
        setResultados(resultadosCarregados);
      } catch (error) {
        console.error("Erro ao carregar resultados:", error);
      } finally {
        setIsLoading(false); // Finaliza o carregamento, independentemente do sucesso ou falha
      }
    };
  
    carregarResultados();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>Risco Saúde Mental</h1>
        <nav className={styles.nav}>
          <ul>
            <li><a href="/Historico">Histórico</a></li>
            <li><a href="/PHQ">Novo Teste</a></li>
            <li onClick={handleLogout} style={{ cursor: 'pointer' }}>Sair</li>
          </ul>
        </nav>
      </header>

      <div className={styles.container}>
        <h1 className={styles.tituloHistorico}>Histórico de Resultados</h1>
        {isLoading ? (
          <p className={styles.loadingMessage}>Carregando resultados...</p>
        ) : resultados.length === 0 ? (
          <p className={styles.emptyMessage}>Nenhum resultado encontrado.</p>
        ) : (
          resultados.map((resultado, index) => (
            <div className={styles.historicoCard} key={index}>
              <div className={styles.headerCard}>
                <p><strong>CNS:</strong> {resultado.cns}</p>
                <p className={styles.data}>Realizado: {resultado.data}</p>
              </div>
              <div className={styles.resultados}>
                {resultado.testes.map((teste, testeIndex) => (
                  <p key={testeIndex} className={styles.teste}>
                    <strong>{teste.nome}:</strong> {teste.valor} {teste.risco}
                  </p>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Historico;