// 🌿 Skeleton Loader Component for Professional Loading States
const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const skeletons = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletons.map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <div className="skeleton h-48 w-full"></div>
            <div className="skeleton h-6 w-3/4"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-5/6"></div>
            <div className="flex justify-between items-center mt-4">
              <div className="skeleton h-8 w-24"></div>
              <div className="skeleton h-10 w-32"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {skeletons.map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 flex gap-4">
            <div className="skeleton h-24 w-24 flex-shrink-0"></div>
            <div className="flex-1 space-y-3">
              <div className="skeleton h-6 w-2/3"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-4/5"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="flex items-center gap-6">
          <div className="skeleton h-32 w-32 rounded-full"></div>
          <div className="flex-1 space-y-3">
            <div className="skeleton h-8 w-48"></div>
            <div className="skeleton h-4 w-64"></div>
            <div className="skeleton h-4 w-40"></div>
          </div>
        </div>
        <div className="skeleton h-px w-full"></div>
        <div className="space-y-3">
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-3/4"></div>
        </div>
      </div>
    );
  }

  // Default: simple box
  return (
    <div className="space-y-4">
      {skeletons.map((_, index) => (
        <div key={index} className="skeleton h-16 w-full"></div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
