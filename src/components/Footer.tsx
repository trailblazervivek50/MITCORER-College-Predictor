"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Globe, ExternalLink } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      {/* Black contact strip */}
      <div className={styles.contactStrip}>
        <div className={styles.stripInner}>
          <div className={styles.stripItem}>
            <MapPin size={13} />
            <span>MIT CORER, Barshi, Solapur – 413411, Maharashtra</span>
          </div>
          <div className={styles.stripItem}>
            <Phone size={13} />
            <span>02184-228111</span>
          </div>
          <div className={styles.stripItem}>
            <Mail size={13} />
            <span>admissions@mitcorer.edu.in</span>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className={styles.main}>
        <div className={styles.mainInner}>
          {/* Branding */}
          <div className={styles.brandCol}>
            <h3 className={styles.brandTitle}>
              MHT-CET &amp; JEE Predictor
            </h3>
            <p className={styles.brandDesc}>
              An official prediction tool for students seeking admission to MIT College of Railway Engineering &amp; Research, Barshi.
              Powered by MAEER&apos;s MIT Group of Institutions.
            </p>
            <div className={styles.affiliation}>
              <span>Affiliated to PAH Solapur University</span>
              <span>•</span>
              <span>AICTE Approved</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Quick Links</h4>
            <nav aria-label="Footer navigation">
              <ul className={styles.linkList}>
                {[
                  { href: "/", label: "Home", id: "footer-home" },
                  { href: "/#predictor", label: "My Prediction", id: "footer-prediction" },
                  { href: "/#student-form", label: "Apply Now", id: "footer-apply" },

                ].map((link) => (
                  <li key={link.id}>
                    <Link href={link.href} className={styles.footerLink} id={link.id}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Official Links */}
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Official</h4>
            <ul className={styles.linkList}>
              {[
                { href: "https://www.mitcorer.edu.in", label: "MITCORER Website" },
                { href: "https://www.dtemaharashtra.gov.in", label: "DTE Maharashtra" },
                { href: "https://cetcell.mahacet.org", label: "MHT-CET Portal" },
                { href: "https://jeemain.nta.ac.in", label: "JEE Main Portal" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.footerLink}
                  >
                    {link.label}
                    <ExternalLink size={10} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Contact</h4>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <MapPin size={13} />
                <span>Barshi, Solapur, Maharashtra – 413411</span>
              </li>
              <li className={styles.contactItem}>
                <Phone size={13} />
                <span>02184-228111</span>
              </li>
              <li className={styles.contactItem}>
                <Mail size={13} />
                <a href="mailto:admissions@mitcorer.edu.in" className={styles.footerLink}>
                  admissions@mitcorer.edu.in
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/school/mit-corer/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialBtn}
                  aria-label="LinkedIn"
                  id="footer-linkedin"
                >
                  <Globe size={15} />
                  <span>LinkedIn</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomInner}>
          <p className={styles.copyright}>
            © {currentYear} MHT-CET &amp; JEE Predictor. All rights reserved.
          </p>
          <p className={styles.dteCode}>DTE CODE – 06901</p>
        </div>
      </div>
    </footer>
  );
}
