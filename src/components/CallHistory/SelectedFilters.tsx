import { CallHistoryContext } from '@/context/CallHistoryContext';
import { useContext } from 'react'

const SelectedFilters = () => {
const {selectedFilters, handleFilterRemove} = useContext(CallHistoryContext);
  return (
    <div className="flex flex-wrap gap-2">
    {selectedFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedFilters.map((filter) => (
            <div
              key={filter.type}
              className="flex items-center gap-2 rounded-md border bg-black px-3 py-1 text-white"
            >
              <span className="text-sm">
                {filter.label}: {filter.displayValue || filter.value}
              </span>
              <button
                onClick={() => handleFilterRemove(filter.type)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SelectedFilters