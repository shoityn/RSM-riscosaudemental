"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./PHQ.module.css"; 

const PHQ = () => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
};

  // Redireciona para a página sem o uso de `event`
  const handleNavigate = () => {
    alert(`Opção selecionada: ${selectedOption}`);
    router.push('/TagHamilton');
  };

  return (
    <div>
      <h1>Dados do Paciente</h1>
      
      <form>
        <div>
          <label>
            <input
              type="radio"
              value="option1"
              checked={selectedOption === 'option1'}
              onChange={handleChange}
            />
            Opção 1
          </label>
        </div>

        <div>
          <label>
            <input
              type="radio"
              value="option2"
              checked={selectedOption === 'option2'}
              onChange={handleChange}
            />
            Opção 2
          </label>
        </div>

        <div>
          <label>
            <input
              type="radio"
              value="option3"
              checked={selectedOption === 'option3'}
              onChange={handleChange}
            />
            Opção 3
          </label>
        </div>

        {/* Botão com onClick para evitar o uso do event */}
        <button type="button" onClick={handleNavigate}>Enviar</button>
      </form>
    </div>
  );
};

export default PHQ;