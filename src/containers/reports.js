import SubchapterBudget from "../components/reports/subchapterBudget";
import ItemsInputs from "../components/reports/itemsInputs";
import CompoundInputs from "../components/reports/compoundInputs";
import InputsBudget from "../components/reports/inputsBudget";

const Reports = ({ reportOption, setReportOption }) => {
  return (
    <div>
     
        <SubchapterBudget
          reportOption={reportOption}
          setReportOption={setReportOption}
        />
        <ItemsInputs
          reportOption={reportOption}
          setReportOption={setReportOption}
        />
        <CompoundInputs
          reportOption={reportOption}
          setReportOption={setReportOption}
        />
        <InputsBudget
          reportOption={reportOption}
          setReportOption={setReportOption}
        />
     
    </div>
  );
};

export default Reports;
