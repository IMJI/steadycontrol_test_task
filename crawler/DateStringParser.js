const months = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

class DateStringParser {
    static toDate(dateString) {
        let date = new Date();
        let [datePart, timePart] = dateString.split(" ");
        let [dayString, monthString, yearString] = datePart.split("-");
        date.setFullYear(+`20${yearString}`);
        date.setMonth(months.indexOf(monthString));
        date.setDate(+dayString);
        if (timePart) {
            let [hours, minutes] = timePart.split(":");
            date.setHours(+hours);
            date.setMinutes(+minutes);
        }
        return date;
    }
}

export default DateStringParser;