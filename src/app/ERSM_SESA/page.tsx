"use client";

import { FormEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from "./ERSM.module.css"; 
import { signOut } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { salvarResultado } from "../lib/firebaseUtils";

const ERSM_SESA: React.FC = () => {
  const [respostas, setRespostas] = useState<{ [key: string]: number }>({});
  const [resultado_ersm, setResultado] = useState<number | null>(null);
  const [risco, setRisco] = useState<string | null>(null);
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('');
  
  // Usando useSearchParams para pegar o parâmetro 'cns' da URL
  const searchParams = useSearchParams();
  const cns = searchParams.get('cns'); // Aqui pegamos o parâmetro da URL

  const valoresSim = [4, 2, 2, 2, 2, 2, 2, 2, 4, 4, 2, 2, 4, 10, 4, 6, 8, 4, 4, 4, 8, 8, 6, 8, 2, 10, 8, 8, 8, 6, 8, 4, 4, 4, 4, 8, 2, 6, 4, 4, 4, 4, 4, 2, 6, 6, 4, 2, 2, 4, 6, 2];
  let questionIndex = 0; // índice absoluto
  
  const perguntas= {
    G1: [
      "1. Ansiedade ou medo persistente, sem causa ou explicação definida, com manifestações como sudorese, tremor, taquicardia, sintomas digestivos e/ou episódios de sensação de morte iminente, de enlouquecer ou de perder o controle:",

      "2. Insônia ou hipersonia:",

      "3. Medo intenso e persistente de alguma coisa ou alguma situação bem definida que não apresente risco real (fobia):",

      "4. Crises conversivas (distúrbios sensórios sem base física) e/ou dissociativas (alteração da qualidade da consciência, estreita/rebaixada:",

      "5. Alterações do apetite ou do comportamento alimentar:",

      "6. Preocupação excessiva com o peso e/ou a forma corporal com distorção da autoimagem:",

      "7. Queixas físicas (somáticas) persistentes sem causa aparente e/ou hipocondriacas:",

      "8. Pensamentos ou comportamentos repetitivos/compulsivos com ou sem rituais obsessivos:",

      "9. Pensamentos de inutilidade e/ou sentimento de culpa (situações nas quais pode não haver vinculação com a realidade):",

      "10. Tristeza persistente acompanhada de perda de interesse e prazer eou desesperança sem causa aparente:",

      "11. Prejuizo da atividade sexual (perda ou aumento do desejo sexual, impotência, frigidez, dor na penetração, entre outros):",

      "12. Desorientação temporal e/ou espacial:"
    ],

    G2: [  
      "1. Ideação suicida sem planejamento:",

      "2. Ideação suicida com planejamento? ou histórico de tentativa de suicídio recente (últimos 12 meses):",

      "3. Apatia, diminuição do desempenho social, distanciamento afetivo e/ou afastamento do convivio social e familiar:",

      "4. Humor instável associado a impulsividade e comportamentos destrutivos:",

      "5. Heteroagressividade ou comportamento autolesivo:",

      "6. Desinibição social, sexual e/ou perda da noção de pudor:",

      "7. Aumento da atividade motora com ou sem inquietação excessiva constante:",

      "8. Humor anormalmente elevado, expansivo, İrritável ou eufórico:",

      "9. Delírio (ideias criadas e/ou distorcidas da realidade cujo questionamento não é tolerado):",

      "10. Alucinação (percepção visual, auditiva, gustativa, olfativa, ou tátil sem a presença de objetos reais):",

      "11. Alteração do curso e/ou da forma do pensamento (pode estar acelerado, lentificado ou interrompido):",

      "12. Perda da capacidade de julgamento da realidade sem que haja consciência ou noção desta alteração:",

      "13. Alteração da memória (perda, excesso ou lapso):"
    ],

    G3: [  
      "1. Deliriurn tremens (diminuição do nível da consciência, tremores, febre, sudorese, alucinações de pequenos insetos e animais e outros sintomas que surgem após 72 horas de abstinência alcoólica):",

      "2. Tremor associado ao hálito etílico e sudorese etílica:",

      "3. Incapacidade de redução e controle do uso de substâncias psicoativas (mantém o uso apesar do prejuízo):",

      "4. Manifestação de comportamento de risco para si e para terceiros sob efeito de substâncias:",

      "5. Consumo progressivo de substância psicoativa sem obter efeito esperado (tolerância):",

      "6. Uso abusivo de Substâncias Psicoativas:"
    ],

    G4: [  
      "1. Dificuldade de compreender e/ou transmitir informação através da fala e linguagem no período de desenvolvimento infantil:",

      "2. Movimentos corporais ou comportamentais repetitivos, bizarros ou paralisados:",

      "3. Dificuldade para adquirir e desenvolver as habilidades escolares:",

      "4. Dificuldade para adquirir e desenvolver as habilidades motoras:",

      "5. Severa dificuldade na interação social e as mudanças na rotina",

      "6. Desatenção com interrupção prematura de tarefas e/ou delxando tarefas inacabadas:",

      "7. Comportamento provocativo, desafiador e/ou oposito persistente:",

      "8. Comportamentos ou reações emocionais que não correspondem ào esperado para a idade biológica:"
    ],

    G5: [  
      "1. Resistência ao tratamento, refratariedade ou não adesão:",

      "2. Recorrência ou Recaida (02 meses após desaparecimento dos sintomas):",

      "3. Exposição continuada ao estresse ou evento traumático acima do individualmente suportável:",

      "4. Precariedade de suporte familiar e/ou social com ou sem isolamento social e distanciamento afetivo:",

      "5. Testemunha de violência",

      "6. Autor ou Vitima de violência interpessoal:",

      "7. Perda da funcionalidade familiar e/ou social fautonomia):",

      "8. Perda progressiva da capacidade funcional, ocupacional e social decorrentes de um agravo de saúde:",

      "9. Vulnerabilidade social:",

      "10. Histórico familiar de transtorno mental / dependência química / suicídio:",

      "11. Comorbidade ou outra condição crônica de saúde associada:",

      "12. Faixa etária menores de 18 anos e maiores de 60 anos:",

      "13. Abandono e/ou atraso escolar:"
    ],
  }

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
    if (pontos >= 0 && pontos <= 40) return "Baixo Risco";
    if (pontos >= 42 && pontos <= 70) return "Médio Risco";
    if (pontos >= 72 && pontos <= 240) return "Alto Risco";
    return "Indefinido";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const pontos = Object.values(respostas).reduce((total, valor) => total + (valor || 0), 0);
    const riscoCalculado = calcularRisco(pontos);
    setResultado(pontos);
    setRisco(riscoCalculado);

    if (!cns) {
      console.error("CNS não encontrado para o usuário");
      return;
    }

    await salvarResultado(cns,"ERSM_SESA", pontos, riscoCalculado);

    router.push(`/Historico?cns=${cns}`);
  };

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
          
        <form onSubmit={handleSubmit}>
        <h1 className={styles.tituloTabela}>Tabela ERSM</h1>

            {Object.entries(perguntas).map(([grupo, questoes], groupIndex) => (
              <fieldset key={grupo} className={styles.grupoFieldset}>
                <h2 className={styles.grupoTitulo}>{`Grupo ${groupIndex + 1}`}</h2>
                
                {questoes.map((pergunta, index) => (
                  <div key={`${grupo}-${index}`} className={styles.questao}>
                    <p>{pergunta}</p>
                    {["Sim", "Não"].map((valor, valorIndex) => (
                      <label className={styles.label} key={`${grupo}-${index}-${valorIndex}`}>
                        <input 
                          className={styles.input}
                          type="radio"
                          name={`${grupo}-${index}`}
                          value={valor === "Sim" ? valoresSim[questionIndex++] : 0}
                          onChange={handleChange}
                        /> 
                        {valor}
                      </label>
                    ))}
                  </div>
                ))}
              </fieldset>
            ))}
          
          <div className={styles.buttonContainer}>
            <button className={styles.button} type="submit">Finalizar Teste</button>
          </div>
        </form>
      </div>
  </> 
  );
};

export default ERSM_SESA;