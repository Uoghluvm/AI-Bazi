
import type { BaziPillars } from '../types';

const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// Helper for modulo operations that handles negative numbers correctly.
const safeMod = (n: number, m: number) => ((n % m) + m) % m;

/**
 * Calculates the solar term day for a given year and term index.
 * This is an approximation formula, accurate for most modern dates.
 * @param year The Gregorian year.
 * @param termIndex The index of the solar term (0-23, 0 for 小寒).
 * @returns The day of the month for the solar term.
 */
const getSolarTermDay = (year: number, termIndex: number): number => {
    // Coefficients for the 21st century (2000-2099)
    const C = [
        5.4055, 20.12, 4.6292, 19.4599, 6.3826, 21.4155, 
        5.59, 20.888, 6.318, 21.86, 6.5, 22.2, 
        7.928, 23.65, 8.35, 23.95, 8.44, 23.822, 
        9.098, 24.218, 8.218, 23.55, 7.7428, 22.6
    ];
    // A simplified correction for different centuries
    const centuryOffset = (year >= 2000) ? 0 : (year >= 1900 ? 0.8 : 1.6);
    const Y = year % 100;
    const day = Y * 0.2422 + C[termIndex] - Math.floor(Y / 4) - centuryOffset;
    return Math.floor(day);
};

/**
 * Calculates the Bazi (Four Pillars) from a given Gregorian date and hour.
 * @param birthDateStr The user's birth date in 'YYYY-MM-DD' format.
 * @param birthHour The user's birth hour (0-23).
 * @returns A BaziPillars object containing the calculated stems and branches.
 */
