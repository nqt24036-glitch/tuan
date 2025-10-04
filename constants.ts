// FIX: Create full content for `constants.ts` to define constants.
// FIX: Remove .ts extension from import path.
import { ItemRarity, CombatStats } from './types';

export const ITEM_RARITY_COLORS: Record<ItemRarity, string> = {
  'Phổ thông': 'border-gray-400',   // Trắng
  'Quý': 'border-green-500',      // Xanh lục
  'Hiếm': 'border-blue-500',       // Xanh lam
  'Truyền Kỳ': 'border-orange-500', // Cam
  'Thần Thoại': 'border-red-600',   // Đỏ
};

export const ITEM_RARITY_TEXT_COLORS: Record<ItemRarity, string> = {
  'Phổ thông': 'text-white',
  'Quý': 'text-green-400',
  'Hiếm': 'text-blue-400',
  'Truyền Kỳ': 'text-orange-400',
  'Thần Thoại': 'text-red-500',
};

// Labels for combat stats for UI display
export const COMBAT_STAT_LABELS: Record<keyof CombatStats, string> = {
  attack: 'Công Kích',
  magicAttack: 'Pháp Công',
  defense: 'Phòng Ngự',
  magicDefense: 'Kháng Phép',
  critRate: 'Tỉ Lệ Chí Mạng',
  critDamage: 'S.Thương Chí Mạng',
  accuracy: 'Chính Xác',
  evasion: 'Né Tránh',
  speed: 'Tốc Độ',
  armorPen: 'Xuyên Giáp',
  blockRate: 'Tỉ Lệ Chặn',
  mentalDemonResistance: 'Kháng Tâm Ma',
};