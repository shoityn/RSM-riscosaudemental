"use client";

import React, { useEffect, useState } from 'react';
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useRouter, useSearchParams } from 'next/navigation';
import styles from "./Historico.module.css";

const Historico: React.FC = () => {
  const [resultados, setResultados] = useState<{ cns: string; data: string; testes: { nome: string; valor: number; risco: string }[] }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Usando useSearchParams para pegar o parâmetro 'cns' da URL
  const searchParams = useSearchParams();
  const cns = searchParams.get('cns'); // Aqui pegamos o parâmetro da URL
  
  useEffect(() => {
    console.log("CNS na URL:", cns);  // Verifique se o cns está correto
    const carregarResultados = async () => {
      if (!cns) {
        console.error("CNS não encontrado na URL.");
        return;
      }
      
      try {
        const resultadosQuery = query(collection(db, "resultados"), where("cns", "==", cns));
        const querySnapshot = await getDocs(resultadosQuery);
        console.log("QuerySnapshot:", querySnapshot);  // Verifique o que é retornado pela consulta
        
        const resultadosCarregados = querySnapshot.docs.map(doc => ({
          cns: doc.data().cns,
          data: doc.data().data?.toDate ? doc.data().data.toDate().toLocaleDateString() : "Data não disponível",
          testes: [
            { nome: "PHQ", valor: doc.data().PHQ_valor || 0, risco: doc.data().PHQ_risco || "Indefinido" },
            { nome: "TagHamilton", valor: doc.data().TagHamilton_valor || 0, risco: doc.data().TagHamilton_risco || "Indefinido" },
            { nome: "ERSM_SESA", valor: doc.data().ERSM_SESA_valor || 0, risco: doc.data().ERSM_SESA_risco || "Indefinido" }
          ]
        }));
        
        if (resultadosCarregados.length > 0) {
          setResultados(resultadosCarregados);
        } else {
          console.log("Nenhum resultado encontrado para o CNS fornecido.");
        }
      } catch (error) {
        console.error("Erro ao carregar resultados:", error);
      } finally {
        setIsLoading(false); // Finaliza o carregamento, independentemente do sucesso ou falha
      }
    };
  
    carregarResultados();
  }, [cns]);
  
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
            <li><a href={`/Historico?cns=${cns}`}>Histórico</a></li>
            <li><a href={`/PHQ?cns=${cns}`}>Novo Teste</a></li>
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