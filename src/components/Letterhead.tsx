"use client";

import Image from "next/image";
import styles from "./Letterhead.module.css";

export default function Letterhead() {
  return (
    <div className={styles.letterhead}>
      <div className={styles.inner}>
        {/* Logo */}
        <div className={styles.logoWrap}>
          <Image
            src="/college-logo.png"
            alt="MIT College Logo"
            width={64}
            height={64}
            className={styles.logo}
            priority
          />
        </div>

        {/* College Info */}
        <div className={styles.textWrap}>
          <p className={styles.groupName}>
            MAEER&apos;s MIT Group of Institutions, Pune&apos;s
          </p>
          <h1 className={styles.collegeName}>
            MIT COLLEGE OF RAILWAY ENGINEERING &amp; RESEARCH, Barshi
          </h1>
          <p className={styles.details}>
            Affiliated to Punyashlok Ahilyadevi Holkar Solapur University (PAH), Approved by AICTE, Recognised by Govt. of Maharashtra, DTE Mumbai.
          </p>
          <p className={styles.dteCode}>DTE CODE – 06901</p>
        </div>
      </div>
    </div>
  );
}