export const getBaziPillars = (birthDateStr: string, birthHour: number): BaziPillars => {
    const [inputYear, inputMonth, inputDay] = birthDateStr.split('-').map(Number);
    // Use UTC for all calculations to avoid timezone issues.
    const birthDate = new Date(Date.UTC(inputYear, inputMonth - 1, inputDay, birthHour, 0, 0));

    // --- Year Pillar ---
    // The Bazi year starts at 立春 (Lichun), the 3rd solar term (index 2).
    let baziYear = birthDate.getUTCFullYear();
    const lichunMonth = 2; // February
    const lichunDay = getSolarTermDay(baziYear, 2); // 2 corresponds to 立春
    
    // Check if the birth date is before Lichun of the current Gregorian year.
    if ((birthDate.getUTCMonth() + 1 < lichunMonth) || 
        (birthDate.getUTCMonth() + 1 === lichunMonth && birthDate.getUTCDate() < lichunDay)) {
        baziYear -= 1;
    }
    const yearStemIndex = safeMod(baziYear - 4, 10);
    const yearBranchIndex = safeMod(baziYear - 4, 12);

    // --- Month Pillar (Corrected Logic) ---
    // Bazi months are defined by the 12 major solar terms (节).
    const monthBoundaries = [
        // Bazi Month, Gregorian Month, Solar Term Index, Branch Index
        { baziMonth: 1, gMonth: 2, termIndex: 2, branchIndex: 2 },  // 寅月 (Yin) starts at 立春
        { baziMonth: 2, gMonth: 3, termIndex: 4, branchIndex: 3 },  // 卯月 (Mao) starts at 惊蛰
        { baziMonth: 3, gMonth: 4, termIndex: 6, branchIndex: 4 },  // 辰月 (Chen)
        { baziMonth: 4, gMonth: 5, termIndex: 8, branchIndex: 5 },  // 巳月 (Si)
        { baziMonth: 5, gMonth: 6, termIndex: 10, branchIndex: 6 }, // 午月 (Wu)
        { baziMonth: 6, gMonth: 7, termIndex: 12, branchIndex: 7 }, // 未月 (Wei)
        { baziMonth: 7, gMonth: 8, termIndex: 14, branchIndex: 8 }, // 申月 (Shen)
        { baziMonth: 8, gMonth: 9, termIndex: 16, branchIndex: 9 }, // 酉月 (You)
        { baziMonth: 9, gMonth: 10, termIndex: 18, branchIndex: 10 },// 戌月 (Xu)
        { baziMonth: 10, gMonth: 11, termIndex: 20, branchIndex: 11 },// 亥月 (Hai)
        { baziMonth: 11, gMonth: 12, termIndex: 22, branchIndex: 0 }, // 子月 (Zi) starts at 大雪
        { baziMonth: 12, gMonth: 1, termIndex: 0, branchIndex: 1 }, // 丑月 (Chou) starts at 小寒
    ];
    
    let monthBranchIndex = 0;
    // Iterate backwards through the solar terms of the Bazi year to find the correct month.
    for (let i = 11; i >= 0; i--) {
        const boundary = monthBoundaries[i];
        // The term's year can be the next Gregorian year (for 小寒).
        const termYear = (boundary.gMonth === 1) ? baziYear + 1 : baziYear;
        const termDay = getSolarTermDay(termYear, boundary.termIndex);

        if ((birthDate.getUTCMonth() + 1 > boundary.gMonth) || 
            (birthDate.getUTCMonth() + 1 === boundary.gMonth && birthDate.getUTCDate() >= termDay)) {
            monthBranchIndex = boundary.branchIndex;
            break;
        }
    }
    
    // Correct Month Stem calculation (年上起月法)
    const yearStemGroup = safeMod(yearStemIndex, 5); // 0 for 甲/己, 1 for 乙/庚, ...
    const yinMonthStemIndex = [2, 4, 6, 8, 0][yearStemGroup]; // Stems for 寅月: 丙, 戊, 庚, 壬, 甲
    const monthBranchOffset = safeMod(monthBranchIndex - 2, 12); // Offset from 寅月 (branchIndex 2)
    const monthStemIndex = safeMod(yinMonthStemIndex + monthBranchOffset, 10);

    // --- Day Pillar (Corrected Logic) ---
    // A Bazi day starts at 23:00 of the previous day. Create an 'effective date' for calculation.
    let effectiveDate = new Date(Date.UTC(inputYear, inputMonth - 1, inputDay));
    if (birthHour === 23) {
      effectiveDate.setUTCDate(effectiveDate.getUTCDate() + 1);
    }
    
    // Use an accurate, known reference date: Jan 1, 2001 (UTC) was a 甲子 day.
    const refDate = new Date(Date.UTC(2001, 0, 1)); 
    const refStem = 0; // 甲 (Jia) is index 0
    const refBranch = 0; // 子 (Zi) is index 0
    
    const daysDiff = Math.floor((effectiveDate.getTime() - refDate.getTime()) / 86400000);
    
    const dayStemIndex = safeMod(refStem + daysDiff, 10);
    const dayBranchIndex = safeMod(refBranch + daysDiff, 12);
    
    // --- Hour Pillar (Now Correct because Day Pillar is Correct) ---
    // The earthly branch for the hour. 子時 (23:00-00:59) starts at 23:00.
    const hourBranchIndex = birthHour === 23 ? 0 : Math.floor((birthHour + 1) / 2);

    // The heavenly stem for the hour ("五鼠遁" rule).
    // The starting stem for 子時 depends on the day's stem.
    const hourStemStartMap = [0, 2, 4, 6, 8]; // 甲->甲, 乙->丙, 丙->戊, 丁->庚, 戊->壬
    const dayStemGroup = safeMod(dayStemIndex, 5); // Groups (甲,己), (乙,庚), etc.
    const hourStemStartIndex = hourStemStartMap[dayStemGroup];
    const hourStemIndex = safeMod(hourStemStartIndex + hourBranchIndex, 10);

    return {
        year: { stem: HEAVENLY_STEMS[yearStemIndex], branch: EARTHLY_BRANCHES[yearBranchIndex] },
        month: { stem: HEAVENLY_STEMS[monthStemIndex], branch: EARTHLY_BRANCHES[monthBranchIndex] },
        day: { stem: HEAVENLY_STEMS[dayStemIndex], branch: EARTHLY_BRANCHES[dayBranchIndex] },
        hour: { stem: HEAVENLY_STEMS[hourStemIndex], branch: EARTHLY_BRANCHES[hourBranchIndex] },
    };
};
