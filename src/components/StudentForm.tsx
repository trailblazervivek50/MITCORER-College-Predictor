"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { User, BarChart2, BookOpen, School, Phone, Tag } from "lucide-react";
import styles from "./StudentForm.module.css";

const schema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long"),
  marksPercentile: z
    .string()
    .min(1, "Marks / Percentile is required")
    .max(50, "Too long"),
  category: z.string().min(1, "Please select a category"),
  preferredCourse: z.string().min(1, "Please select a course"),
  collegePreference: z.string().optional(),
  mobileNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
});

export type FormData = z.infer<typeof schema>;

const CATEGORIES = ["General (Open)", "OBC", "SC", "ST", "EWS", "VJNT", "NT1", "NT2", "NT3"];
const COURSES = [
  "Computer Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Electronics & Telecommunication",
  "Railway Engineering",
  "Information Technology",
  "Artificial Intelligence & ML",
];

interface StudentFormProps {
  onSubmitDetails: (data: FormData) => void;
}

export default function StudentForm({ onSubmitDetails }: StudentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    onSubmitDetails(data);
  };

  return (
    <section id="student-form" className={styles.section} aria-labelledby="form-title">
      <div className={styles.inner}>
        {/* Section Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label">📋 Student Details</div>
          <h2 id="form-title" className="section-title">
            Submit Your Information
          </h2>
          <div className="red-divider" />
          <p className="section-subtitle">
            Fill in your details to generate a personalized prediction report.
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-label="Student prediction form"
          >
            <div className={styles.grid}>
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">
                  <User size={13} style={{ display: "inline", marginRight: 4 }} />
                  Full Name <span style={{ color: "var(--mit-red)" }}>*</span>
                </label>
                <input
                  id="fullName"
                  className="form-input"
                  type="text"
                  placeholder="e.g., Rahul Sharma"
                  {...register("fullName")}
                  aria-invalid={!!errors.fullName}
                  aria-describedby="fullName-error"
                />
                {errors.fullName && (
                  <span id="fullName-error" className="form-error" role="alert">
                    {errors.fullName.message}
                  </span>
                )}
              </div>

              {/* Marks / Percentile */}
              <div className="form-group">
                <label className="form-label" htmlFor="marksPercentile">
                  <BarChart2 size={13} style={{ display: "inline", marginRight: 4 }} />
                  Marks / Percentile <span style={{ color: "var(--mit-red)" }}>*</span>
                </label>
                <input
                  id="marksPercentile"
                  className="form-input"
                  type="text"
                  placeholder="e.g., 95.6 or 145/200"
                  {...register("marksPercentile")}
                  aria-invalid={!!errors.marksPercentile}
                  aria-describedby="marks-error"
                />
                {errors.marksPercentile && (
                  <span id="marks-error" className="form-error" role="alert">
                    {errors.marksPercentile.message}
                  </span>
                )}
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label" htmlFor="category">
                  <Tag size={13} style={{ display: "inline", marginRight: 4 }} />
                  Category <span style={{ color: "var(--mit-red)" }}>*</span>
                </label>
                <select
                  id="category"
                  className="form-input"
                  {...register("category")}
                  aria-invalid={!!errors.category}
                  aria-describedby="category-error"
                  defaultValue=""
                >
                  <option value="" disabled>Select your category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.category && (
                  <span id="category-error" className="form-error" role="alert">
                    {errors.category.message}
                  </span>
                )}
              </div>

              {/* Preferred Course */}
              <div className="form-group">
                <label className="form-label" htmlFor="preferredCourse">
                  <BookOpen size={13} style={{ display: "inline", marginRight: 4 }} />
                  Preferred Course <span style={{ color: "var(--mit-red)" }}>*</span>
                </label>
                <select
                  id="preferredCourse"
                  className="form-input"
                  {...register("preferredCourse")}
                  aria-invalid={!!errors.preferredCourse}
                  aria-describedby="course-error"
                  defaultValue=""
                >
                  <option value="" disabled>Select preferred course</option>
                  {COURSES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.preferredCourse && (
                  <span id="course-error" className="form-error" role="alert">
                    {errors.preferredCourse.message}
                  </span>
                )}
              </div>

              {/* College Preference (Optional) */}
              <div className="form-group">
                <label className="form-label" htmlFor="collegePreference">
                  <School size={13} style={{ display: "inline", marginRight: 4 }} />
                  College Preference{" "}
                  <span style={{ color: "var(--gray-500)", fontWeight: 400 }}>(Optional)</span>
                </label>
                <input
                  id="collegePreference"
                  className="form-input"
                  type="text"
                  placeholder="e.g., MIT Barshi, COEP, VIT Pune"
                  {...register("collegePreference")}
                />
              </div>

              {/* Mobile Number */}
              <div className="form-group">
                <label className="form-label" htmlFor="mobileNumber">
                  <Phone size={13} style={{ display: "inline", marginRight: 4 }} />
                  Mobile Number <span style={{ color: "var(--mit-red)" }}>*</span>
                </label>
                <input
                  id="mobileNumber"
                  className="form-input"
                  type="tel"
                  placeholder="e.g., 9876543210"
                  maxLength={10}
                  {...register("mobileNumber")}
                  aria-invalid={!!errors.mobileNumber}
                  aria-describedby="mobile-error"
                />
                {errors.mobileNumber && (
                  <span id="mobile-error" className="form-error" role="alert">
                    {errors.mobileNumber.message}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.formFooter}>
              <p className={styles.privacy}>
                🔒 Your data is safe and will not be shared with third parties.
              </p>
              <button
                id="student-form-submit-btn"
                type="submit"
                className="btn btn-primary"
                style={{ minWidth: "180px", fontSize: "15px", padding: "13px 32px" }}
              >
                Submit Details
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
