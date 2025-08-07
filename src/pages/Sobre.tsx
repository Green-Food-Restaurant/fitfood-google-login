import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Sobre = () => {
  return (
    <div className="min-h-screen bg-[#F9FDF7] text-gray-800 flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <section className="mb-10">
          <h1 className="text-4xl font-bold text-green-700 mb-4">Quem Somos</h1>
          <p className="text-lg text-gray-700 mb-4">
            Somos apaixonados por saúde, sabor e praticidade. Nossa missão é transformar a forma como as pessoas se alimentam, oferecendo comidas fitness que unem nutrição, sabor e conveniência no dia a dia corrido.
          </p>
          <p className="text-lg text-gray-700">
            Criamos este projeto com um objetivo claro: facilitar sua rotina com refeições saudáveis, equilibradas e deliciosas, prontas para consumo, sem abrir mão da qualidade e do sabor.
          </p>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-green-600 mb-3">Nossa História</h2>
          <p className="text-gray-700 mb-2">
            A ideia nasceu da própria necessidade de manter uma alimentação saudável em meio à correria. Percebemos como era difícil encontrar opções realmente fitness, saborosas e com ingredientes de verdade. Então decidimos fazer diferente: desenvolver receitas pensadas com carinho, por profissionais da área de nutrição e gastronomia.
          </p>
          <p className="text-gray-700">
            Hoje, temos orgulho de entregar refeições que ajudam nossos clientes a atingirem seus objetivos – seja emagrecimento, ganho de massa, ou simplesmente uma vida mais saudável.
          </p>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-green-600 mb-3">Nosso Compromisso</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Ingredientes frescos e naturais</li>
            <li>Zero conservantes artificiais</li>
            <li>Porções balanceadas</li>
            <li>Variedade no cardápio</li>
            <li>Prontinho para consumir</li>
          </ul>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-green-600 mb-3">Uma Mensagem Para Você</h2>
          <p className="text-lg text-gray-700 mb-2">
            Cuidar da alimentação não precisa ser complicado.<br />
            Estamos aqui para mostrar que é possível comer bem, com sabor e sem culpa.<br />
            Mais energia, mais saúde, mais tempo pra você.
          </p>
          <p className="text-lg font-semibold text-green-700">Bem-vindo(a) à sua nova rotina fitness.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Sobre;
