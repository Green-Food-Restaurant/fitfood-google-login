import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CTASection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-green-600 to-green-400 text-white">
      <div className="container mx-auto px-6 text-center">
        <motion.h2 
          className="text-3xl lg:text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Pronto para começar sua jornada saudável?
        </motion.h2>
        <motion.p 
          className="text-lg mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Junte-se a milhares de pessoas que já transformaram sua alimentação com o Green Food. O primeiro pedido tem 15% de desconto!
        </motion.p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/produtos" className="inline-block bg-white text-green-600 font-bold px-8 py-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
            Fazer Pedido Agora
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
