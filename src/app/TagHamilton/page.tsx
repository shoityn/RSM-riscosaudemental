"use client";

import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from "./TagHamilton.module.css";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { salvarResultado } from "../lib/firebaseUtils";

const TagHamilton: React.FC = () => {
  const [respostas, setRespostas] = useState<{ [key: string]: number }>({});
  const [resultado_tag, setResultado] = useState<number | null>(null);
  const [risco_tag, setRisco] = useState<string | null>(null);
  const router = useRouter();

    // Usando useSearchParams para pegar o parâmetro 'cns' da URL
    const searchParams = useSearchParams();
    const cns = searchParams.get('cns'); // Aqui pegamos o parâmetro da URL

  const perguntas = [
    {
      titulo: "1. Humor Ansioso:",
      descricao: "Sintomas: Preocupações, previsão do pior, antecipação temerosa, irritabilidade etc."
    },
    {
      titulo: "2. Tensão:",
      descricao: "Sintomas: Sensação de tensão, fadiga, reação de sobressalto, comove-se facilmente, tremores, incapacidade para relaxar e agitação."
    },
    {
      titulo: "3. Medos:",
      descricao: "Sintomas: De escuro, de estranhos, de ficar sozinho, de animais, de trânsito, de multidões etc."
    },
    {
      titulo: "4. Insônia:",
      descricao: "Sintomas: Dificuldade em adormecer, sono interrompido, insatisfeito e fadiga ao despertar, sonhos penosos, pesadelos, terrores noturnos."
    },
    {
      titulo: "5. Intelectual (cognitivo):",
      descricao: "Sintomas: Dificuldade de concentração, falhas de memória etc."
    },
    {
      titulo: "6. Humor Deprimido:",
      descricao: "Sintomas: Perda de interesse, falta de prazer nos passatempos, depressão, despertar precoce, oscilação do humor."
    },
    {
      titulo: "7. Somatizações Motoras:",
      descricao: "Sintomas: Dores musculares, rigidez muscular, contrações espásticas, ranger de dentes, voz insegura etc."
    },
    {
      titulo: "8. Sintomas Sensoriais:",
      descricao: "Sintomas: Zumbido, visão turva, dormência, sensação de formigamento etc."
    },
    {
      titulo: "9. Sintomas Cardiovasculares:",
      descricao: "Sintomas: Taquicardia, palpitações, dores torácicas, sensação de desmaio etc."
    },
    {
      titulo: "10. Sintomas Respiratórios:",
      descricao: "Sintomas: Sensações de opressão, sensação de sufocamento ou asfixia, suspiros, dispneia etc."
    },
    {
      titulo: "11. Sintomas Gastrointestinais:",
      descricao: "Sintomas: Dificuldade na deglutição, dores abdominais, azia, náuseas, vômitos etc."
    },
    {
      titulo: "12. Sintomas Geniturinários:",
      descricao: "Sintomas: Micção frequente, urgência urinária, falta de controle da bexiga etc."
    },
    {
      titulo: "13. Sintomas Autonômicos:",
      descricao: "Sintomas: Boca seca, rubor, palidez, vertigem, cefaleia tensional etc."
    },
    {
      titulo: "14. Comportamento na entrevista:",
      descricao: "Sintomas: Inquietação, tremores, rosto tenso, respiração rápida, palidez etc."
    }
  ];

  useEffect(() => {
    // Verifique se o 'cns' foi carregado corretamente
    console.log(cns);
  }, [cns]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRespostas((prevRespostas) => ({
      ...prevRespostas,
      [name]: parseInt(value),
    }));
  };

  const calcularRisco = (pontos: number): string => {
    if (pontos >= 0 && pontos <= 18) return "Baixo Risco";
    if (pontos >= 19 && pontos <= 37) return "Médio Risco";
    if (pontos >= 38 && pontos <= 56) return "Alto Risco";
    return "Indefinido";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Object.keys(respostas).length < perguntas.length) {
      console.error("Por favor, responda todas as perguntas.");
      return;
    }

    const pontos = Object.values(respostas).reduce((total, valor) => total + (valor || 0), 0);
    const TagHamilton_risco = calcularRisco(pontos);
    setResultado(pontos);
    setRisco(TagHamilton_risco);

    if (!cns) {
      console.error("CNS não encontrado para o usuário");
      return;
    }

    await salvarResultado(cns,"TagHamilton", pontos,TagHamilton_risco);

    router.push(`/ERSM_SESA?cns=${cns}`);
  }; 

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/'); // Redireciona para a página de login
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
      <h1 className={styles.tituloTabela}>Tabela de Transtorno de Ansiedade Generalizada (TAG) de Hamilton</h1>
        <fieldset className={styles.fieldsets}>
          
          <form onSubmit={handleSubmit}>
            {perguntas.map((pergunta, index) => (
              <div key={index} className={styles.questao}>
                <strong>{pergunta.titulo}</strong>
                <p>{pergunta.descricao}</p>
                {[0, 1, 2, 3, 4].map((valor) => (

                  <label className={styles.label}  key={valor}>
                    <input className={styles.input}
                      type="radio"
                      name={`pergunta${index + 1}`}
                      value={valor}
                      onChange={handleChange}
                    /> {valor}
                  </label>
                ))}
              </div>
            ))}

            <div className={styles.buttonContainer}>
              <button className={styles.button} type="submit">Próxima Pergunta</button>
            </div>
          </form>
        </fieldset>
      </div>
  </>   
  ); 
}; 

export default TagHamilton;