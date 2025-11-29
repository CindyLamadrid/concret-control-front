import SubchapterBudget from '../components/reports/subchapterBudget'

const Reports=({reportOption,setReportOption})=>{
    return(
        <div>
            <SubchapterBudget 
            reportOption={reportOption}
            setReportOption={setReportOption}
            />
        </div>
    )
}

export default Reports;