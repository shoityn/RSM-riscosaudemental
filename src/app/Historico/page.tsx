'use client';

import React, { useEffect, useState } from 'react';
import { useCns } from '../cnsContext';
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useRouter } from 'next/navigation';
import styles from "./historico.module.css";

// Interface para definir o formato dos testes
interface Teste {
  nome: string;
  valor: number;
  risco: string;
  data?: string;
}

// Interface para definir o formato dos resultados
interface Resultado {
  cns: string;
  data?: string;
  testes: Teste[];
}

const Historico: React.FC = () => {
  const { cns } = useCns();
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const carregarResultados = async () => {
      if (!cns) return;

      try {
        const docRef = doc(db, "resultados", cns);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const dados = docSnap.data();
          const resultadosAgrupados: Resultado[] = [];

          if (dados.resultados) {
            const chavesResultados = Object.keys(dados.resultados);
            const testesAgrupados: { [index: number]: Teste[] } = {};

            chavesResultados.forEach((tipo) => {
              const resultado = dados.resultados[tipo];

              if (resultado && Array.isArray(resultado)) {
                resultado.forEach((item: any, index: number) => {
                  const dataTeste = item.data instanceof Timestamp
                    ? item.data.toDate().toLocaleDateString()
                    : "Data não disponível";

                  if (!testesAgrupados[index]) {
                    testesAgrupados[index] = [];
                  }

                  testesAgrupados[index].push({
                    nome: tipo || "Tipo desconhecido",
                    valor: item.pontuacao ?? 0,
                    risco: item.risco ?? "Desconhecido",
                    data: dataTeste,
                  });
                });
              }
            });

            Object.values(testesAgrupados).forEach((testes) => {
              if (testes.length === 3) {
                const testesOrdenados = ["PHQ", "TagHamilton", "ERSM_SESA"].map(
                  (tipo) => testes.find((teste) => teste.nome === tipo) || { nome: tipo, valor: 0, risco: "Desconhecido" }
                );

                resultadosAgrupados.push({
                  cns: dados.CNS || "CNS não informado",
                  data: testesOrdenados[0]?.data ?? "Data não disponível",
                  testes: testesOrdenados,
                });
              }
            });
          }

          setResultados(resultadosAgrupados);
        } else {
          console.log("Nenhum resultado encontrado para o CNS fornecido.");
        }
      } catch (error) {
        console.error("Erro ao carregar resultados:", error);
      } finally {
        setIsLoading(false);
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
            <li><a onClick={() => router.push("/Historico")}>Histórico</a></li>
            <li><a onClick={() => router.push("/PHQ")}>Novo Teste</a></li>
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
                {Array.isArray(resultado.testes) && resultado.testes.length > 0 ? (
                  resultado.testes.map((teste, testeIndex) => (
                    teste ? (
                      <div key={testeIndex} className={styles.testeGrupo}>
                        <p className={styles.teste}>
                          <strong>{teste.nome || "Teste desconhecido"}:</strong> 
                          {teste.valor !== undefined ? ` ${teste.valor}` : " -"} 
                          {teste.risco ? ` ${teste.risco}` : ""}
                        </p>
                      </div>
                    ) : null
                  ))
                ) : (
                  <p>Nenhum teste disponível.</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Historico;