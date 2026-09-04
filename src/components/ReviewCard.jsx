import Stars from "./Stars";

export default function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-2xl shadow-soft p-4 min-w-[240px] md:min-w-0 border border-gold-50">
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-primary-700 text-sm">{review.name}</span>
        <Stars rating={review.rating} size={13} />
      </div>
      <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
      <span className="text-xs text-gray-400 mt-2 block">{review.date}</span>
    </div>
  );
}
