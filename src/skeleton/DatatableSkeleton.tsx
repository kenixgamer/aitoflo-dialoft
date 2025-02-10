const DatatableSkeleton = () => {
  return (
    <div className="rounded-lg border border-zinc-800 bg-black">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-zinc-800">
            <th className="p-3">
              <div className="h-6 bg-zinc-800 rounded animate-pulse w-24"></div>
            </th>
            <th className="p-3">
              <div className="h-6 bg-zinc-800 rounded animate-pulse w-32"></div>
            </th>
            <th className="p-3">
              <div className="h-6 bg-zinc-800 rounded animate-pulse w-32"></div>
            </th>
            <th className="p-3">
              <div className="h-6 bg-zinc-800 rounded animate-pulse w-24"></div>
            </th>
            <th className="p-3">
              <div className="h-8 bg-purple-900/50 rounded-md animate-pulse w-28"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(8)].map((_, index) => (
            <tr key={index} className="border-b border-zinc-800">
              <td className="p-3">
                <div className="h-5 bg-zinc-800 rounded animate-pulse w-40"></div>
              </td>
              <td className="p-3">
                <div className="h-5 bg-zinc-800 rounded animate-pulse w-24"></div>
              </td>
              <td className="p-3">
                <div className="h-5 bg-zinc-800 rounded animate-pulse w-24"></div>
              </td>
              <td className="p-3">
                <div className="h-5 bg-zinc-800 rounded animate-pulse w-32"></div>
              </td>
              <td className="p-3">
                <div className="h-8 bg-purple-900/30 rounded-md animate-pulse w-20"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DatatableSkeleton;