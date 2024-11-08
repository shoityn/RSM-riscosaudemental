"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./TagHamilton.module.css";

const TagHamilton: React.FC = () => {
  const [respostas, setRespostas] = useState<{ [key: string]: number }>({});
  const [resultado_tag, setResultado] = useState<number | null>(null);
  const router = useRouter();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRespostas((prevRespostas) => ({
      ...prevRespostas,
      [name]: parseInt(value),
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const pontos = Object.values(respostas).reduce((total, valor) => total + (valor || 0), 0);
    setResultado(pontos);

    //router.push('/');
  }; 

  return (
    <> 
      <header className={styles.header}>
            <h1 className={styles.title}>Risco Saúde Mental</h1>
            <nav className={styles.nav}>
              <ul>
                <li><a href="">Histórico</a></li>
                <li><a href="">Novo Teste</a></li>
                <li>Sair</li>
              </ul>
            </nav>
      </header>

      <div className={styles.container}>
        <fieldset className={styles.fieldsets}>
          <h1 className={styles.tituloTabela}>Tabela de Transtorno de Ansiedade Generalizada (TAG) de Hamilton</h1>
          
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