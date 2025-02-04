import {format} from "date-fns";
import {fr} from "date-fns/locale";

export const yyy_mm_dd_Format = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export const formatDateToDateFns = (date: Date) => format(date, "PPP", { locale: fr });
