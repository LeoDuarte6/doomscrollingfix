import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Manager",
    content: "DoomScrollingFix helped me cut my social media time in half. I'm more productive at work and more present with my family.",
    avatar: "professional woman with short hair smiling, dark background"
  },
  {
    name: "Michael Chen",
    role: "Software Developer",
    content: "As a developer, I was skeptical about another app 'fixing' my habits. But the mindfulness techniques and gentle reminders actually worked for me.",
    avatar: "asian man with glasses in casual attire, dark background"
  },
  {
    name: "Emma Rodriguez",
    role: "College Student",
    content: "I was wasting hours every day on TikTok and Instagram. This app helped me regain control and focus on my studies. My grades have improved!",
    avatar: "young latina woman with curly hair, dark background"
  },
  {
    name: "David Wilson",
    role: "Freelance Writer",
    content: "The productivity boost I've experienced since using DoomScrollingFix has been incredible. I've met all my deadlines early for the first time in years.",
    avatar: "middle-aged man with beard in casual shirt, dark background"
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-[#0F0F0F]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            What Our Users <span className="gradient-text">Are Saying</span>
          </h2>
          <p className="text-lg text-gray-400">
            Join thousands who have successfully broken free from doom scrolling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full card-hover dark-card">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-red-500 fill-red-500" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6">{testimonial.content}</p>
                  <div className="flex items-center">
                    <div className="mr-4">
                      <img  alt={`${testimonial.name} avatar`} className="h-12 w-12 rounded-full object-cover" src="https://images.unsplash.com/photo-1675023112817-52b789fd2ef0" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;