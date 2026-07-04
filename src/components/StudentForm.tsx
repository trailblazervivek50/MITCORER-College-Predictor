"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { User, BarChart2, BookOpen, MapPin, Phone, Tag, CheckSquare } from "lucide-react";
import styles from "./StudentForm.module.css";

const schema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  exam_type: z.string().min(1, "Please select an exam type"),
  pred_mode: z.string().min(1, "Please select a prediction mode"),
  score: z.string().min(1, "Score is required").max(10, "Too long"),
  gender: z.string().min(1, "Please select a gender"),
  district: z.string().min(1, "Please select a district"),
  category: z.string().min(1, "Please select a category"),
  ews: z.boolean().optional(),
  tfws: z.boolean().optional(),
  branch: z.array(z.string()).optional(),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
});

export type FormData = z.infer<typeof schema>;

const EXAM_TYPES = ["MHT-CET", "JEE"];
const PRED_MODES = [{ label: "Percentile", value: "percentile" }, { label: "State Merit Rank", value: "rank" }];
const GENDERS = ["Male", "Female"];
const CATEGORIES = ["OPEN", "OBC", "SC", "ST", "VJNT", "NT1", "NT2", "NT3"];
const DISTRICTS = [
  "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur",
  "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur",
  "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad",
  "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg",
  "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
];
const BRANCHES = [
  "Computer Engineering", "Information Technology", "Artificial Intelligence and Data Science",
  "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", 
  "Electronics and Telecommunication Engg", "Chemical Engineering"
];

interface StudentFormProps {
  onSubmitDetails: (data: FormData) => void;
}

export default function StudentForm({ onSubmitDetails }: StudentFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      exam_type: "MHT-CET",
      pred_mode: "percentile",
      gender: "Male",
      district: "Pune",
      category: "OPEN",
      ews: false,
      tfws: false,
      branch: [],
    }
  });

  const category = watch("category");
  const exam_type = watch("exam_type");
  const isEwsEligible = category === "OPEN";
  const isTfwsEligible = exam_type !== "JEE"; // Assuming TFWS is more relevant for MHT-CET, though rules may vary

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
            Enter Details for Precise Prediction
          </h2>
          <div className="red-divider" />
          <p className="section-subtitle">
            Provide your exact exam details to fetch accurate college recommendations.
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
                />
                {errors.fullName && <span className="form-error">{errors.fullName.message}</span>}
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
                />
                {errors.mobileNumber && <span className="form-error">{errors.mobileNumber.message}</span>}
              </div>

              {/* Exam Type */}
              <div className="form-group">
                <label className="form-label" htmlFor="exam_type">
                  Exam Type <span style={{ color: "var(--mit-red)" }}>*</span>
                </label>
                <select id="exam_type" className="form-input" {...register("exam_type")}>
                  {EXAM_TYPES.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              {/* Predict Mode */}
              <div className="form-group">
                <label className="form-label" htmlFor="pred_mode">
                  Prediction Mode <span style={{ color: "var(--mit-red)" }}>*</span>
                </label>
                <select id="pred_mode" className="form-input" {...register("pred_mode")}>
                  {PRED_MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>

              {/* Score */}
              <div className="form-group">
                <label className="form-label" htmlFor="score">
                  <BarChart2 size={13} style={{ display: "inline", marginRight: 4 }} />
                  Score / Rank <span style={{ color: "var(--mit-red)" }}>*</span>
                </label>
                <input
                  id="score"
                  className="form-input"
                  type="text"
                  placeholder="e.g., 95.6"
                  {...register("score")}
                  aria-invalid={!!errors.score}
                />
                {errors.score && <span className="form-error">{errors.score.message}</span>}
              </div>

              {/* Gender */}
              <div className="form-group">
                <label className="form-label" htmlFor="gender">
                  Gender <span style={{ color: "var(--mit-red)" }}>*</span>
                </label>
                <select id="gender" className="form-input" {...register("gender")}>
                  {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              {/* District */}
              <div className="form-group">
                <label className="form-label" htmlFor="district">
                  <MapPin size={13} style={{ display: "inline", marginRight: 4 }} />
                  Home District <span style={{ color: "var(--mit-red)" }}>*</span>
                </label>
                <select id="district" className="form-input" {...register("district")}>
                  <option value="" disabled>Select district</option>
                  {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label" htmlFor="category">
                  <Tag size={13} style={{ display: "inline", marginRight: 4 }} />
                  Category <span style={{ color: "var(--mit-red)" }}>*</span>
                </label>
                <select id="category" className="form-input" {...register("category")}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Special Quotas */}
              <div className="form-group" style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" {...register("tfws")} disabled={!isTfwsEligible} />
                  TFWS
                </label>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" {...register("ews")} disabled={!isEwsEligible} />
                  EWS
                </label>
              </div>

              {/* Branch Preferences */}
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">
                  <BookOpen size={13} style={{ display: "inline", marginRight: 4 }} />
                  Branch Preferences (Optional)
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "10px", marginTop: "10px" }}>
                  {BRANCHES.map((b) => (
                    <label key={b} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                      <input type="checkbox" value={b} {...register("branch")} />
                      {b}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.formFooter} style={{ marginTop: "30px" }}>
              <p className={styles.privacy}>
                🔒 Your data is safe and used only for prediction.
              </p>
              <button
                id="student-form-submit-btn"
                type="submit"
                className="btn btn-primary"
                style={{ minWidth: "180px", fontSize: "15px", padding: "13px 32px" }}
              >
                Fetch Predictions
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
