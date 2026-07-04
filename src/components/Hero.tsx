"use client";

import { ChevronDown, BarChart2 } from "lucide-react";
import styles from "./Hero.module.css";
import { motion } from "framer-motion";

export default function Hero() {
  const scrollToLearnMore = () => {
    document.getElementById("student-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={styles.hero} id="hero" aria-labelledby="hero-title">
      {/* Background decoration */}
      <div className={styles.bgDecoration} aria-hidden="true">
        <div className={styles.bgCircle1} />
        <div className={styles.bgCircle2} />
        <div className={styles.bgLine} />
      </div>

      <div className={styles.inner}>
        {/* Left Content */}
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className={styles.badge}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <BarChart2 size={12} />
            <span>2025–26 Admissions</span>
          </motion.div>

          <motion.h2
            id="hero-title"
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            MHT-CET &amp; JEE
            <span className={styles.titleHighlight}> Predictor</span>
          </motion.h2>

          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Discover your predicted college and branch based on your MHT-CET or JEE percentile.
            Make informed decisions for your engineering career with our official prediction tool.
          </motion.p>

          {/* Stats row */}
          <motion.div
            className={styles.statsRow}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              { value: "500+", label: "Colleges Listed" },
              { value: "50K+", label: "Students Helped" },
              { value: "99%", label: "Accuracy Rate" },
            ].map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className={styles.ctaRow}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <button
              id="hero-predictor-btn"
              className="btn btn-primary"
              onClick={scrollToLearnMore}
              style={{ fontSize: "15px", padding: "14px 32px" }}
            >
              <BarChart2 size={18} />
              Prediction Tool
            </button>
            <button
              id="hero-learn-more-btn"
              className="btn btn-secondary"
              onClick={scrollToLearnMore}
              style={{ fontSize: "15px", padding: "14px 32px" }}
            >
              Learn More
              <ChevronDown size={16} />
            </button>
          </motion.div>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          className={styles.panel}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className={styles.panelInner}>
            <div className={styles.panelHeader}>
              <div className={styles.panelDot} />
              <span className={styles.panelTitle}>Quick Predictor Guide</span>
            </div>
            <div className={styles.panelSteps}>
              {[
                { step: "01", title: "Enter Your Score", desc: "Input your MHT-CET percentile or JEE rank." },
                { step: "02", title: "Select Category", desc: "Choose your reservation category (General / OBC / SC / ST)." },
                { step: "03", title: "Choose Preference", desc: "Select preferred course and college region." },
                { step: "04", title: "Get Prediction", desc: "Receive instant prediction with college list." },
              ].map((item) => (
                <div key={item.step} className={styles.step}>
                  <div className={styles.stepNum}>{item.step}</div>
                  <div>
                    <p className={styles.stepTitle}>{item.title}</p>
                    <p className={styles.stepDesc}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              className={styles.panelBtn}
              onClick={scrollToLearnMore}
              id="panel-start-btn"
            >
              Start Prediction Now →
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <div className={styles.scrollHint} aria-hidden="true">
        <ChevronDown size={20} className={styles.scrollIcon} />
      </div>
    </section>
  );
}
