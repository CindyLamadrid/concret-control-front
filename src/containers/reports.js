import SubchapterBudget from "../components/reports/subchapterBudget";
import ItemsInputs from "../components/reports/itemsInputs";
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
     
    </div>
  );
};

export default Reports;
