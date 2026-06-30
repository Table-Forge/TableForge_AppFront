import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const formatDate = (date: Date | Dayjs | string, withHours?: boolean) => {
  const format: string = withHours ? "DD/MM/YYYY, HH:mm" : "DD/MM/YYYY";

  const parsedDate = dayjs(date);
  if (parsedDate.isValid()) {
    return parsedDate.format(format);
  }
  return date as string;
};

const transformStringToDate = (date: string): Date => {
  const [dia, mes, ano] = date.split("/").map(Number);
  const formattedDate = new Date(Date.UTC(ano, mes - 1, dia, 12, 0));
  return formattedDate;
};

const formatDateISO = (date: Date | Dayjs | string) => {
  const dateISO = dayjs(date)
    .utc(true)
    .startOf("hour")
    .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  return dateISO;
};

const formatDateToDownload = (date: Date | Dayjs | string) => {
  const dateISO = dayjs(date).utc(true).startOf("hour").format("DD-MM-YYYY");
  return dateISO;
};

const normalizeString = (str: string, removeSpaces?: boolean) => {
  if (!str) return "";

  let normalized = str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  if (removeSpaces) {
    normalized = normalized.replace(/\s+/g, "");
  }

  return normalized;
};

function formatNumberToAPI(value: string | number): number {
  if (value === null || value === undefined || value === "") {
    return 0;
  }
  if (typeof value === "number") {
    return value;
  }

  return parseFloat(
    (value as string)
      .replace(/[^\d.,]/g, "")
      .replace(/\./g, "")
      .replace(",", "."),
  );
}

const roundToDecimalPlaces = (number: number, decimalPlaces: number = 2) => {
  const factor = 10 ** decimalPlaces;
  return Math.round(number * factor) / factor;
};

const formatToBRL = (value?: number) => {
  if (value === undefined || value === null) return "";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatToPercentage = (value?: number) => {
  if (value === undefined || value === null) return "";
  const adjustedValue = value / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(adjustedValue);
};

const formatToInteger = (value?: number | string): string => {
  if (value === undefined || value === null || value === "") return "";
  const result = parseInt(value.toString(), 10);
  return isNaN(result) ? "" : result.toString();
};

const formatToFloat = (value?: number): string => {
  if (value === undefined || value === null) return "";
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const removeFormatting = (data: string) => {
  return data.replace(/\D/g, "");
};

const capitalizePhrase = function camalize(sentence: string) {
  return sentence
    .toLowerCase()
    .split(" ")
    .map((word) => {
      if (word.length === 0) return "";
      return word[0].toUpperCase() + word.slice(1);
    })
    .join(" ");
};

const formatSemicolonStringToArray = (input?: string | string[]): string[] => {
  if (!input) return [];

  if (Array.isArray(input)) return input.map((v) => v.trim());

  return input
    .split(";")
    .map((v) => v.trim())
    .filter(Boolean);
};

function cleanStringForKey(value: string | null | undefined): string {
  if (!value) {
    return "desconhecido";
  }
  let cleanedString = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  cleanedString = cleanedString.toLowerCase();
  return cleanedString.replace(/\s/g, "");
}

function formatPhone(value: string | number): string {
  if (!value && value !== 0) return "";

  const digits = String(value).replace(/\D/g, "").slice(0, 11);
  const len = digits.length;
  if (len === 0) return "";

  if (len <= 2) {
    return `(${digits})`;
  }

  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);

  if (rest.length <= 4) {
    return `(${ddd}) ${rest}`;
  }

  if (len === 11) {
    const prefix = rest.slice(0, 5);
    const suffix = rest.slice(5);
    return `(${ddd}) ${prefix}${suffix ? `-${suffix}` : ""}`;
  }

  const prefix = rest.slice(0, 4);
  const suffix = rest.slice(4);
  return `(${ddd}) ${prefix}${suffix ? `-${suffix}` : ""}`;
}

const formatDocument = (value: string): string => {
  const digitsOnly = value.replace(/\D/g, "");

  if (digitsOnly.length <= 11) {
    return digitsOnly
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  return digitsOnly
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

const encodeIdForApi = (id: string | string[] | undefined): string => {
  if (!id) return "";
  const targetId = Array.isArray(id) ? id[0] : id;
  return encodeURIComponent(targetId);
};

const decodeIdFromApi = (encodedId: string): string => {
  if (!encodedId) return "";
  return decodeURIComponent(encodedId);
};

const combineDateTime = (
  dateOnly: string | Date,
  timeOnly: string | Date,
): string => {
  const dDate = new Date(dateOnly);
  const dTime = new Date(timeOnly);

  const combinedDate = new Date(
    dDate.getFullYear(),
    dDate.getMonth(),
    dDate.getDate(),
    dTime.getHours(),
    dTime.getMinutes(),
    0,
    0,
  );

  return combinedDate.toISOString();
};

const parseUTCDate = (date: string | Date | Dayjs): Dayjs => {
  return dayjs.utc(date).local();
};

const formatDateDivider = (dateString: string | undefined) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Hoje";
  if (date.toDateString() === yesterday.toDateString()) return "Ontem";

  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
  const year = date.getFullYear() !== today.getFullYear() ? ` ${date.getFullYear()}` : "";
  return `${day} ${month}${year}`;
};

export {
  encodeIdForApi,
  decodeIdFromApi,
  capitalizePhrase,
  cleanStringForKey,
  formatDate,
  formatDateISO,
  formatDateToDownload,
  formatNumberToAPI,
  formatSemicolonStringToArray,
  formatToBRL,
  formatToFloat,
  formatToInteger,
  formatToPercentage,
  normalizeString,
  removeFormatting,
  roundToDecimalPlaces,
  transformStringToDate,
  formatPhone,
  formatDocument,
  combineDateTime,
  parseUTCDate,
  formatDateDivider,
};

