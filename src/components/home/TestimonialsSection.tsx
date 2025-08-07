import React from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-green-600 font-medium">DEPOIMENTOS</span>
          <h2 className="text-3xl lg:text-4xl font-bold mt-2 mb-4">O que nossos clientes dizem</h2>
          <p className="text-gray-600">
            A satisfação dos nossos clientes é nossa maior motivação para continuar oferecendo o melhor da alimentação saudável.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={`text-sm ${i < Math.floor(testimonial.rating) ? '' : 'text-yellow-200'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">{testimonial.comment}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
