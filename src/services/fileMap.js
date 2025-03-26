
/**
 * Maps data from an Excel file into a structured format
 * 
 * This function processes Excel data, skipping the first sheet (which is assumed to be a summary sheet),
 * and processes the remaining sheets which represent customer data.
 * 
 * @param data - The Excel data object containing sheets and their content
 * @returns {Array<Object>} - An array of mapped data objects, each representing a customer sheet
 *                           with the customer name and potentially other mapped properties
 */
const MapExcelData = (data) => {
    console.log(data);
    let sheets = data.SheetNames.slice(1, data.SheetNames.length); // Remove first sheet since it's not a customer sheet
    let mappedData = [];    

    for(let sheet of sheets){
        const mappedItem = {};
        mappedItem.customer = sheet;
        const currentSheet = data.Sheets[sheet];    
        // Transform it into a list of cells
        const cells = Object.keys(currentSheet).filter(cell => cell !== "!ref" && cell !== "!merges" && cell !== "!margins");      
        // Date Selection
        const dateStart = new Date(FormatDate(currentSheet["A3"].w));
        const dateEnd = new Date(FormatDate(currentSheet["A4"].w));
        let funds = [];
        // Fund Names
        let fundNames = cells.filter(cell => cell.includes("B") && Number(cell[1]) > 2).map(cell => currentSheet[cell]);
        // Fund Values
        let fundStartValues = cells.filter(cell => cell.includes("C") && Number(cell[1]) > 2).map(cell => currentSheet[cell]);
        
        // Addition or subtraction of funds (Filter by H and greater than 2)
        let fundOperations = cells.filter(cell => cell.includes("H") && Number(cell[1]) > 2).map(cell => { 
            return ({
                fund: currentSheet[cell].v,
                date:currentSheet[`E${cell[1]}`].v,
                type: currentSheet[`F${cell[1]}`].v,
                value: currentSheet[`G${cell[1]}`].v
            })
        });       

        // Fund End Values
        let fundEndValues = cells.filter(cell => cell.includes("J") && Number(cell[1]) > 2).map(cell => currentSheet[cell]);
        console.log(fundEndValues);
        funds = fundNames.map((name, index) => {
            return {
                name: name.v,
                startValue: fundStartValues[index].v,
                operations: fundOperations.filter(operation => operation.fund === name.v),
                endValue: fundEndValues[index]
            }
        });
        // Values ​​for the mappedItem object
        mappedItem.startValue = currentSheet["M1"].v;
        mappedItem.endValue = currentSheet["M2"].v;
        mappedItem.totalOperations = currentSheet["M3"].v;
        mappedItem.netTotal = currentSheet["M4"].v;
        mappedItem.averageCapital = currentSheet["M5"].v;
        mappedItem.approximateProfit = currentSheet["M6"].v;
        mappedItem.cdi = currentSheet["M7"]?.v ?? 0;
        mappedItem.funds = funds;
        mappedItem.serviceFee = currentSheet["N2"].v;
        mappedData.push(mappedItem);
    }
    return mappedData;
};

/**
 * Convert received date dd/mm/yyyy to yyyy-mm-dd
 * 
 * @param date - The date in the format dd/mm/yyyy
 * @returns - The date in the Date format
 */
const FormatDate = (date) => {
    const parts = date.split("/");
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
}

module.exports = MapExcelData;