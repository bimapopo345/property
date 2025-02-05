import React from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Building2, Home, Target } from 'lucide-react';
import CountUp from './Contup';

const milestones = [
  {
    icon: Home,
    title: 'Properties Listed',
    value: 5000,
    description: 'And growing daily',
  },
  {
    icon: Target,
    title: 'Happy Clients',
    value: 10000,
    description: 'Satisfied customers',
  },
];

export default function Milestones() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Our Journey So Far</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Milestones that mark our growth and success
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {milestones.map((milestone, index) => {
            const Icon = milestone.icon;
            return (
              <motion.div
                key={milestone.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-4xl font-bold text-blue-600 mb-2">
                  <CountUp from={0} to={milestone.value} duration={0.2} separator="," />
                </h3>
                <p className="text-xl font-semibold mb-2">{milestone.title}</p>
                <p className="text-gray-600">{milestone.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}