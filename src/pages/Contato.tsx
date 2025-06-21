import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const endereco = "Rua das Palmeiras, 123 - Centro, Santo André - SP, 09010-000";
const telefone = "(11) 4002-8922";

const Contato = () => {
  return (
    <div className="min-h-screen bg-[#F9FDF7] dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1 space-y-6">
          <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">Fale Conosco</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Tem alguma dúvida, sugestão ou precisa de ajuda? Entre em contato conosco!
          </p>
          <div className="space-y-2">
            <div>
              <span className="font-semibold">Endereço:</span> {endereco}
            </div>
            <div>
              <span className="font-semibold">Telefone:</span> {telefone}
            </div>
            <div>
              <span className="font-semibold">E-mail:</span> contato@fitfood.com.br
            </div>
          </div>
        </div>
        <div className="flex-1 w-full max-w-md">
          {/* Mapa simples do Google Maps */}
          <iframe
            title="Localização FitFood"
            src="https://www.google.com/maps?q=Rua+das+Palmeiras,+123,+Santo+André,+SP&output=embed"
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: "1rem", boxShadow: "0 2px 16px #0001" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contato;
