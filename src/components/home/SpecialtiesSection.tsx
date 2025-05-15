import React from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { FaCarrot, FaAppleAlt, FaDrumstickBite } from 'react-icons/fa';

interface SpecialtiesSectionProps {
  scrollYProgress: MotionValue<number>;
}

const SpecialtiesSection: React.FC<SpecialtiesSectionProps> = ({ scrollYProgress }) => {
  const specialtiesY = useTransform(scrollYProgress, [0.1, 0.3], [50, 0]);
  
  return (
    <motion.section 
      id="especialidades" 
      className="py-20 bg-white"
      style={{ y: specialtiesY }}
    >
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            className="text-green-600 font-medium"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            O QUE OFERECEMOS
          </motion.span>
          <motion.h2 
            className="text-3xl lg:text-4xl font-bold mt-2 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Nossas Especialidades
          </motion.h2>
          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Desfrute de nossas opções balanceadas e saborosas, preparadas com ingredientes frescos e técnicas que preservam todos os nutrientes.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pratos Principais Card */}
          <SpecialtyCard 
            icon={<FaCarrot className="text-6xl text-orange-500 group-hover:scale-110 transition-transform duration-300" />}
            title="Pratos Principais"
            description="Saborosos e nutritivos para abastecer seu dia com todos os nutrientes necessários."
            link="/produtos?categoria=Pratos"
            bgColor="bg-orange-100"
            delay={0.2}
          />

          {/* Saladas Card */}
          <SpecialtyCard 
            icon={<FaAppleAlt className="text-6xl text-green-500 group-hover:scale-110 transition-transform duration-300" />}
            title="Saladas"
            description="Frescas e coloridas para manter a leveza e fornecer vitaminas e minerais essenciais."
            link="/produtos?categoria=Saladas"
            bgColor="bg-green-100"
            delay={0.3}
          />

          {/* Snacks Card */}
          <SpecialtyCard 
            icon={<FaDrumstickBite className="text-6xl text-yellow-500 group-hover:scale-110 transition-transform duration-300" />}
            title="Snacks"
            description="Pequenas delícias para saciar a fome entre as refeições sem comprometer sua dieta."
            link="/produtos?categoria=Snacks"
            bgColor="bg-yellow-100"
            delay={0.4}
          />
        </div>
      </div>
    </motion.section>
  );
};

interface SpecialtyCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  bgColor: string;
  delay: number;
}

const SpecialtyCard: React.FC<SpecialtyCardProps> = ({ icon, title, description, link, bgColor, delay }) => {
  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 relative group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className={`h-48 ${bgColor} flex items-center justify-center`}>
        {icon}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link to={link} className="inline-flex items-center text-green-600 font-medium hover:text-green-700 transition-colors">
          Ver opções <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m9 18 6-6-6-6"/></svg>
        </Link>
      </div>
    </motion.div>
  );
};

export default SpecialtiesSection;