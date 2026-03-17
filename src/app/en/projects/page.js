"use client";

import { FaGithub, FaArrowRight, FaEye, FaDatabase, FaCode, FaStar, FaBrain, FaCloud, FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";
import { projects as baseProjects, stats } from "./projectData";
import { useEffect, useMemo, useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const floatingVariants = {
  animate: { y: [-10, 10, -10], x: [-5, 5, -5], rotate: [-3, 3, -3], transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } },
};

const iconForCategory = (cat) => {
  const c = (cat || '').toLowerCase();
  if (c.includes('llm')) return <FaDatabase size={28} />;
  if (c.includes('nlp')) return <FaBrain size={28} />;
  if (c.includes('deep') || c.includes('learning')) return <FaBrain size={28} />;
  if (c.includes('cloud')) return <FaCloud size={28} />;
  return <FaChartLine size={28} />;
};

const ProjectsPageEn = () => {
  const [extra, setExtra] = useState([]);

  useEffect(() => {
    fetch('/api/content/projects?locale=en').then(r=>r.json()).then(d=>{
      const items = (d.items || []).map(p => ({
        ...p,
        icon: iconForCategory(p.category),
        categoryIcon: <FaCode size={16} />,
      }));
      setExtra(items);
    }).catch(()=>{});
  }, []);

  const projects = useMemo(() => ([...baseProjects, ...extra]), [extra]);
  return (
    <div className="relative min-h-screen text-slate-800 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-sky-200 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-indigo-200 rounded-full filter blur-3xl opacity-20" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-sky-100 rounded-full filter blur-3xl opacity-15" style={{animationDelay: '4s'}}></div>
        <motion.div className="absolute top-1/4 right-1/5 text-sky-300 text-4xl font-mono" variants={floatingVariants} animate="animate">{"< />"}</motion.div>
        <motion.div className="absolute top-2/3 left-1/6 w-6 h-6 border-2 border-indigo-300 rounded" variants={floatingVariants} animate="animate" style={{animationDelay: '2s'}} />
        <motion.div className="absolute top-1/3 left-1/2 text-sky-300 text-2xl" variants={floatingVariants} animate="animate" style={{animationDelay: '3s'}}>{"{ }"}</motion.div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <motion.h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-sky-600 to-indigo-600" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            Projects
          </motion.h1>
          <motion.p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
            A selection across <span className="text-sky-600 font-semibold">Data Science</span>, <span className="text-indigo-600 font-semibold">Machine Learning</span>, and full-stack development—showcasing how complex data problems become business outcomes.
          </motion.p>

          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16" variants={containerVariants} initial="hidden" animate="visible">
            {stats.map((stat, index) => (
              <motion.div key={index} variants={itemVariants} className="relative p-6 bg-white shadow-sm backdrop-blur-lg rounded-2xl border border-slate-200 text-center group hover:border-sky-300 transition-all duration-300" whileHover={{ y: -5, scale: 1.05 }}>
                <div className="text-sky-500 mb-3 flex justify-center">{stat.icon}</div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          {projects.map((project, index) => (
            <motion.div key={index} variants={itemVariants} className="relative group overflow-hidden bg-white backdrop-blur-xl rounded-2xl border border-slate-200 hover:border-sky-300 transition-all duration-500 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 via-transparent to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <motion.div className="flex-shrink-0 p-3 bg-sky-50 rounded-xl border border-sky-100 group-hover:bg-sky-100 transition-all duration-300" whileHover={{ rotate: 5, scale: 1.1 }}>
                    {project.icon}
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sky-600">{project.categoryIcon}</span>
                        <span className="text-sm font-semibold text-sky-600">{project.category}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors duration-300">{project.title}</h3>
                    </div>
                  </div>
                </div>

                <p className="text-slate-500 leading-relaxed mb-6 group-hover:text-slate-600 transition-colors duration-300">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-sky-50 border border-sky-200 rounded-full text-xs font-medium text-sky-600">{tech}</span>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  {project.metrics.map((metric, i) => (
                    <div key={i} className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="text-lg font-bold text-slate-900">{metric.value}</div>
                      <div className="text-xs text-slate-500">{metric.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-4">
                  <a href={project.link} className="group/btn flex-1 flex items-center justify-center space-x-2 py-3 px-6 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg">
                    <FaGithub />
                    <span>View Code</span>
                    <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </a>
                  <button className="flex items-center justify-center w-12 h-12 bg-slate-100 hover:bg-indigo-50 rounded-xl transition-all duration-300 group/eye">
                    <FaEye className="text-slate-400 group-hover/eye:text-indigo-500 transition-colors duration-300" />
                  </button>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-sky-100 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-32 h-10 bg-sky-200/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="text-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <div className="max-w-4xl mx-auto">
            <h3 className="text-4xl font-bold text-slate-900 mb-6">Want to learn more details?</h3>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">Each project has unique challenges and solutions. I&apos;d love to share more technical details, implementation process, and key learnings.</p>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <motion.a href="https://github.com/chien-sheng-liu" target="_blank" rel="noopener noreferrer" className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-xl" whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
                <FaGithub className="text-xl" />
                <span>View GitHub</span>
                <motion.div animate={{ x: [0, 3, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <FaArrowRight />
                </motion.div>
              </motion.a>

              <div className="flex items-center space-x-2 text-slate-500">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium">Continuously updating</span>
              </div>
            </div>

            <motion.div className="mt-16 pt-8 border-t border-slate-200" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-500">
                <div className="flex items-center space-x-2"><FaCode className="text-sky-500" /><span>100% Open Source</span></div>
                <div className="flex items-center space-x-2"><FaStar className="text-indigo-500" /><span>Production-proven</span></div>
                <div className="flex items-center space-x-2"><FaDatabase className="text-sky-500" /><span>Complete docs</span></div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectsPageEn;
