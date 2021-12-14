/**
 * 
 * @param {date} Date 
 * @returns {} Returns true if date is in format YYYY-MM-DD.
 */

exports.isDateString = dateString => {
    const [year, month, date] = dateString.split('-')
    return isValidYear(year)
        && isValidMonth(month)
        && isValidDate(date)
        && new Date(dateString).toString() !== 'Invalid Date'
}

const isValidYear = year => year >= 1970 && year <= 2030
const isValidMonth = month => month >= 1 && month <= 12
const isValidDate = date => date >= 1 && date <= 31