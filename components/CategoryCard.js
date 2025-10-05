// components/CategoryCard.js
export default function CategoryCard({ category }) {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <div className="w-20 h-20 overflow-hidden rounded-full border-2 border-gray-200 mb-3 flex items-center justify-center">
        <img
          className="w-full h-full object-cover"
          src={category.imageUrl}
          alt={category.name}
        />
      </div>
      <h3 className="text-base font-semibold text-gray-800 text-center">{category.name}</h3>
    </div>
  );
}