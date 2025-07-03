'use client';

import SlideUp from '@/utils/animations/slideUp';
import { useState, useEffect } from 'react';
import { formatDate } from '@/utils/formatDate';

const Comments = ({ blogId }) => {
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComments = async () => {
            if (!blogId) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const response = await fetch(`/api/comments?blogId=${blogId}`);
                
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des commentaires');
                }
                
                const data = await response.json();
                setComments(data.comments || []);
            } catch (err) {
                console.error('Erreur:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchComments();
    }, [blogId]);

    // Organiser les commentaires par parents/réponses
    const organizedComments = comments.reduce((acc, comment) => {
        if (!comment.parentId) {
            // C'est un commentaire parent
            acc.push({
                ...comment,
                replies: comments.filter(c => c.parentId && c.parentId.toString() === comment._id.toString())
            });
        }
        return acc;
    }, []);

    if (isLoading) {
        return (
            <div className="comments">
                <h1 className="t__54">
                    Commentaires
                    <span>...</span>
                </h1>
                <div className="flex justify-center my-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="comments">
                <h1 className="t__54">
                    Commentaires
                    <span>0</span>
                </h1>
                <div className="alert alert-danger">
                    {error}
                </div>
            </div>
        );
    }

    // Si aucun commentaire n'est disponible, utiliser les données statiques
    const displayData = organizedComments.length > 0 ? organizedComments : [];

    return (
        <div className="comments">
            <h1 className="t__54">
                Commentaires
                <span>{displayData.length}</span>
            </h1>
            {displayData.length === 0 ? (
                <div className="text-center py-4">
                    <p>Aucun commentaire pour l'instant. Soyez le premier à commenter !</p>
                </div>
            ) : (
                <div>
                    {displayData.map(comment => (
                        <SlideUp key={comment._id} className="comment">
                            <div className="main__comment">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="user">
                                        <img src="/images/blogs/comment1.png" alt={comment.name} />
                                        <div>
                                            <h5 className="t__22">{comment.name}</h5>
                                            <p>{formatDate(comment.createdAt)}</p>
                                        </div>
                                    </div>
                                    <button className="reply">Répondre</button>
                                </div>
                                <p className="text">{comment.message}</p>
                            </div>
                            
                            {comment.replies && comment.replies.length > 0 && (
                                <>
                                    <span className="border__full" />
                                    {comment.replies.map(reply => (
                                        <div key={reply._id} className="reply__comment">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="user">
                                                    <img src="/images/blogs/comment2.png" alt={reply.name} />
                                                    <div>
                                                        <h5 className="t__22">{reply.name}</h5>
                                                        <p>{formatDate(reply.createdAt)}</p>
                                                    </div>
                                                </div>
                                                <button className="reply">Répondre</button>
                                            </div>
                                            <p className="text">{reply.message}</p>
                                        </div>
                                    ))}
                                </>
                            )}
                        </SlideUp>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comments;