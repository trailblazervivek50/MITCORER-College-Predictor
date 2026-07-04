"use client";

import { motion } from "framer-motion";
import { Phone, Mail, Globe, Shield, Code2, ExternalLink } from "lucide-react";
import Link from "next/link";
import styles from "./DeveloperPage.module.css";



interface Developer {
  name: string;
  role: string;
  phone: string;
  linkedin: string;
  email: string;
  initials: string;
  color: string;
}

const DEVELOPERS: Developer[] = [
  {
    name: "Tirthesh Vaijnath Gutte",
    role: "Full Stack Junior Developer",
    phone: "7757851700",
    linkedin: "https://www.linkedin.com/in/tirthesh-vaijnath-gutte/",
    email: "tirtheshgutte17@gmail.com",
    initials: "TG",
    color: "#CC0000",
  },
  {
    name: "Vivek Suresh Borwar",
    role: "Full Stack Developer",
    phone: "7028849741",
    linkedin: "https://www.linkedin.com/in/vivekborwar",
    email: "trailblazervivek50@gmail.com",
    initials: "VB",
    color: "#8B0000",
  },
  {
    name: "Sumit Takbhate",
    role: "Developer",
    phone: "7666863499",
    linkedin: "https://www.linkedin.com/in/sumit-takbhate-29206b40b",
    email: "sumittakbhate@gmail.com",
    initials: "ST",
    color: "#333333",
  },
];

function DeveloperCard({ dev, index }: { dev: Developer; index: number }) {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      id={`dev-card-${index + 1}`}
    >
      {/* Avatar */}
      <div className={styles.avatarWrap}>
        <div
          className={styles.avatar}
          style={{ background: `linear-gradient(135deg, ${dev.color}, ${dev.color}cc)` }}
          aria-label={`${dev.name} avatar`}
        >
          {dev.initials}
        </div>
        <div className={styles.onlineIndicator} aria-hidden="true" />
      </div>

      {/* Info */}
      <div className={styles.info}>
        <h3 className={styles.name}>{dev.name}</h3>
        <div className={styles.roleBadge}>
          <Code2 size={12} />
          <span>{dev.role}</span>
        </div>
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Contact Details */}
      <ul className={styles.contactList} aria-label={`Contact details for ${dev.name}`}>
        <li className={styles.contactItem}>
          <Phone size={14} className={styles.contactIcon} />
          <a
            href={`tel:${dev.phone}`}
            className={styles.contactLink}
            id={`dev-${index + 1}-phone`}
          >
            {dev.phone}
          </a>
        </li>
        <li className={styles.contactItem}>
          <Mail size={14} className={styles.contactIcon} />
          <a
            href={`mailto:${dev.email}`}
            className={styles.contactLink}
            id={`dev-${index + 1}-email`}
          >
            {dev.email}
          </a>
        </li>
        <li className={styles.contactItem}>
          <Globe size={14} className={styles.contactIcon} />
          <a
            href={dev.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactLink}
            id={`dev-${index + 1}-linkedin`}
          >
            View Profile
            <ExternalLink size={11} />
          </a>
        </li>
      </ul>
    </motion.div>
  );
}

export default function DeveloperPageClient() {
  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.header}>
        <motion.div
          className={styles.headerInner}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>Development Team</h1>
          <div className={styles.redBar} />
          <p className={styles.subtitle}>
            The team behind the MHT-CET &amp; JEE Predictor platform.
          </p>
        </motion.div>
      </div>

      {/* Developer Cards Grid */}
      <div className={styles.grid}>
        {DEVELOPERS.map((dev, idx) => (
          <DeveloperCard key={dev.name} dev={dev} index={idx} />
        ))}
      </div>

      {/* Back to Home */}
      <div className={styles.backRow}>
        <Link href="/" className="btn btn-secondary" id="dev-page-back-btn">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
