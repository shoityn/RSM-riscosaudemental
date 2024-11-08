"use client";

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./PHQ.module.css"; 

const PHQ = () => {
  const [respostas, setRespostas] = useState<{ [key: string]: number }>({});
  const [resultado_phq, setResultado] = useState<number | null>(null);
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('');

  const perguntas = [  
    "1. Pouco interesse ou pouco prazer em fazer as coisas:",

    "2. Se sentir para baixo, deprimido ou sem perspectiva:",

    "3. Dificuldade para pegar no sono ou permanecer dormindo, ou dormir mais do que de costume:",

    "4. Se sentir cansado(a) ou com pouca energia:",

    "5. Falta de apetite ou comendo demais:",

    "6. Se sentir mal contigo mesmo(a) - ou achar que você é um fracasso ou que decepcionou sua família ou você mesmo(a):",

    "7. Dificuldade para se concentrar nas coisas, como ler o jornal ou ver telivisão:",

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const pontos = Object.values(respostas).reduce((total, valor) => total + (valor || 0), 0);
    setResultado(pontos);

    router.push('/TagHamilton');
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
          <h1 className={styles.tituloTabela}>Durante as últimas 2 semanas, com que frequência você foi incomodado(a) por qualquer um dos problemas abaixo?</h1>
          
          <form onSubmit={handleSubmit}>
            {perguntas.map((pergunta, index) => (
              <div key={index} className={styles.questao}>
                <p>{pergunta}</p>
                {["Nenhuma vez", "Vários dias", "Mais da metade dos dias", "Quase todos os dias"].map((valor) => (

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

export default PHQ;