"use client";

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./PHQ.module.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { salvarResultado } from "../lib/firebaseUtils";

const PHQ: React.FC = () => {
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const pontos = Object.values(respostas).reduce((total, valor) => total + (valor || 0), 0);
    setResultado(pontos);

    await salvarResultado("PHQ", pontos);

    router.push('/TagHamilton');
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
                <li><a href="/Historico">Histórico</a></li>
                <li><a href="/PHQ">Novo Teste</a></li>
                <li onClick={handleLogout} style={{ cursor: 'pointer' }}>Sair</li>
              </ul>
            </nav>
      </header>

      <div className={styles.container}>
      <h1 className={styles.tituloTabela}>Tabela PHQ-9</h1>
        <fieldset className={styles.fieldsets}>
          <h1 className={styles.subTituloTabela}>Durante as últimas 2 semanas, com que frequência você foi incomodado(a) por qualquer um dos problemas abaixo?</h1>
          
          <form onSubmit={handleSubmit}>
            {perguntas.map((pergunta, index) => (
              <div key={index} className={styles.questao}>
                <p>{pergunta}</p>
                {["Nenhuma vez", "Vários dias", "Mais da metade dos dias", "Quase todos os dias"].map((valor, idx) => (

                  <label className={styles.label}  key={valor}>
                    <input className={styles.input}
                      type="radio"
                      name={`pergunta${index + 1}`}
                      value={idx}
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