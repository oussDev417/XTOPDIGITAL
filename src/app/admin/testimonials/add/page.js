"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TestimonialForm from "@/components/admin/testimonial/TestimonialForm";

export default function AddTestimonial() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (form, setError) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la création du témoignage");
      }
      router.push("/admin/testimonials");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-4">
      <div className="container" style={{ maxWidth: "900px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0 fw-bold">Ajouter un témoignage</h1>
          <button onClick={() => router.back()} className="btn btn-outline-secondary">
            Retour
          </button>
        </div>
        <TestimonialForm initialData={{}} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </section>
  );
} 