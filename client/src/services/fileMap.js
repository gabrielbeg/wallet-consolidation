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
    let sheets = data.SheetNames.slice(1, data.SheetNames.length); // Remove first sheet since it's not a customer sheet
    let mappedData = [];

    for(let sheet of sheets){
        try
        {
            const mappedItem = {};
            mappedItem.customer = sheet;
            const currentSheet = data.Sheets[sheet];    
            // Transform it into a list of cells
            const cells = Object.keys(currentSheet).filter(cell => cell !== "!ref" && cell !== "!merges" && cell !== "!margins");      
            // Date Selection
            const dateStart = currentSheet["A3"].w;
            const dateEnd = currentSheet["A4"].w;
            let funds = [];
            // Fund Names
            let fundNames = cells.filter(cell => cell.includes("B") && RetrieveCellNumber(cell) > 2).map(cell => currentSheet[cell]);
            // Fund Values
            let fundStartValues = cells.filter(cell => cell.includes("C") && RetrieveCellNumber(cell) > 2).map(cell => currentSheet[cell]);
            
            // Addition or subtraction of funds (Filter by H and greater than 2)
            let fundOperations = cells.filter(cell => cell.includes("H") && RetrieveCellNumber(cell) > 2).map(cell => { 
                const rowNumber = RetrieveCellNumber(cell);
                return ({
                    fund: currentSheet[cell].v,
                    date: currentSheet[`E${rowNumber}`].w,
                    type: currentSheet[`F${rowNumber}`].v,
                    value: currentSheet[`G${rowNumber}`].v
                })
            });            

            // Fund End Values
            let fundEndValues = cells.filter(cell => cell.includes("J") && RetrieveCellNumber(cell) > 2).map(cell => currentSheet[cell]);
            funds = fundNames.map((name, index) => {
                return {
                    name: name.v,
                    startValue: fundStartValues[index].v,
                    endValue: fundEndValues[index]?.v ?? 'Não Apurado'
                }
            });
            // Values ​​for the mappedItem object
            mappedItem.startValue = currentSheet["M1"].v;
            mappedItem.endValue = currentSheet["M2"].v;
            mappedItem.totalOperations = currentSheet["M3"].v;
            mappedItem.operations = fundOperations;
            mappedItem.netTotal = currentSheet["M4"].v;
            mappedItem.averageCapital = currentSheet["M5"].v;
            mappedItem.approximateProfit = (currentSheet["M6"]?.v * 100).toFixed(2) ?? 0;
            mappedItem.cdi = currentSheet["M7"]?.v ?? 0;
            mappedItem.funds = funds;
            mappedItem.serviceFee = currentSheet["N2"].v;
            mappedItem.dateStart = dateStart;
            mappedItem.dateEnd = dateEnd;
            mappedItem.netMinusFee = currentSheet["M8"]?.v.toFixed(2) ?? 0;
            mappedItem.profitabilityMinusFee = (currentSheet["M9"]?.v * 100).toFixed(2) ?? 0;
            mappedItem.cdiProfit = (currentSheet["M10"]?.v * 100).toFixed(2) ?? 0;
            mappedItem.cdiPercentage = (currentSheet["M11"]?.v * 100).toFixed(2) ?? 0;
            mappedData.push(mappedItem);
        }
        catch(exception)
        {
            console.error("Error processing sheet:", sheet, exception);
            continue; // Skip to the next sheet if there's an error
        }
    }
    return mappedData;
};

/**
 * Convert received date dd/mm/yyyy to yyyy-mm-dd
 * @param date - The date in the format dd/mm/yyyy
 * @returns - The date in the Date format
 */
const FormatDate = (date) => {
    const parts = date.split("/");
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
}

/**
 * This functions retrieves the cell number from the cell string and converts into a number ignoring the cell letter.
 * @param {string} cell - The Excel cell reference
 * @example RetrieveCellNumber("B10") returns 10
 * @returns {number} - The cell number as a number
 */
const RetrieveCellNumber = (cell) => {
    const cellNumber = cell.substring(1, cell.length);
    return Number(cellNumber);
};

export default MapExcelData;