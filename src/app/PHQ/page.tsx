"use client";

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCns } from '../cnsContext'; 
import styles from "./PHQ.module.css";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { salvarResultado } from "../lib/firebaseUtils";

const PHQ: React.FC = () => {
  const { cns } = useCns(); // Pegando o CNS do contexto
  const [respostas, setRespostas] = useState<{ [key: string]: number }>({});
  const [resultado_phq, setResultado] = useState<number | null>(null);
  const [risco_phq, setRisco] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const perguntas = [
    "1. Pouco interesse ou pouco prazer em fazer as coisas:",
    "2. Se sentir para baixo, deprimido ou sem perspectiva:",
    "3. Dificuldade para pegar no sono ou permanecer dormindo, ou dormir mais do que de costume:",
    "4. Se sentir cansado(a) ou com pouca energia:",
    "5. Falta de apetite ou comendo demais:",
    "6. Se sentir mal contigo mesmo(a) - ou achar que você é um fracasso ou que decepcionou sua família ou você mesmo(a):",
    "7. Dificuldade para se concentrar nas coisas, como ler o jornal ou ver televisão:",
    "8. Lentidão para se movimentar ou falar, a ponto das outras pessoas perceberem? Ou o oposto - estar tão agitado(a) ou irrequieto(a) que você fica andando de um lado para o outro muito mais do que de costume:",
    "9. Pensar em se ferir de alguma maneira ou que seria melhor estar morto(a):"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRespostas((prevRespostas) => ({
      ...prevRespostas,
      [name]: parseInt(value),
    }));
  };

  const calcularRisco = (pontos: number): string => {
    if (pontos >= 0 && pontos <= 9) return "Baixo Risco";
    if (pontos >= 10 && pontos <= 19) return "Médio Risco";
    if (pontos >= 20 && pontos <= 27) return "Alto Risco";
    return "Indefinido";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCarregando(true);

    const pontos = Object.values(respostas).reduce((total, valor) => total + (valor || 0), 0);
    const PHQ_risco = calcularRisco(pontos);
    setResultado(pontos);
    setRisco(PHQ_risco);

    if (!cns) {
      console.error("CNS não encontrado para o usuário");
      setCarregando(false);
      return;
    }

    try {
      await salvarResultado(cns, "PHQ", pontos, PHQ_risco);
      // Navegar para a próxima página
      router.push("/TagHamilton");
    } catch (error) {
      console.error("Erro ao salvar o resultado:", error);
      setCarregando(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/'); // Redirecionando para a página inicial após logout
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
        <h1 className={styles.tituloTabela}>Tabela PHQ-9</h1>
        <fieldset className={styles.fieldsets}>
          <h1 className={styles.subTituloTabela}>
            Durante as últimas 2 semanas, com que frequência você foi incomodado(a) por qualquer um dos problemas abaixo?
          </h1>
          
          <form onSubmit={handleSubmit}>
            {perguntas.map((pergunta, index) => (
              <div key={index} className={styles.questao}>
                <p>{pergunta}</p>
                {["Nenhuma vez", "Vários dias", "Mais da metade dos dias", "Quase todos os dias"].map((valor, idx) => (
                  <label className={styles.label} key={valor}>
                    <input 
                      className={styles.input}
                      type="radio"
                      name={`pergunta${index + 1}`}
                      value={idx}
                      onChange={handleChange}
                      defaultChecked={idx === 0}
                    /> {valor}
                  </label>
                ))}
              </div>
            ))}

            <div className={styles.buttonContainer}>
            <button className={styles.button} type="submit" disabled={carregando}>
                {carregando ? "Aguarde..." : "Próxima Pergunta"}
              </button>
            </div>
          </form>
        </fieldset>
      </div>
    </>
  );
};

export default PHQ;