"use client"; 

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./TagHamilton.module.css"; 

const TagHamilton: React.FC = () => { 
  const [respostas, setRespostas] = useState<{ [key: string]: number }>({}); 
  const [resultado_tag, setResultado] = useState<number | null>(null); 
  const router = useRouter();

  const perguntas = [ 

    "1. Humor Ansioso: Preocupações, previsão do pior, antecipação temerosa, irritabilidade etc.", 

    "2. Tensão: Sensação de tensão, fadiga, reação de sobressalto, comove-se facilmente, tremores, incapacidade para relaxar e agitação.", 

    "3. Medos: De escuro, de estranhos, de ficar sozinho, de animais, de trânsito, de multidões etc.", 

    "4. Insônia: Dificuldade em adormecer, sono interrompido, insatisfeito e fadiga ao despertar, sonhos penosos, pesadelos, terrores noturnos.", 

    "5. Intelectual (cognitivo): Dificuldade de concentração, falhas de memória etc.", 

    "6. Humor Deprimido: Perda de interesse, falta de prazer nos passatempos, depressão, despertar precoce, oscilação do humor.", 

    "7. Somatizações Motoras: Dores musculares, rigidez muscular, contrações espásticas, ranger de dentes, voz insegura etc.", 

    "8. Sintomas Sensoriais: Zumbido, visão turva, dormência, sensação de formigamento etc.", 

    "9. Sintomas Cardiovasculares: Taquicardia, palpitações, dores torácicas, sensação de desmaio etc.", 

    "10. Sintomas Respiratórios: Sensações de opressão, sensação de sufocamento ou asfixia, suspiros, dispneia etc.", 

    "11. Sintomas Gastrointestinais: Dificuldade na deglutição, dores abdominais, azia, náuseas, vômitos etc.", 

    "12. Sintomas Geniturinários: Micção frequente, urgência urinária, falta de controle da bexiga etc.", 

    "13. Sintomas Autonômicos: Boca seca, rubor, palidez, vertigem, cefaleia tensional etc.", 

    "14. Comportamento na entrevista: Inquietação, tremores, rosto tenso, respiração rápida, palidez etc." 

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
                <li>Testes Anteriores</li> 
                <li>Novo Teste</li> 
                <li>Sair</li> 
              </ul> 
            </nav> 
      </header> 

      <div className={styles.container}> 
        <fieldset className={styles.fieldsets}> 
          <h1>Tabela de Transtorno de Ansiedade Generalizada (TAG) de Hamilton</h1> 
          
          <form onSubmit={handleSubmit}> 
            {perguntas.map((pergunta, index) => ( 
              <div key={index} className={styles.question}> 
                <h3>{pergunta}</h3> 
                {[0, 1, 2, 3, 4].map((valor) => ( 

                  <label key={valor}> 
                    <input 
                      type="radio" 
                      name={`pergunta${index + 1}`} 
                      value={valor} 
                      onChange={handleChange} 
                    /> {valor} 
                  </label> 
                ))} 
              </div> 
            ))} 

            <button type="submit">Próxima Pergunta</button> 
          </form> 
        </fieldset> 
      </div> 
  </>   
  ); 
}; 

export default TagHamilton;