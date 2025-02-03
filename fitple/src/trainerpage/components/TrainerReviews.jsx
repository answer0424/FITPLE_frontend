import React from "react";

function TrainerReviews({ reviews, BASE_URL }) {
    return (
        <div>
            <h3>리뷰 목록</h3>
            {reviews.length > 0 ? (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {reviews.map((review) => (
                        <li key={review.id} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                     
                            <img
                                src={`${BASE_URL}${review.userProfileImage}`}
                                alt="유저 프로필"
                                width="50"
                                height="50"
                                style={{ borderRadius: "50%" }}
                            />
                            <div>
                                <strong>{review.username}</strong> - ⭐ {review.rating}
                                <p>{review.content}</p>
                             
                                <p style={{ fontSize: "12px", color: "gray" }}>
                                    작성일: {new Date(review.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>아직 리뷰가 없습니다.</p>
            )}
        </div>
    );
}

export default TrainerReviews;
