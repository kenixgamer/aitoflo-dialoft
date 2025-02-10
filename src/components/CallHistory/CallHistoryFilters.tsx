import DateRangePicker from "./DateRangePicker";
import Filters from "./Filters";

const CallHistoryFilters = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <DateRangePicker />
        <Filters />
      </div>
    </div>
  );
};

export default CallHistoryFilters;
