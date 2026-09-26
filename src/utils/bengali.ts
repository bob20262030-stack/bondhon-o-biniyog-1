// Bengali conversion utilities

const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumber(val: number | string | undefined | null): string {
  if (val === undefined || val === null) return '০';
  const str = val.toString();
  return str.replace(/\d/g, (d) => bengaliDigits[parseInt(d, 10)]);
}

export function formatCurrencyBengali(amount: number, withSymbol: boolean = true): string {
  if (isNaN(amount)) amount = 0;
  // Format with standard South Asian comma grouping (1,00,000)
  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));
  const s = absAmount.toString();
  let result = '';

  if (s.length <= 3) {
    result = s;
  } else {
    const lastThree = s.substring(s.length - 3);
    const otherNumbers = s.substring(0, s.length - 3);
    const withCommas = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    result = withCommas + ',' + lastThree;
  }

  const bengaliFormatted = toBengaliNumber(result);
  const prefix = isNegative ? '-' : '';
  return withSymbol ? `৳ ${prefix}${bengaliFormatted}` : `${prefix}${bengaliFormatted}`;
}

export function formatBengaliDate(dateInput: string | Date): string {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return dateInput.toString();
    const day = toBengaliNumber(d.getDate().toString().padStart(2, '0'));
    const monthIndex = d.getMonth();
    const year = toBengaliNumber(d.getFullYear());

    const bMonths = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    return `${day} ${bMonths[monthIndex]} ${year}`;
  } catch {
    return dateInput.toString();
  }
}

export const BENGALI_MONTHS = [
  'জানুয়ারি ২০২৬',
  'ফেব্রুয়ারি ২০২৬',
  'মার্চ ২০২৬',
  'এপ্রিল ২০২৬',
  'মে ২০২৬',
  'জুন ২০২৬',
  'জুলাই ২০২৬',
  'আগস্ট ২০২৬',
  'সেপ্টেম্বর ২০২৬',
  'অক্টোবর ২০২৬',
  'নভেম্বর ২০২৬',
  'ডিসেম্বর ২০২৬'
];
