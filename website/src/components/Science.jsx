import React from "react";
import { motion } from "framer-motion";
import { FlaskConical, BookOpen, Brain } from "lucide-react";

const studies = [
  {
    icon: <FlaskConical className="h-6 w-6 text-red-500" />,
    stat: "57%",
    label: "less social media use",
    source: "PNAS (2024)",
    sourceUrl: "https://doi.org/10.1073/pnas.2213114120",
    description:
      'The "One Sec" study published in the Proceedings of the National Academy of Sciences found that a single moment of friction before opening social media reduced usage by 57%.',
  },
  {
    icon: <Brain className="h-6 w-6 text-red-500" />,
    stat: "d = 0.65",
    label: "implementation intentions effect",
    source: "Gollwitzer & Sheeran (2006)",
    sourceUrl: "https://doi.org/10.1016/S0065-2601(06)38002-1",
    description:
      'Asking "what are you looking for?" leverages implementation intentions — specifying when, where, and how you\'ll act on a goal. Meta-analysis of 94 studies confirms a medium-to-large effect size.',
  },
  {
    icon: <BookOpen className="h-6 w-6 text-red-500" />,
    stat: "Choice > Block",
    label: "friction beats restriction",
    source: "Lyngs et al. (2019)",
    sourceUrl: "https://doi.org/10.1145/3290605.3300361",
    description:
      "Tools that offer a choice outperform hard blocks. Users who feel controlled disengage entirely. DoomScrollingFix gives you a nudge, not a wall — the dismiss option is what makes it stick.",
  },
];

const Science = () => {
  return (
    <section id="science" aria-labelledby="science-heading" className="py-20 bg-[#0F0F0F]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 id="science-heading" className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Built on research, not hype
          </h2>
          <p className="text-lg text-gray-400">
            Every design decision maps to a peer-reviewed finding. Here's the
            science behind the six seconds.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {studies.map((study, index) => (
            <motion.div
              key={index}
              className="flex gap-6 p-6 rounded-xl bg-[#111113] border border-white/[0.06]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex-shrink-0 mt-1">{study.icon}</div>
              <div>
                <h3 className="flex items-baseline gap-3 mb-2">
                  <span className="text-2xl font-bold text-white">
                    {study.stat}
                  </span>
                  <span className="text-sm text-gray-500">{study.label}</span>
                </h3>
                <p className="text-gray-400 mb-2">{study.description}</p>
                <a
                  href={study.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors underline underline-offset-2 decoration-gray-700 hover:decoration-red-400/50"
                >
                  {study.source} ↗
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Science;
