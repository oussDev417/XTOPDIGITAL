'use client';

import SlideUp from '@/utils/animations/slideUp'
import { useState } from 'react'

const LeaveReply = ({ blogId }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        saveInfo: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Validation de base
        if (!formData.name || !formData.email || !formData.message) {
            setError('Veuillez remplir tous les champs obligatoires.');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    blogId
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erreur lors de l\'envoi du commentaire');
            }
            
            setSubmitted(true);
            setFormData({
                name: '',
                email: '',
                message: '',
                saveInfo: false
            });
        } catch (err) {
            setError('Une erreur est survenue lors de l\'envoi de votre commentaire.');
            console.error('Erreur lors de la soumission du formulaire:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SlideUp className="leave__replay">
            <h2 className="t__54">Laisser un commentaire</h2>
            <p>
                Votre adresse e-mail ne sera pas publiée. Les champs obligatoires sont marqués *
            </p>
            
            {error && (
                <div className="alert alert-danger mb-4">
                    {error}
                </div>
            )}
            
            {submitted && (
                <div className="alert alert-success mb-4">
                    Votre commentaire a été soumis avec succès et est en attente de modération.
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6">
                        <input 
                            type="text" 
                            name="name"
                            placeholder="Votre nom *" 
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <input 
                            type="email" 
                            name="email"
                            placeholder="Votre e-mail *" 
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-12">
                        <textarea 
                            name="message" 
                            placeholder="Votre message *" 
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="d-flex align-items-baseline gap-1 w-100">
                        <input 
                            type="checkbox" 
                            id="saveInfo" 
                            name="saveInfo"
                            className="w-auto" 
                            checked={formData.saveInfo}
                            onChange={handleChange}
                        />
                        <label htmlFor="saveInfo">
                            Enregistrer mon nom, mon e-mail et mon site web dans ce navigateur pour mon prochain commentaire.
                        </label>
                    </div>
                    <div>
                        <button 
                            type="submit" 
                            className="common__btn mt-4 mt-md-0"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Envoi en cours...' : 'Publier un commentaire'}
                            <img src="/icons/arrow-up-rignt-black.svg" alt="img" />
                        </button>
                    </div>
                </div>
            </form>
        </SlideUp>
    )
}

export default LeaveReply