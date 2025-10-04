// FIX: Create full content for `data/gameData.ts`, defining and exporting game data constants to resolve module errors across the application.
// MODIFIED: Added new monster-specific skills and assigned them to various monsters for the enhanced combat AI.
import { Item, Monster, TranPhap, Skill, NPC, Companion, CultivationMethod } from '../types.ts';

export const CULTIVATION_METHODS_LIST: CultivationMethod[] = [
  {
    id: 'cm_001',
    name: 'Thanh Tâm Quyết',
    description: 'Công pháp cơ bản, giúp tĩnh tâm, loại bỏ tạp niệm, tập trung vào việc hấp thụ linh khí. Tăng nhẹ tốc độ tu luyện.',
    realmRequirement: 'Luyện Khí',
    bonuses: {
      cultivationSpeedBonus: 0.15,
    }
  },
  {
    id: 'cm_002',
    name: 'Kim Cang Quyết',
    description: 'Công pháp luyện thể, dùng linh khí để tôi luyện thân thể, khiến nó trở nên cứng rắn như kim cương. Tăng mạnh phòng ngự và sinh lực.',
    realmRequirement: 'Trúc Cơ',
    bonuses: {
      hp: 100,
      defense: 50,
      cultivationSpeedBonus: 0.05,
    }
  },
  {
    id: 'cm_003',
    name: 'Liệt Hỏa Kinh',
    description: 'Công pháp bá đạo, chuyển hóa linh khí thành chân hỏa, thiêu đốt kinh mạch để tăng cường sức mạnh bộc phát. Tăng mạnh công kích.',
    realmRequirement: 'Kim Đan',
    bonuses: {
      attack: 50,
      magicAttack: 50,
      critRate: 0.05,
      cultivationSpeedBonus: 0.05,
    }
  },
  {
    id: 'cm_004',
    name: 'Trường Xuân Công',
    description: 'Công pháp ôn hòa, dùng linh khí để nuôi dưỡng sinh cơ, giúp kéo dài tuổi thọ và tăng cường toàn diện. Các thuộc tính được tăng trưởng cân bằng.',
    realmRequirement: 'Nguyên Anh',
    bonuses: {
      hp: 50,
      mp: 50,
      attack: 20,
      defense: 20,
      magicAttack: 20,
      magicDefense: 20,
      cultivationSpeedBonus: 0.10,
    }
  },
  {
    id: 'cm_005',
    name: 'Vạn Pháp Quy Nhất',
    description: 'Công pháp cao thâm, dung hợp vạn pháp, giúp tu sĩ tăng trưởng toàn diện các thuộc tính chiến đấu và phòng ngự.',
    realmRequirement: 'Hóa Thần',
    bonuses: {
      hp: 150,
      mp: 100,
      attack: 70,
      defense: 70,
      magicAttack: 70,
      magicDefense: 70,
      evasion: 0.05,
      accuracy: 0.05,
    }
  },
  {
    id: 'cm_006',
    name: 'Thái Thượng Vong Tình Lục',
    description: 'Ghi chép về cảnh giới vô tình của đại đạo, người tu luyện sẽ gạt bỏ thất tình lục dục, tốc độ hấp thụ linh khí tăng đến mức khó tin.',
    realmRequirement: 'Luyện Hư',
    bonuses: {
      cultivationSpeedBonus: 0.50,
      mentalDemonResistance: 0.15,
    }
  },
  {
    id: 'cm_007',
    name: 'Sát Lục Ma Điển',
    description: 'Ma điển thượng cổ, càng chiến đấu càng mạnh, lấy sát khí để tôi luyện bản thân, sức tấn công vô cùng bá đạo.',
    realmRequirement: 'Hợp Thể',
    bonuses: {
      attack: 200,
      magicAttack: 200,
      critRate: 0.15,
      critDamage: 0.5,
      armorPen: 0.2,
    }
  },
  {
    id: 'cm_008',
    name: 'Bất Diệt Thánh Thể',
    description: 'Công pháp luyện thể chí cao, tôi luyện thân thể thành thánh thể bất diệt, vạn kiếp khó tổn, là nền tảng để vượt qua thiên kiếp.',
    realmRequirement: 'Độ Kiếp',
    bonuses: {
      hp: 1000,
      defense: 300,
      magicDefense: 300,
      blockRate: 0.10,
    }
  }
];

// START: Updated Thematic Items
const THEMATIC_ITEMS: Item[] = [
  // --- Phổ Thông (Common) ---
  { id: 'item_com_01', name: 'Áo Vải Thanh Thủy', type: 'Áo giáp', rarity: 'Phổ thông', slot: 'áo giáp', icon: '👕', stats: { defense: 13 }, requirement: 'Cấp 1', description: 'Một chiếc áo vải đơn sơ nhưng chắc chắn, được các thợ may trong Thôn Thanh Thủy làm ra.', story: 'Mỗi đường kim mũi chỉ đều chứa đựng hy vọng về một cuộc sống bình yên.', value: 10 },
  { id: 'item_com_02', name: 'Kiếm Sắt Luyện Tập', type: 'Vũ khí', rarity: 'Phổ thông', slot: 'vũ khí', icon: '🗡️', stats: { attack: 9 }, requirement: 'Cấp 2', description: 'Vũ khí tiêu chuẩn cho các tu sĩ mới nhập môn, dùng để rèn luyện thân thể.', story: 'Trên thân kiếm còn khắc chữ "Cần cù".', value: 12 },
  { id: 'item_com_03', name: 'Giáp Da Chuột Rừng', type: 'Áo giáp', rarity: 'Phổ thông', slot: 'áo giáp', icon: '👕', stats: { defense: 19 }, requirement: 'Cấp 3', description: 'Được làm từ da của những con chuột lớn sống trong rừng, có khả năng chống đỡ các vết cào nhỏ.', story: 'Vẫn còn thoang thoảng mùi của rừng xanh.', value: 15 },
  { id: 'item_com_04', name: 'Đao Tuần Tra', type: 'Vũ khí', rarity: 'Phổ thông', slot: 'vũ khí', icon: '🗡️', stats: { attack: 13 }, requirement: 'Cấp 4', description: 'Vũ khí trang bị cho lính gác của Thành Vân Lâm.', story: 'Một vũ khí đáng tin cậy cho những đêm dài canh gác.', value: 18 },
  { id: 'item_com_05', name: 'Giáp Trúc Vân Lâm', type: 'Áo giáp', rarity: 'Phổ thông', slot: 'áo giáp', icon: '👕', stats: { defense: 25 }, requirement: 'Cấp 5', description: 'Loại giáp nhẹ làm từ những đốt trúc cứng cáp trong rừng trúc phía nam thành.', story: 'Nhẹ nhàng và linh hoạt, được các lãng khách ưa chuộng.', value: 20 },
  { id: 'item_com_06', name: 'Thương Sắt Nhọn', type: 'Vũ khí', rarity: 'Phổ thông', slot: 'vũ khí', icon: '🗡️', stats: { attack: 17 }, requirement: 'Cấp 6', description: 'Một cây thương đơn giản nhưng hiệu quả, dễ dàng chế tạo.', story: 'Đầu thương được mài sắc bén, có thể xuyên qua lớp da dày.', value: 22 },
  { id: 'item_com_07', name: 'Áo Choàng Bụi Bặm', type: 'Áo giáp', rarity: 'Phổ thông', slot: 'áo giáp', icon: '👕', stats: { defense: 31 }, requirement: 'Cấp 7', description: 'Chiếc áo choàng của một người lữ hành, đã bạc màu vì sương gió.', story: 'Nó đã chứng kiến nhiều câu chuyện hơn bạn có thể tưởng tượng.', value: 25 },
  { id: 'item_com_08', name: 'Song Thủ Luyện Công', type: 'Vũ khí', rarity: 'Phổ thông', slot: 'vũ khí', icon: '🗡️', stats: { attack: 21 }, requirement: 'Cấp 8', description: 'Một cặp dao găm cơ bản để luyện tập song thủ.', story: 'Sự cân bằng là chìa khóa để sử dụng chúng hiệu quả.', value: 28 },
  { id: 'item_com_09', name: 'Giáp Da Sói', type: 'Áo giáp', rarity: 'Phổ thông', slot: 'áo giáp', icon: '👕', stats: { defense: 37 }, requirement: 'Cấp 9', description: 'Được làm từ da của những con chó hoang hung dữ.', story: 'Mang trên mình sức mạnh của loài dã thú.', value: 30 },
  { id: 'item_com_10', name: 'Trường Đao Mê Ảnh', type: 'Vũ khí', rarity: 'Phổ thông', slot: 'vũ khí', icon: '🗡️', stats: { attack: 25 }, requirement: 'Cấp 10', description: 'Vũ khí thường được tìm thấy trong Rừng Mê Ảnh, lưỡi đao phản chiếu ánh sáng kỳ lạ.', story: 'Người ta nói rằng nó có thể chém vào cả những ảo ảnh.', value: 32 },
  { id: 'item_com_11', name: 'Giáp Mộc', type: 'Áo giáp', rarity: 'Phổ thông', slot: 'áo giáp', icon: '👕', stats: { defense: 43 }, requirement: 'Cấp 11', description: 'Giáp làm từ vỏ cây cổ thụ, cứng hơn tưởng tượng.', story: 'Hấp thụ linh khí của đất trời, mang lại cảm giác vững chãi.', value: 35 },
  { id: 'item_com_12', name: 'Búa Chiến Sơ Cấp', type: 'Vũ khí', rarity: 'Phổ thông', slot: 'vũ khí', icon: '🗡️', stats: { attack: 29 }, requirement: 'Cấp 12', description: 'Một cây búa nặng, thích hợp cho những người có sức mạnh.', story: 'Một cú vung có thể làm nứt cả đá tảng.', value: 38 },
  { id: 'item_com_13', name: 'Giáp Thép Non', type: 'Áo giáp', rarity: 'Phổ thông', slot: 'áo giáp', icon: '👕', stats: { defense: 49 }, requirement: 'Cấp 13', description: 'Một bộ giáp thép được rèn bởi các thợ rèn tập sự.', story: 'Dù tay nghề còn non, nhưng nó vẫn đủ để bảo vệ.', value: 40 },
  { id: 'item_com_14', name: 'Cung Tên Thợ Săn', type: 'Vũ khí', rarity: 'Phổ thông', slot: 'vũ khí', icon: '🗡️', stats: { attack: 33 }, requirement: 'Cấp 14', description: 'Cây cung đáng tin cậy của những người sống bằng nghề săn bắn.', story: 'Mỗi mũi tên đều mang theo hy vọng về một bữa ăn no.', value: 42 },
  { id: 'item_com_15', name: 'Giáp Vảy Nhện', type: 'Áo giáp', rarity: 'Phổ thông', slot: 'áo giáp', icon: '👕', stats: { defense: 55 }, requirement: 'Cấp 15', description: 'Được dệt từ tơ của Nhện Độc, nhẹ và bền.', story: 'Có khả năng chống lại các loại độc tố nhẹ.', value: 45 },
  { id: 'item_com_16', name: 'Dao Găm Độc', type: 'Vũ khí', rarity: 'Phổ thông', slot: 'vũ khí', icon: '🗡️', stats: { attack: 37 }, requirement: 'Cấp 16', description: 'Lưỡi dao được tẩm nọc của Nhện Độc.', story: 'Một vết xước nhỏ cũng đủ để gây ra phiền toái.', value: 48 },
  { id: 'item_com_17', name: 'Giáp Da Hổ', type: 'Áo giáp', rarity: 'Phổ thông', slot: 'áo giáp', icon: '👕', stats: { defense: 61 }, requirement: 'Cấp 17', description: 'Được làm từ da của Hổ Vằn Lửa Rừng, mang uy thế của chúa sơn lâm.', story: 'Những vết sẹo trên tấm da kể về những trận chiến khốc liệt.', value: 50 },
  { id: 'item_com_18', name: 'Vuốt Hổ', type: 'Vũ khí', rarity: 'Phổ thông', slot: 'vũ khí', icon: '🗡️', stats: { attack: 41 }, requirement: 'Cấp 18', description: 'Một cặp vũ khí được chế tác từ móng vuốt của Hổ Vằn Lửa Rừng.', story: 'Sắc bén và chết chóc, mô phỏng sự hung hãn của loài hổ.', value: 52 },
  { id: 'item_com_19', name: 'Giáp Hang Động', type: 'Áo giáp', rarity: 'Phổ thông', slot: 'áo giáp', icon: '👕', stats: { defense: 67 }, requirement: 'Cấp 19', description: 'Bộ giáp được tìm thấy trong các hang động tối tăm, phủ đầy rêu và bụi.', story: 'Ai là chủ nhân trước đây của nó? Không ai biết.', value: 55 },
  { id: 'item_com_20', name: 'Côn Nhị Khúc', type: 'Vũ khí', rarity: 'Phổ thông', slot: 'vũ khí', icon: '🗡️', stats: { attack: 45 }, requirement: 'Cấp 20', description: 'Vũ khí linh hoạt, khó sử dụng nhưng uy lực.', story: 'Vũ khí yêu thích của các tán tu thích sự tự do.', value: 58 },
  { id: 'item_com_21', name: 'Giáp Đá Tinh Thạch', type: 'Áo giáp', rarity: 'Phổ thông', slot: 'áo giáp', icon: '👕', stats: { defense: 73 }, requirement: 'Cấp 21', description: 'Được ghép từ những mảnh đá chứa linh khí yếu.', story: 'Phát ra ánh sáng mờ ảo trong bóng tối.', value: 60 },
  { id: 'item_com_22', name: 'Giáo Luyện Khí', type: 'Vũ khí', rarity: 'Phổ thông', slot: 'vũ khí', icon: '🗡️', stats: { attack: 49 }, requirement: 'Cấp 22', description: 'Một cây giáo đơn giản, thường được dùng bởi các tu sĩ Luyện Khí Kỳ.', story: 'Vũ khí phổ biến trong các cuộc giao tranh nhỏ.', value: 62 },
  { id: 'item_com_23', name: 'Giáp Tinh Anh', type: 'Áo giáp', rarity: 'Phổ thông', slot: 'áo giáp', icon: '👕', stats: { defense: 79 }, requirement: 'Cấp 23', description: 'Bộ giáp tiêu chuẩn của các đệ tử ưu tú trong tông môn.', story: 'Là biểu tượng của sự nỗ lực và tài năng.', value: 65 },
  { id: 'item_com_24', name: 'Kiếm Đệ Tử', type: 'Vũ khí', rarity: 'Phổ thông', slot: 'vũ khí', icon: '🗡️', stats: { attack: 53 }, requirement: 'Cấp 24', description: 'Kiếm được tông môn cấp phát cho các đệ tử chính thức.', story: 'Trên vỏ kiếm khắc tên của tông môn.', value: 68 },
  { id: 'item_com_25', name: 'Giáp Hộ Vệ', type: 'Áo giáp', rarity: 'Phổ thông', slot: 'áo giáp', icon: '👕', stats: { defense: 85 }, requirement: 'Cấp 25', description: 'Bộ giáp nặng, dành cho những người đứng ở tuyến đầu.', story: 'Tấm lưng vững chãi là chỗ dựa cho đồng đội.', value: 70 },
  { id: 'item_com_26', name: 'Đại Đao Hộ Vệ', type: 'Vũ khí', rarity: 'Phổ thông', slot: 'vũ khí', icon: '🗡️', stats: { attack: 57 }, requirement: 'Cấp 26', description: 'Thanh đại đao nặng trịch, chỉ những người có sức mạnh phi thường mới có thể sử dụng.', story: 'Một nhát chém có thể quét sạch mọi chướng ngại.', value: 72 },
  { id: 'item_com_27', name: 'Áo Choàng Tịch Dương', type: 'Áo giáp', rarity: 'Phổ thông', slot: 'áo giáp', icon: '👕', stats: { defense: 91 }, requirement: 'Cấp 27', description: 'Chiếc áo choàng được nhuộm màu của hoàng hôn trên Đỉnh Tịch Dương.', story: 'Mang trong mình sự ấm áp của những tia nắng cuối cùng.', value: 75 },
  { id: 'item_com_28', name: 'Pháp Trượng Tịch Dương', type: 'Vũ khí', rarity: 'Phổ thông', slot: 'vũ khí', icon: '🗡️', stats: { attack: 61 }, requirement: 'Cấp 28', description: 'Cây trượng gỗ được hấp thụ linh khí trên Đỉnh Tịch Dương.', story: 'Đầu trượng khảm một viên đá phát ra ánh sáng dịu nhẹ.', value: 78 },
  { id: 'item_com_29', name: 'Giáp Trúc Cơ Sơ Nhập', type: 'Áo giáp', rarity: 'Phổ thông', slot: 'áo giáp', icon: '👕', stats: { defense: 97 }, requirement: 'Cấp 29', description: 'Bộ giáp đơn giản dành cho các tu sĩ vừa đột phá Trúc Cơ.', story: 'Là bước khởi đầu trên con đường tu tiên thực sự.', value: 80 },
  { id: 'item_com_30', name: 'Kiếm Trúc Cơ', type: 'Vũ khí', rarity: 'Phổ thông', slot: 'vũ khí', icon: '🗡️', stats: { attack: 65 }, requirement: 'Cấp 30', description: 'Thanh kiếm được gia trì một ít linh lực, sắc bén hơn kiếm phàm.', story: 'Có thể chém đứt sắt thép một cách dễ dàng.', value: 82 },

  // --- Quý (Rare) -> Bây giờ là Quý (Uncommon) để phân biệt ---
  { id: 'item_rar_01', name: 'Huyết Lang Nha Kiếm', type: 'Vũ khí', rarity: 'Quý', slot: 'vũ khí', icon: '🗡️', stats: { attack: 23, critRate: 0.03 }, requirement: 'Cấp 16', description: 'Được rèn từ nanh của một con sói yêu, lưỡi kiếm ánh lên màu đỏ của máu.', story: 'Nghe đồn nó vẫn còn giữ lại sự hung hãn của yêu thú.', value: 150 },
  { id: 'item_rar_02', name: 'Hộ Phù Bình An', type: 'Pháp bảo', rarity: 'Quý', slot: 'pháp bảo', icon: '💍', stats: { hp: 70 }, requirement: 'Cấp 17', description: 'Lá bùa được các đạo sĩ cao tay khai quang, mang lại sự bình an.', story: 'Chứa đựng một chút linh lực bảo vệ, có thể giúp chủ nhân tránh được tai ương nhỏ.', value: 160 },
  { id: 'item_rar_03', name: 'Lân Giáp Đao', type: 'Vũ khí', rarity: 'Quý', slot: 'vũ khí', icon: '🗡️', stats: { attack: 29, critRate: 0.03 }, requirement: 'Cấp 18', description: 'Thân đao được khảm vảy của một loài cá yêu, vừa đẹp vừa chắc chắn.', story: 'Khi vung lên, nó tạo ra âm thanh như sóng vỗ.', value: 170 },
  { id: 'item_rar_04', name: 'Trâm Gỗ Linh Tê', type: 'Pháp bảo', rarity: 'Quý', slot: 'pháp bảo', icon: '💍', stats: { hp: 90 }, requirement: 'Cấp 19', description: 'Được làm từ gỗ của cây Linh Tê, giúp tĩnh tâm an thần.', story: 'Đeo nó bên người có thể giúp chống lại tâm ma xâm nhập.', value: 180 },
  { id: 'item_rar_05', name: 'Kiếm Thanh Phong', type: 'Vũ khí', rarity: 'Quý', slot: 'vũ khí', icon: '🗡️', stats: { attack: 35, critRate: 0.03 }, requirement: 'Cấp 20', description: 'Một thanh kiếm nhẹ và nhanh, khi múa lên tựa như gió thoảng.', story: 'Lựa chọn của những tu sĩ theo đuổi tốc độ.', value: 190 },
  { id: 'item_rar_06', name: 'Ngọc Bội Tụ Linh', type: 'Pháp bảo', rarity: 'Quý', slot: 'pháp bảo', icon: '💍', stats: { hp: 110 }, requirement: 'Cấp 21', description: 'Miếng ngọc bội có khả năng thu hút linh khí xung quanh.', story: 'Giúp người đeo cảm thấy tinh thần sảng khoái, tu luyện nhanh hơn một chút.', value: 200 },
  { id: 'item_rar_07', name: 'Chiến Chuỳ Thiết Đầu', type: 'Vũ khí', rarity: 'Quý', slot: 'vũ khí', icon: '🗡️', stats: { attack: 41, critRate: 0.03 }, requirement: 'Cấp 22', description: 'Cây chuỳ sắt nặng, có sức công phá đáng kể.', story: 'Được các thể tu ưa dùng để rèn luyện cơ bắp.', value: 210 },
  { id: 'item_rar_08', name: 'Túi Thơm An Thần', type: 'Pháp bảo', rarity: 'Quý', slot: 'pháp bảo', icon: '💍', stats: { hp: 130 }, requirement: 'Cấp 23', description: 'Bên trong chứa các loại linh thảo giúp an thần, tĩnh tâm.', story: 'Mùi hương của nó có thể xua đuổi các loài yêu thú cấp thấp.', value: 220 },
  { id: 'item_rar_09', name: 'Cung Linh Mộc', type: 'Vũ khí', rarity: 'Quý', slot: 'vũ khí', icon: '🗡️', stats: { attack: 47, critRate: 0.03 }, requirement: 'Cấp 24', description: 'Được làm từ cành của cây linh mộc, có tính đàn hồi tốt.', story: 'Mũi tên bắn ra được gia trì bởi linh khí của mộc.', value: 230 },
  { id: 'item_rar_10', name: 'Gương Hộ Tâm', type: 'Pháp bảo', rarity: 'Quý', slot: 'pháp bảo', icon: '💍', stats: { hp: 150 }, requirement: 'Cấp 25', description: 'Một chiếc gương đồng nhỏ, có thể phản lại các đòn tấn công tinh thần.', story: 'Người ta nói rằng nó có thể chiếu rọi cả những ý nghĩ xấu xa.', value: 240 },
  { id: 'item_rar_11', name: 'Pháp Trượng Tinh Thạch', type: 'Vũ khí', rarity: 'Quý', slot: 'vũ khí', icon: '🗡️', stats: { attack: 53, critRate: 0.03 }, requirement: 'Cấp 26', description: 'Đầu trượng khảm một viên tinh thạch, giúp khuếch đại pháp thuật.', story: 'Là công cụ không thể thiếu của các pháp tu.', value: 250 },
  { id: 'item_rar_12', name: 'Chuỗi Hạt Định Tâm', type: 'Pháp bảo', rarity: 'Quý', slot: 'pháp bảo', icon: '💍', stats: { hp: 170 }, requirement: 'Cấp 27', description: 'Chuỗi hạt làm từ gỗ đàn hương, giúp người đeo tập trung khi tu luyện.', story: 'Mỗi hạt đều được khắc một câu chú nhỏ.', value: 260 },
  { id: 'item_rar_13', name: 'Bão Kiếm', type: 'Vũ khí', rarity: 'Quý', slot: 'vũ khí', icon: '🗡️', stats: { attack: 59, critRate: 0.03 }, requirement: 'Cấp 28', description: 'Thanh kiếm rộng bản, khi vung lên tạo ra tiếng gió rít.', story: 'Sức mạnh của nó như một cơn bão nhỏ.', value: 270 },
  { id: 'item_rar_14', name: 'Ấn Trấn Hồn', type: 'Pháp bảo', rarity: 'Quý', slot: 'pháp bảo', icon: '💍', stats: { hp: 190 }, requirement: 'Cấp 29', description: 'Một chiếc ấn nhỏ, có khả năng trấn áp các loại tà ma, yêu quỷ.', story: 'Thường được các đạo sĩ dùng trong các chuyến đi hàng yêu diệt ma.', value: 280 },
  { id: 'item_rar_15', name: 'Lôi Tinh Song Đao', type: 'Vũ khí', rarity: 'Quý', slot: 'vũ khí', icon: '🗡️', stats: { attack: 65, critRate: 0.03 }, requirement: 'Cấp 30', description: 'Cặp đao được rèn trong đêm mưa bão, hấp thụ một tia sét.', story: 'Khi chém vào nhau, chúng phát ra tia lửa điện nhỏ.', value: 290 },
  { id: 'item_rar_16', name: 'Kim Cang Bội', type: 'Pháp bảo', rarity: 'Quý', slot: 'pháp bảo', icon: '💍', stats: { hp: 210 }, requirement: 'Cấp 31', description: 'Miếng ngọc bội khắc hình thần Kim Cang, tăng cường sự cứng cáp.', story: 'Mang lại cho người đeo một ý chí sắt đá, không dễ bị khuất phục.', value: 300 },
  { id: 'item_rar_17', name: 'Băng Tinh Kiếm', type: 'Vũ khí', rarity: 'Quý', slot: 'vũ khí', icon: '🗡️', stats: { attack: 71, critRate: 0.03 }, requirement: 'Cấp 32', description: 'Thanh kiếm được làm từ băng vĩnh cửu, tỏa ra hàn khí.', story: 'Có thể làm chậm kẻ địch khi gây ra vết thương.', value: 310 },
  { id: 'item_rar_18', name: 'Hỏa Vân Châu', type: 'Pháp bảo', rarity: 'Quý', slot: 'pháp bảo', icon: '💍', stats: { hp: 230 }, requirement: 'Cấp 33', description: 'Viên ngọc chứa đựng linh lực của hỏa, ấm áp khi chạm vào.', story: 'Trong đêm tối, nó tỏa ra ánh sáng như một đám mây lửa nhỏ.', value: 320 },
  { id: 'item_rar_19', name: 'Âm Phong Đao', type: 'Vũ khí', rarity: 'Quý', slot: 'vũ khí', icon: '🗡️', stats: { attack: 77, critRate: 0.03 }, requirement: 'Cấp 34', description: 'Lưỡi đao mỏng như cánh ve, được rèn trong nơi âm khí nặng nề.', story: 'Tiếng vung đao như tiếng gió rít qua khe cửa địa ngục.', value: 330 },
  { id: 'item_rar_20', name: 'Linh Quy Giáp', type: 'Pháp bảo', rarity: 'Quý', slot: 'pháp bảo', icon: '💍', stats: { hp: 250 }, requirement: 'Cấp 35', description: 'Một chiếc mai rùa nhỏ, được khắc đầy phù văn phòng ngự.', story: 'Là bùa hộ mệnh của những người hay đi xa.', value: 340 },
  
  // --- Hiếm (Epic) -> bây giờ là Hiếm (Rare) ---
  { id: 'item_epi_01', name: 'Giáp Trảm Phong', type: 'Áo giáp', rarity: 'Hiếm', slot: 'áo giáp', icon: '👕', stats: { attack: 45, evasion: 0.05 }, requirement: 'Luyện Khí Tầng 1', description: 'Bộ giáp được thiết kế để giảm tối đa sức cản của gió, tăng sự linh hoạt.', story: 'Mặc nó vào, cảm giác như có thể cưỡi gió mà đi.', value: 400 },
  { id: 'item_epi_02', name: 'Hắc Thạch Hộ Thuẫn', type: 'Pháp bảo', rarity: 'Hiếm', slot: 'pháp bảo', icon: '🛡️', stats: { defense: 74, magicDefense: 20 }, requirement: 'Luyện Khí Tầng 2', description: 'Một tấm khiên nhỏ làm từ Hắc Thạch, cực kỳ cứng rắn.', story: 'Nó đã từng chặn một đòn toàn lực của một yêu thú Trúc Cơ Kỳ.', value: 420 },
  { id: 'item_epi_03', name: 'Lam Diệp Sam', type: 'Áo giáp', rarity: 'Hiếm', slot: 'áo giáp', icon: '👕', stats: { attack: 55, evasion: 0.05 }, requirement: 'Luyện Khí Tầng 3', description: 'Chiếc áo được dệt từ tơ của một loài linh tằm, có màu xanh như lá biếc.', story: 'Mặc vào cảm thấy mát mẻ, tinh thần tỉnh táo.', value: 440 },
  { id: 'item_epi_04', name: 'Vòng Kim Cô', type: 'Pháp bảo', rarity: 'Hiếm', slot: 'pháp bảo', icon: '🛡️', stats: { defense: 88, magicDefense: 25 }, requirement: 'Luyện Khí Tầng 4', description: 'Một chiếc vòng vàng, khi được truyền linh lực sẽ trở nên vô cùng cứng rắn.', story: 'Không phải là cái vòng trên đầu của Tề Thiên Đại Thánh đâu.', value: 460 },
  { id: 'item_epi_05', name: 'Bách Hoa Y', type: 'Áo giáp', rarity: 'Hiếm', slot: 'áo giáp', icon: '👕', stats: { attack: 65, evasion: 0.05 }, requirement: 'Luyện Khí Tầng 5', description: 'Chiếc áo được thêu hình trăm loài hoa, tỏa ra hương thơm dịu nhẹ.', story: 'Là tác phẩm của một tiên tử yêu hoa cỏ.', value: 480 },
  { id: 'item_epi_06', name: 'Chuông Lạc Hồn', type: 'Pháp bảo', rarity: 'Hiếm', slot: 'pháp bảo', icon: '🛡️', stats: { defense: 102, magicDefense: 30 }, requirement: 'Luyện Khí Tầng 6', description: 'Tiếng chuông có thể làm nhiễu loạn thần trí của đối phương.', story: 'Hãy cẩn thận, chính bạn cũng có thể bị ảnh hưởng nếu không tập trung.', value: 500 },
  { id: 'item_epi_07', name: 'Huyết Sắc Chiến Giáp', type: 'Áo giáp', rarity: 'Hiếm', slot: 'áo giáp', icon: '👕', stats: { attack: 75, evasion: 0.05 }, requirement: 'Luyện Khí Tầng 7', description: 'Bộ giáp được nhuộm màu đỏ của máu, mang sát khí nồng đậm.', story: 'Càng chiến đấu, bộ giáp càng trở nên sáng rực.', value: 520 },
  { id: 'item_epi_08', name: 'Phiên Thiên Ấn', type: 'Pháp bảo', rarity: 'Hiếm', slot: 'pháp bảo', icon: '🛡️', stats: { defense: 116, magicDefense: 35 }, requirement: 'Luyện Khí Tầng 8', description: 'Một chiếc ấn có thể phóng to, đập xuống với sức mạnh ngàn cân.', story: 'Là một pháp bảo mô phỏng theo một món cổ vật thần thoại.', value: 540 },
  { id: 'item_epi_09', name: 'Minh Quang Giáp', type: 'Áo giáp', rarity: 'Hiếm', slot: 'áo giáp', icon: '👕', stats: { attack: 85, evasion: 0.05 }, requirement: 'Luyện Khí Tầng 9', description: 'Bộ giáp được đánh bóng loáng, có thể phản chiếu ánh sáng gây chói mắt kẻ địch.', story: 'Vừa là phòng ngự, vừa là một công cụ chiến thuật.', value: 560 },
  { id: 'item_epi_10', name: 'Hồ Lô Hút Linh', type: 'Pháp bảo', rarity: 'Hiếm', slot: 'pháp bảo', icon: '🛡️', stats: { defense: 130, magicDefense: 40 }, requirement: 'Luyện Khí Tầng 10', description: 'Một quả hồ lô nhỏ, có thể hút linh khí từ kẻ địch.', story: 'Bên trong là một không gian nhỏ, dùng để chứa đựng linh khí.', value: 580 },
  { id: 'item_epi_11', name: 'Giáp Gai Phản Thương', type: 'Áo giáp', rarity: 'Hiếm', slot: 'áo giáp', icon: '👕', stats: { attack: 95, evasion: 0.05 }, requirement: 'Luyện Khí Tầng 11', description: 'Bề mặt bộ giáp đầy những chiếc gai nhọn, làm bị thương kẻ tấn công.', story: 'Cách phòng ngự tốt nhất là tấn công.', value: 600 },
  { id: 'item_epi_12', name: 'Cờ Lệnh Ngũ Hành', type: 'Pháp bảo', rarity: 'Hiếm', slot: 'pháp bảo', icon: '🛡️', stats: { defense: 144, magicDefense: 45 }, requirement: 'Luyện Khí Tầng 12', description: 'Lá cờ nhỏ thêu hình Ngũ hành, có thể tăng cường pháp thuật tương ứng.', story: 'Là vật bất ly thân của các trận pháp sư.', value: 620 },
  { id: 'item_epi_13', name: 'Ngân Long Giáp', type: 'Áo giáp', rarity: 'Hiếm', slot: 'áo giáp', icon: '👕', stats: { attack: 105, evasion: 0.05 }, requirement: 'Luyện Khí Tầng 13', description: 'Bộ giáp được chế tác phỏng theo vảy của rồng bạc.', story: 'Mang lại cho người mặc sự uy nghiêm của loài rồng.', value: 640 },
  { id: 'item_epi_14', name: 'Đèn Dẫn Hồn', type: 'Pháp bảo', rarity: 'Hiếm', slot: 'pháp bảo', icon: '🛡️', stats: { defense: 158, magicDefense: 50 }, requirement: 'Luyện Khí Tầng 14', description: 'Chiếc đèn lồng có thể soi rọi đường đi trong cõi âm.', story: 'Cũng có thể dùng để triệu hồi các oan hồn yếu ớt để chiến đấu.', value: 660 },
  { id: 'item_epi_15', name: 'Giáp Trọng Lực', type: 'Áo giáp', rarity: 'Hiếm', slot: 'áo giáp', icon: '👕', stats: { attack: 115, evasion: 0.05 }, requirement: 'Luyện Khí Tầng 15', description: 'Bộ giáp được khắc trọng lực trận, cực kỳ nặng.', story: 'Mặc nó để tu luyện có thể làm ít công to.', value: 680 },
  { id: 'item_epi_16', name: 'La Bàn Tầm Bảo', type: 'Pháp bảo', rarity: 'Hiếm', slot: 'pháp bảo', icon: '🛡️', stats: { defense: 172, magicDefense: 55 }, requirement: 'Luyện Khí Tầng 16', description: 'Chiếc la bàn có thể chỉ đến nơi có bảo vật hoặc linh khí mạnh.', story: 'Đôi khi nó cũng chỉ đến những nơi cực kỳ nguy hiểm.', value: 700 },
  { id: 'item_epi_17', name: 'Linh Vũ Giáp', type: 'Áo giáp', rarity: 'Hiếm', slot: 'áo giáp', icon: '👕', stats: { attack: 125, evasion: 0.05 }, requirement: 'Luyện Khí Tầng 17', description: 'Bộ giáp được làm từ lông vũ của một loài linh điểu.', story: 'Giúp người mặc di chuyển nhẹ nhàng và nhanh nhẹn hơn.', value: 720 },
  { id: 'item_epi_18', name: 'Sơn Hà Xã Tắc Đồ', type: 'Pháp bảo', rarity: 'Hiếm', slot: 'pháp bảo', icon: '🛡️', stats: { defense: 186, magicDefense: 60 }, requirement: 'Luyện Khí Tầng 18', description: 'Một bức tranh cuộn, có thể nhốt kẻ địch vào trong đó.', story: 'Bên trong là một thế giới nhỏ có núi sông, cây cỏ.', value: 740 },
  { id: 'item_epi_19', name: 'Vô Ảnh Giáp', type: 'Áo giáp', rarity: 'Hiếm', slot: 'áo giáp', icon: '👕', stats: { attack: 135, evasion: 0.05 }, requirement: 'Luyện Khí Tầng 19', description: 'Bộ giáp có thể tàng hình trong một thời gian ngắn.', story: 'Công cụ hoàn hảo cho việc ám sát và do thám.', value: 760 },
  { id: 'item_epi_20', name: 'Tháp Trấn Yêu', type: 'Pháp bảo', rarity: 'Hiếm', slot: 'pháp bảo', icon: '🛡️', stats: { defense: 200, magicDefense: 65 }, requirement: 'Luyện Khí Tầng 20', description: 'Một tòa tháp nhỏ, có khả năng trấn áp và làm suy yếu yêu khí.', story: 'Là khắc tinh của nhiều loại yêu thú.', value: 780 },
  
  // --- Truyền Kỳ (Legendary) ---
  { id: 'item_leg_01', name: 'Lưu Quang Chiến Giáp', type: 'Áo giáp', rarity: 'Truyền Kỳ', slot: 'áo giáp', icon: '👕', stats: { attack: 110, critRate: 0.10 }, requirement: 'Trúc Cơ Tầng 1', description: 'Bộ giáp phát ra ánh sáng bảy màu, được rèn từ một loại khoáng thạch hiếm thấy.', story: 'Truyền thuyết kể rằng nó được rèn dưới ánh trăng trong 49 ngày.', value: 1500 },
  { id: 'item_leg_02', name: 'Phi Sương Kiếm', type: 'Vũ khí', rarity: 'Truyền Kỳ', slot: 'vũ khí', icon: '🗡️', stats: { defense: 144, magicDefense: 50 }, requirement: 'Trúc Cơ Tầng 2', description: 'Thân kiếm lạnh như băng, khi vung lên tạo ra một lớp sương mỏng.', story: 'Là thanh kiếm của một vị kiếm tiên đã ẩn thế từ lâu.', value: 1550 },
  { id: 'item_leg_03', name: 'Bất Động Minh Vương Giáp', type: 'Áo giáp', rarity: 'Truyền Kỳ', slot: 'áo giáp', icon: '👕', stats: { attack: 130, critRate: 0.10 }, requirement: 'Trúc Cơ Tầng 3', description: 'Bộ giáp nặng, mang lại khả năng phòng ngự gần như tuyệt đối.', story: 'Khi mặc vào, người ta có cảm giác vững chãi như một ngọn núi.', value: 1600 },
  { id: 'item_leg_04', name: 'Truy Hồn Thương', type: 'Vũ khí', rarity: 'Truyền Kỳ', slot: 'vũ khí', icon: '🗡️', stats: { defense: 168, magicDefense: 60 }, requirement: 'Trúc Cơ Tầng 4', description: 'Mũi thương có khả năng khóa chặt linh hồn của đối phương.', story: 'Một khi đã bị nó nhắm đến, không ai có thể thoát khỏi.', value: 1650 },
  { id: 'item_leg_05', name: 'Thiên Cơ Bào', type: 'Áo giáp', rarity: 'Truyền Kỳ', slot: 'áo giáp', icon: '👕', stats: { attack: 150, critRate: 0.10 }, requirement: 'Trúc Cơ Tầng 5', description: 'Chiếc áo bào có thể suy diễn thiên cơ, giúp người mặc né tránh nguy hiểm.', story: 'Trên áo thêu đầy những biểu tượng kỳ lạ, dường như là một loại trận đồ.', value: 1700 },
  { id: 'item_leg_06', name: 'Thất Tinh Kiếm', type: 'Vũ khí', rarity: 'Truyền Kỳ', slot: 'vũ khí', icon: '🗡️', stats: { defense: 192, magicDefense: 70 }, requirement: 'Trúc Cơ Tầng 6', description: 'Thanh kiếm được rèn từ bảy loại thiên thạch, tương ứng với bảy ngôi sao Bắc Đẩu.', story: 'Khi có ánh sao, sức mạnh của nó sẽ được tăng lên bội phần.', value: 1750 },
  { id: 'item_leg_07', name: 'Cửu U Ma Giáp', type: 'Áo giáp', rarity: 'Truyền Kỳ', slot: 'áo giáp', icon: '👕', stats: { attack: 170, critRate: 0.10 }, requirement: 'Trúc Cơ Tầng 7', description: 'Bộ giáp được rèn từ sắt dưới Cửu U, mang ma khí nặng nề.', story: 'Nó có thể hấp thụ oán khí để tự sửa chữa.', value: 1800 },
  { id: 'item_leg_08', name: 'Diệt Thần Cung', type: 'Vũ khí', rarity: 'Truyền Kỳ', slot: 'vũ khí', icon: '🗡️', stats: { defense: 216, magicDefense: 80 }, requirement: 'Trúc Cơ Tầng 8', description: 'Cây cung huyền thoại, nghe đồn có thể bắn hạ cả thần tiên.', story: 'Cần có sức mạnh to lớn mới có thể kéo được dây cung của nó.', value: 1850 },
  { id: 'item_leg_09', name: 'Vạn Tượng Bào', type: 'Áo giáp', rarity: 'Truyền Kỳ', slot: 'áo giáp', icon: '👕', stats: { attack: 190, critRate: 0.10 }, requirement: 'Trúc Cơ Tầng 9', description: 'Chiếc áo bào có thể biến ảo thành mọi hình dạng, giúp ngụy trang hoàn hảo.', story: 'Là bảo vật của một tông môn chuyên về ám sát đã bị diệt vong.', value: 1900 },
  { id: 'item_leg_10', name: 'Tu La Đao', type: 'Vũ khí', rarity: 'Truyền Kỳ', slot: 'vũ khí', icon: '🗡️', stats: { defense: 240, magicDefense: 90 }, requirement: 'Trúc Cơ Tầng 10', description: 'Thanh đao mang sát khí của chiến trường Tu La.', story: 'Càng chém giết nhiều, nó càng trở nên mạnh mẽ.', value: 1950 },
  { id: 'item_leg_11', name: 'Thánh Linh Giáp', type: 'Áo giáp', rarity: 'Truyền Kỳ', slot: 'áo giáp', icon: '👕', stats: { attack: 210, critRate: 0.10 }, requirement: 'Trúc Cơ Tầng 11', description: 'Bộ giáp được ban phước bởi thánh quang, có khả năng chống lại tà ma.', story: 'Là trang bị tiêu chuẩn của các Thánh kỵ sĩ.', value: 2000 },
  { id: 'item_leg_12', name: 'Phán Quan Bút', type: 'Vũ khí', rarity: 'Truyền Kỳ', slot: 'vũ khí', icon: '🗡️', stats: { defense: 264, magicDefense: 100 }, requirement: 'Trúc Cơ Tầng 12', description: 'Cây bút có thể viết ra sinh tử, định đoạt số phận.', story: 'Là một pháp bảo của Minh giới bị lưu lạc đến nhân gian.', value: 2050 },
  { id: 'item_leg_13', name: 'Hư Không Giáp', type: 'Áo giáp', rarity: 'Truyền Kỳ', slot: 'áo giáp', icon: '👕', stats: { attack: 230, critRate: 0.10 }, requirement: 'Trúc Cơ Tầng 13', description: 'Bộ giáp được làm từ vật liệu của hư không, có thể dịch chuyển tức thời trong khoảng cách ngắn.', story: 'Mặc nó vào, cảm giác như không còn trọng lượng.', value: 2100 },
  { id: 'item_leg_14', name: 'Phần Thiên Kích', type: 'Vũ khí', rarity: 'Truyền Kỳ', slot: 'vũ khí', icon: '🗡️', stats: { defense: 288, magicDefense: 110 }, requirement: 'Trúc Cơ Tầng 14', description: 'Ngọn kích chứa đựng sức mạnh có thể đốt cháy cả bầu trời.', story: 'Là vũ khí của một vị chiến thần cổ đại.', value: 2150 },
  { id: 'item_leg_15', name: 'Thái Cực Đạo Bào', type: 'Áo giáp', rarity: 'Truyền Kỳ', slot: 'áo giáp', icon: '👕', stats: { attack: 250, critRate: 0.10 }, requirement: 'Trúc Cơ Tầng 15', description: 'Chiếc áo bào thêu hình Thái Cực, có thể chuyển hóa âm dương.', story: 'Giúp người mặc cân bằng linh lực trong cơ thể, tránh bị tẩu hỏa nhập ma.', value: 2200 },
  { id: 'item_leg_16', name: 'Đả Thần Tiên', type: 'Vũ khí', rarity: 'Truyền Kỳ', slot: 'vũ khí', icon: '🗡️', stats: { defense: 312, magicDefense: 120 }, requirement: 'Trúc Cơ Tầng 16', description: 'Một cây roi có thể đánh vào cả nguyên thần, chuyên khắc chế thần tiên.', story: 'Là pháp bảo nổi tiếng trong cuộc Phong Thần đại chiến.', value: 2250 },
  { id: 'item_leg_17', name: 'Hoàng Kim Giáp', type: 'Áo giáp', rarity: 'Truyền Kỳ', slot: 'áo giáp', icon: '👕', stats: { attack: 270, critRate: 0.10 }, requirement: 'Trúc Cơ Tầng 17', description: 'Bộ giáp được làm hoàn toàn bằng vàng ròng, được gia trì bởi vô số trận pháp.', story: 'Là biểu tượng của quyền lực và sự giàu có.', value: 2300 },
  { id: 'item_leg_18', name: 'Họa Thiên Kích', type: 'Vũ khí', rarity: 'Truyền Kỳ', slot: 'vũ khí', icon: '🗡️', stats: { defense: 336, magicDefense: 130 }, requirement: 'Trúc Cơ Tầng 18', description: 'Vũ khí của Ma Thần Lữ Bố, có sức mạnh kinh thiên động địa.', story: 'Một khi đã xuất kích, trời đất cũng phải biến sắc.', value: 2350 },
  { id: 'item_leg_19', name: 'Lạc Thần Y', type: 'Áo giáp', rarity: 'Truyền Kỳ', slot: 'áo giáp', icon: '👕', stats: { attack: 290, critRate: 0.10 }, requirement: 'Trúc Cơ Tầng 19', description: 'Chiếc áo mỏng như sương, nhẹ như mây, là y phục của tiên nữ Lạc Thần.', story: 'Mặc nó vào, có thể đi trên mặt nước như đất bằng.', value: 2400 },
  { id: 'item_leg_20', name: 'Tru Tiên Kiếm', type: 'Vũ khí', rarity: 'Truyền Kỳ', slot: 'vũ khí', icon: '🗡️', stats: { defense: 360, magicDefense: 140 }, requirement: 'Trúc Cơ Tầng 20', description: 'Một trong Tứ Tiên Kiếm, mang sát khí vô tận, chuyên để giết tiên.', story: 'Là một phần của Tru Tiên Kiếm Trận huyền thoại.', value: 2450 },

  // --- Thần Thoại (Mythical) ---
  { id: 'item_myt_01', name: 'Vòng Càn Khôn', type: 'Pháp bảo', rarity: 'Thần Thoại', slot: 'pháp bảo', icon: '👑', stats: { attack: 220 }, requirement: 'Hợp Thể Tầng 1', description: 'Pháp bảo của Na Tra, có thể biến to thu nhỏ, ném ra với sức mạnh khủng khiếp.', story: 'Nghe nói nó có thể trói buộc cả rồng.', value: 10000 },
  { id: 'item_myt_02', name: 'Cửu Chuyển Hồi Hồn Ngọc', type: 'Pháp bảo', rarity: 'Thần Thoại', slot: 'pháp bảo', icon: '💎', stats: { hp: 600 }, requirement: 'Hợp Thể Tầng 2', description: 'Viên ngọc chứa đựng sinh khí của trời đất, có khả năng cải tử hoàn sinh.', story: 'Chỉ cần còn một hơi thở, nó cũng có thể cứu sống bạn.', value: 11000 },
  { id: 'item_myt_03', name: 'Đông Hoàng Chung', type: 'Pháp bảo', rarity: 'Thần Thoại', slot: 'pháp bảo', icon: '👑', stats: { attack: 260 }, requirement: 'Hợp Thể Tầng 3', description: 'Cổ vật thần thoại, tiếng chuông có thể trấn áp vạn vật, xoay chuyển thời gian.', story: 'Là một trong mười đại thần khí cổ đại.', value: 12000 },
  { id: 'item_myt_04', name: 'Bàn Cổ Phiên', type: 'Pháp bảo', rarity: 'Thần Thoại', slot: 'pháp bảo', icon: '💎', stats: { hp: 700 }, requirement: 'Hợp Thể Tầng 4', description: 'Lá cờ được hóa thành từ rìu của Bàn Cổ, có sức mạnh khai thiên lập địa.', story: 'Một cái phất cờ có thể phá vỡ cả một thế giới nhỏ.', value: 13000 },
  { id: 'item_myt_05', name: 'Hỗn Độn Châu', type: 'Pháp bảo', rarity: 'Thần Thoại', slot: 'pháp bảo', icon: '👑', stats: { attack: 300 }, requirement: 'Hợp Thể Tầng 5', description: 'Viên ngọc được sinh ra từ lúc khai thiên lập địa, chứa đựng sức mạnh hỗn độn.', story: 'Ai có được nó, có thể nắm giữ sức mạnh nguyên thủy nhất.', value: 14000 },
  { id: 'item_myt_06', name: 'Thí Thần Thương', type: 'Pháp bảo', rarity: 'Thần Thoại', slot: 'pháp bảo', icon: '💎', stats: { hp: 800 }, requirement: 'Hợp Thể Tầng 6', description: 'Ngọn thương được rèn từ oán khí của các ma thần, chuyên để giết thần.', story: 'Là vũ khí duy nhất có thể gây tổn thương cho các vị thần bất tử.', value: 15000 },
  { id: 'item_myt_07', name: 'Tạo Hóa Ngọc Điệp', type: 'Pháp bảo', rarity: 'Thần Thoại', slot: 'pháp bảo', icon: '👑', stats: { attack: 340 }, requirement: 'Hợp Thể Tầng 7', description: 'Mảnh ngọc ghi lại ba ngàn đại đạo, ai có thể lĩnh ngộ sẽ thành thánh.', story: 'Là bảo vật tối cao của Đạo giáo.', value: 16000 },
  { id: 'item_myt_08', name: 'Luân Hồi Kính', type: 'Pháp bảo', rarity: 'Thần Thoại', slot: 'pháp bảo', icon: '💎', stats: { hp: 900 }, requirement: 'Hợp Thể Tầng 8', description: 'Chiếc gương có thể soi rọi tiền kiếp, nắm giữ lục đạo luân hồi.', story: 'Nhìn vào nó quá lâu, bạn có thể bị lạc trong vòng luân hồi mãi mãi.', value: 17000 },
  { id: 'item_myt_09', name: 'Hồng Mông Tử Khí', type: 'Pháp bảo', rarity: 'Thần Thoại', slot: 'pháp bảo', icon: '👑', stats: { attack: 380 }, requirement: 'Hợp Thể Tầng 9', description: 'Một luồng khí tím được sinh ra từ lúc vũ trụ hình thành, là nền tảng để thành thánh.', story: 'Thiên đạo có chín luồng, ai có được một luồng sẽ có cơ hội thành thánh.', value: 18000 },
  { id: 'item_myt_10', name: 'Hạo Thiên Tháp', type: 'Pháp bảo', rarity: 'Thần Thoại', slot: 'pháp bảo', icon: '💎', stats: { hp: 1000 }, requirement: 'Hợp Thể Tầng 10', description: 'Ngọn tháp có thể thu thập tinh tú, luyện hóa vạn vật.', story: 'Là nơi ở của Hạo Thiên Thượng Đế, chúa tể của các vị thần.', value: 19000 },
];
// END: Updated Thematic Items

const CULTIVATION_SKILL_BOOKS: Item[] = [
    // Tier 1 - 5%
    { id: 'item_sb_pas_001', name: 'Sách: Tĩnh Tâm Quyết', description: 'Ghi lại công pháp [Tĩnh Tâm Quyết].', rarity: 'Phổ thông', type: 'Sách Kỹ Năng', icon: '📖', skillId: 'skill_pas_001', value: 250 },
    { id: 'item_sb_pas_002', name: 'Sách: Dẫn Khí Nhập Thể', description: 'Ghi lại công pháp [Dẫn Khí Nhập Thể].', rarity: 'Phổ thông', type: 'Sách Kỹ Năng', icon: '📖', skillId: 'skill_pas_002', value: 250 },
    { id: 'item_sb_pas_003', name: 'Sách: Chu Thiên Vận Hành', description: 'Ghi lại công pháp [Chu Thiên Vận Hành].', rarity: 'Quý', type: 'Sách Kỹ Năng', icon: '📖', skillId: 'skill_pas_003', value: 300 },
    { id: 'item_sb_pas_004', name: 'Sách: Thổ Nạp Pháp', description: 'Ghi lại công pháp [Thổ Nạp Pháp].', rarity: 'Quý', type: 'Sách Kỹ Năng', icon: '📖', skillId: 'skill_pas_004', value: 300 },
    // Tier 2 - 25%
    { id: 'item_sb_pas_005', name: 'Sách: Ngưng Thần Thuật', description: 'Ghi lại công pháp [Ngưng Thần Thuật].', rarity: 'Quý', type: 'Sách Kỹ Năng', icon: '📖', skillId: 'skill_pas_005', value: 1200 },
    { id: 'item_sb_pas_006', name: 'Sách: Luyện Hóa Kinh Mạch', description: 'Ghi lại công pháp [Luyện Hóa Kinh Mạch].', rarity: 'Quý', type: 'Sách Kỹ Năng', icon: '📖', skillId: 'skill_pas_006', value: 1200 },
    { id: 'item_sb_pas_007', name: 'Sách: Tụ Linh Tâm Pháp', description: 'Ghi lại công pháp [Tụ Linh Tâm Pháp].', rarity: 'Hiếm', type: 'Sách Kỹ Năng', icon: '📖', skillId: 'skill_pas_007', value: 1500 },
    { id: 'item_sb_pas_008', name: 'Sách: Hấp Tinh Đại Pháp (Sơ Lược)', description: 'Ghi lại công pháp [Hấp Tinh Đại Pháp (Sơ Lược)].', rarity: 'Hiếm', type: 'Sách Kỹ Năng', icon: '📖', skillId: 'skill_pas_008', value: 1500 },
    // Tier 3 - 100%
    { id: 'item_sb_pas_009', name: 'Sách: Hỗn Nguyên Nhất Khí', description: 'Ghi lại công pháp [Hỗn Nguyên Nhất Khí].', rarity: 'Hiếm', type: 'Sách Kỹ Năng', icon: '📖', skillId: 'skill_pas_009', value: 5000 },
    { id: 'item_sb_pas_010', name: 'Sách: Cửu Chuyển Kim Đan', description: 'Ghi lại công pháp [Cửu Chuyển Kim Đan].', rarity: 'Hiếm', type: 'Sách Kỹ Năng', icon: '📖', skillId: 'skill_pas_010', value: 5000 },
    { id: 'item_sb_pas_011', name: 'Sách: Bắc Minh Thần Công (Bản Rách)', description: 'Ghi lại công pháp [Bắc Minh Thần Công (Bản Rách)].', rarity: 'Truyền Kỳ', type: 'Sách Kỹ Năng', icon: '📜', skillId: 'skill_pas_011', value: 7500 },
    { id: 'item_sb_pas_012', name: 'Sách: Thái Ất Chân Kinh', description: 'Ghi lại công pháp [Thái Ất Chân Kinh].', rarity: 'Truyền Kỳ', type: 'Sách Kỹ Năng', icon: '📜', skillId: 'skill_pas_012', value: 7500 },
    // Tier 4 - 250%
    { id: 'item_sb_pas_013', name: 'Sách: Thôn Thiên Ma Công', description: 'Ghi lại công pháp [Thôn Thiên Ma Công].', rarity: 'Truyền Kỳ', type: 'Sách Kỹ Năng', icon: '📜', skillId: 'skill_pas_013', value: 20000 },
    { id: 'item_sb_pas_014', name: 'Sách: Thánh Tâm Quyết', description: 'Ghi lại công pháp [Thánh Tâm Quyết].', rarity: 'Truyền Kỳ', type: 'Sách Kỹ Năng', icon: '📜', skillId: 'skill_pas_014', value: 20000 },
    { id: 'item_sb_pas_015', name: 'Sách: Tinh Thần Luyện Thể', description: 'Ghi lại công pháp [Tinh Thần Luyện Thể].', rarity: 'Truyền Kỳ', type: 'Sách Kỹ Năng', icon: '📜', skillId: 'skill_pas_015', value: 22000 },
    { id: 'item_sb_pas_016', name: 'Sách: Vạn Cổ Bất Diệt Thể', description: 'Ghi lại công pháp [Vạn Cổ Bất Diệt Thể].', rarity: 'Truyền Kỳ', type: 'Sách Kỹ Năng', icon: '📜', skillId: 'skill_pas_016', value: 22000 },
    // Tier 5 - 500%
    { id: 'item_sb_pas_017', name: 'Sách: Thái Cực Vô Lượng', description: 'Ghi lại công pháp [Thái Cực Vô Lượng].', rarity: 'Thần Thoại', type: 'Sách Kỹ Năng', icon: '📜', skillId: 'skill_pas_017', value: 100000 },
    { id: 'item_sb_pas_018', name: 'Sách: Hồng Mông Tạo Hóa Quyết', description: 'Ghi lại công pháp [Hồng Mông Tạo Hóa Quyết].', rarity: 'Thần Thoại', type: 'Sách Kỹ Năng', icon: '📜', skillId: 'skill_pas_018', value: 100000 },
    { id: 'item_sb_pas_019', name: 'Sách: Vũ Trụ Tinh Hấp', description: 'Ghi lại công pháp [Vũ Trụ Tinh Hấp].', rarity: 'Thần Thoại', type: 'Sách Kỹ Năng', icon: '📜', skillId: 'skill_pas_019', value: 120000 },
    { id: 'item_sb_pas_020', name: 'Sách: Đại Đạo Quy Nhất', description: 'Ghi lại công pháp [Đại Đạo Quy Nhất].', rarity: 'Thần Thoại', type: 'Sách Kỹ Năng', icon: '📜', skillId: 'skill_pas_020', value: 120000 },
];

// Exporting to make this a module
export const ITEM_LIST: Item[] = [
  { id: 'item_001', name: 'Kiếm Sắt Tân Thủ', description: 'Một thanh kiếm sắt thông thường, được cấp cho người mới bắt đầu.', rarity: 'Phổ thông', type: 'Vũ khí', icon: '🗡️', slot: 'vũ khí', stats: { attack: 5 }, story: 'Hành trình vạn dặm bắt đầu từ một bước chân, và một thanh kiếm cùn.', value: 10 },
  { id: 'item_002', name: 'Áo Vải Làng Chài', description: 'Áo giáp vải thô, sờn cũ nhưng bền chắc.', rarity: 'Phổ thông', type: 'Áo giáp', icon: '👕', slot: 'áo giáp', stats: { defense: 3 }, story: 'Mang theo mùi của biển cả và những chuyến ra khơi vất vả.', value: 8 },
  { id: 'item_003', name: 'Phù Bình An', description: 'Lá bùa đơn giản giúp bảo vệ, được vẽ bởi một đạo sĩ lang thang.', rarity: 'Quý', type: 'Pháp bảo', icon: '📜', slot: 'pháp bảo', stats: { magicDefense: 5, hp: 10 }, story: 'Một chút an tâm cho những chuyến đi xa.', value: 50 },
  { id: 'item_004', name: 'Hồi Lực Đan', description: 'Hồi phục 50 HP.', rarity: 'Phổ thông', type: 'Tiêu hao', icon: '💊', effect: 'Hồi 50 HP', restores: { hp: 50 }, value: 20 },
  { id: 'item_005', name: 'Da Sói', description: 'Nguyên liệu từ Dã Lang.', rarity: 'Phổ thông', type: 'Nguyên liệu', icon: '🐺', value: 5 },
  { id: 'item_006', name: 'Luyện Khí Tán', description: 'Tăng 100 Linh Lực.', rarity: 'Quý', type: 'Tiêu hao', icon: '✨', expGain: 100, value: 100 },
  { id: 'item_007', name: 'Mật Gấu', description: 'Nguyên liệu từ Hắc Hùng.', rarity: 'Quý', type: 'Nguyên liệu', icon: '🐻', value: 25 },
  { id: 'item_008', name: 'Sơ Cấp Kiếm Quyết', description: 'Học được kỹ năng [Trảm Kích].', rarity: 'Quý', type: 'Sách Kỹ Năng', icon: '📖', skillId: 'skill_002', value: 200 },
  { id: 'item_009', name: 'Huyền Thiết Trọng Kiếm', description: 'Kiếm làm từ sắt hiếm, nặng và đầy uy lực.', rarity: 'Hiếm', type: 'Vũ khí', icon: '🗡️', slot: 'vũ khí', stats: { attack: 15, critRate: 0.05 }, requirement: 'Kiếm Tu', story: 'Chỉ những người có sức mạnh hơn người mới có thể sử dụng nó.', value: 300 },
  { id: 'item_010', name: 'Vô Cực Thần Kiếm', description: 'Thần kiếm chứa đựng sức mạnh vô tận, có thể chém rách cả hư không.', rarity: 'Thần Thoại', type: 'Vũ khí', icon: '⚔️', slot: 'vũ khí', stats: { attack: 100, critRate: 0.2, critDamage: 3.0 }, story: 'Tương truyền, nó được rèn từ một mảnh vỡ của vũ trụ thuở sơ khai.', value: 99999 },
  { id: 'item_011', name: 'Thần Thoại Kiếm Quyết', description: 'Học được kỹ năng tối thượng [Vạn Kiếm Quy Tông].', rarity: 'Thần Thoại', type: 'Sách Kỹ Năng', icon: '📜', skillId: 'skill_003', value: 99999 },
  { id: 'item_012', name: 'Lân Phiến Xà Yêu', description: 'Vảy rắn cứng cáp từ Xà Yêu.', rarity: 'Quý', type: 'Nguyên liệu', icon: '🐍', value: 30 },
  { id: 'item_013', name: 'Nội Đan Huyết Dơi', description: 'Nội đan chứa đựng tinh hoa của Dơi Máu.', rarity: 'Hiếm', type: 'Nguyên liệu', icon: '🦇', value: 75 },
  { id: 'item_014', name: 'Linh Hồn Thạch', description: 'Đá chứa đựng tàn hồn, có thể dùng để luyện khí.', rarity: 'Hiếm', type: 'Nguyên liệu', icon: '💎', value: 100 },
  { id: 'item_015', name: 'Thuẫn Xương Yêu Thú', description: 'Một tấm khiên làm từ xương của một yêu thú không rõ tên.', rarity: 'Quý', type: 'Pháp bảo', icon: '🛡️', slot: 'pháp bảo', stats: { defense: 10, hp: 20 }, story: 'Những vết khắc trên khiên không phải là hoa văn, mà là dấu vết của một trận chiến.', value: 150 },
  { id: 'item_016', name: 'Búa Rèn Của Trương Sư Phụ', description: 'Cây búa của thợ rèn giỏi nhất Thành Vân Lâm.', rarity: 'Quý', type: 'Vũ khí', icon: '🔨', slot: 'vũ khí', stats: { attack: 10, defense: 2 }, story: 'Nó đã tạo ra hàng ngàn vũ khí, từ bình thường đến quý hiếm.', value: 120 },
  { id: 'item_017', name: 'Trượng Gỗ Hồi Xuân', description: 'Pháp trượng được làm từ cành của cây cổ thụ ngàn năm, chứa đựng sinh khí dồi dào.', rarity: 'Hiếm', type: 'Pháp bảo', icon: '🌿', slot: 'pháp bảo', stats: { magicAttack: 15, hp: 50 }, story: 'Nơi nào nó đi qua, cây cối đều đâm chồi nảy lộc.', value: 350 },
  { id: 'item_018', name: 'Lệnh Bài Trưởng Thôn', description: 'Vật tượng trưng cho quyền lực của trưởng thôn, được chạm khắc tinh xảo.', rarity: 'Quý', type: 'Pháp bảo', icon: '🏵️', slot: 'pháp bảo', stats: { magicDefense: 10, hp: 30 }, story: 'Nó đã được truyền qua nhiều thế hệ trưởng thôn của Thôn Thanh Thủy.', value: 200 },
  { id: 'item_019', name: 'Hồi Linh Tán', description: 'Hồi phục 30 MP.', rarity: 'Phổ thông', type: 'Tiêu hao', icon: '💧', effect: 'Hồi 30 MP', restores: { mp: 30 }, value: 30 },
  ...THEMATIC_ITEMS,
  ...CULTIVATION_SKILL_BOOKS,
];

export const SKILLS: Skill[] = [
    { id: 'skill_001', name: 'Dưỡng Sinh Quyết', description: 'Công pháp nhập môn, giúp tăng nhẹ thể chất.', origin: 'Tân thủ', type: 'Bị Động', passiveBonus: { hp: 20, cultivationSpeedBonus: 0.05 } },
    { id: 'skill_002', name: 'Trảm Kích', description: 'Vung kiếm chém mạnh vào kẻ địch.', origin: 'Sơ Cấp Kiếm Quyết', type: 'Chủ Động', damage: 10, mpCost: 5, visualEffect: 'slash', soundEffectUrl: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABgAZGF0YQAAAAA=' },
    { id: 'skill_003', name: 'Vạn Kiếm Quy Tông', description: 'Triệu hồi vạn kiếm tấn công kẻ địch, sức mạnh kinh thiên động địa.', origin: 'Thần Thoại Kiếm Quyết', type: 'Chủ Động', damage: 150, mpCost: 50, visualEffect: 'slash', soundEffectUrl: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABgAZGF0YQAAAAA=' },
    { id: 'skill_004', name: 'Linh Khí Trị Liệu', description: 'Hồi phục một lượng nhỏ HP cho mục tiêu.', origin: 'Đồng Hành', type: 'Chủ Động', heal: 30, mpCost: 10, visualEffect: 'heal', soundEffectUrl: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABgAZGF0YQAAAAA=' },
    { id: 'skill_005', name: 'Ảnh Sát', description: 'Hóa thành bóng tối, tấn công kẻ địch từ phía sau, gây sát thương chí mạng.', origin: 'Bí Tịch Ảnh Thuật', type: 'Chủ Động', damage: 100, mpCost: 40, visualEffect: 'slash', soundEffectUrl: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABgAZGF0YQAAAAA=' },
    // Monster skills
    { id: 'mskill_001', name: 'Phun Độc', description: 'Phun nọc độc về phía đối thủ.', origin: 'Yêu Thú', type: 'Chủ Động', damage: 15, mpCost: 0 },
    { id: 'mskill_002', name: 'Lôi Kích', description: 'Triệu hồi một tia sét đánh vào mục tiêu.', origin: 'Yêu Thú', type: 'Chủ Động', damage: 40, mpCost: 0 },
    { id: 'mskill_003', name: 'Hóa Cứng', description: 'Làm cứng lớp da bên ngoài, tăng mạnh phòng ngự.', origin: 'Yêu Thú', type: 'Chủ Động', passiveBonus: { defense: 20 }, mpCost: 0 },
    { id: 'mskill_004', name: 'Cắn Xé', description: 'Sử dụng bộ hàm khỏe mạnh để cắn xé đối thủ.', origin: 'Yêu Thú', type: 'Chủ Động', damage: 25, mpCost: 0 },
    { id: 'mskill_005', name: 'Gầm Thét', description: 'Tiếng gầm uy hiếp làm tăng sức tấn công.', origin: 'Yêu Thú', type: 'Chủ Động', passiveBonus: { attack: 10 }, mpCost: 0 },
    { id: 'mskill_006', name: 'Hút Máu', description: 'Cắn vào đối thủ và hút máu để hồi phục.', origin: 'Yêu Thú', type: 'Chủ Động', damage: 20, mpCost: 0 },
    // New Cultivation Passive Skills
    { id: 'skill_pas_001', name: 'Tĩnh Tâm Quyết', description: 'Công pháp giúp tâm trí bình lặng, dễ dàng nhập định, tăng nhẹ tốc độ tu luyện.', origin: 'Bí tịch phổ thông', type: 'Bị Động', passiveBonus: { cultivationSpeedBonus: 0.05 } },
    { id: 'skill_pas_002', name: 'Dẫn Khí Nhập Thể', description: 'Kỹ thuật cơ bản để dẫn dắt linh khí vào cơ thể hiệu quả hơn.', origin: 'Bí tịch phổ thông', type: 'Bị Động', passiveBonus: { cultivationSpeedBonus: 0.10 } },
    { id: 'skill_pas_003', name: 'Chu Thiên Vận Hành', description: 'Phương pháp vận hành linh khí theo một chu thiên nhỏ, giúp hấp thụ linh khí ổn định.', origin: 'Bí tịch phổ thông', type: 'Bị Động', passiveBonus: { cultivationSpeedBonus: 0.15 } },
    { id: 'skill_pas_004', name: 'Thổ Nạp Pháp', description: 'Học cách hít thở đặc biệt để hấp thụ linh khí trong không khí.', origin: 'Bí tịch phổ thông', type: 'Bị Động', passiveBonus: { cultivationSpeedBonus: 0.20 } },
    { id: 'skill_pas_005', name: 'Ngưng Thần Thuật', description: 'Tập trung tinh thần cao độ, đẩy nhanh quá trình chuyển hóa linh khí.', origin: 'Bí tịch quý hiếm', type: 'Bị Động', passiveBonus: { cultivationSpeedBonus: 0.25 } },
    { id: 'skill_pas_006', name: 'Luyện Hóa Kinh Mạch', description: 'Công pháp rèn luyện kinh mạch, giúp chúng chứa được nhiều linh khí hơn và vận chuyển nhanh hơn.', origin: 'Bí tịch quý hiếm', type: 'Bị Động', passiveBonus: { cultivationSpeedBonus: 0.30 } },
    { id: 'skill_pas_007', name: 'Tụ Linh Tâm Pháp', description: 'Tạo ra một vòng xoáy linh khí nhỏ xung quanh cơ thể, tăng tốc độ hấp thụ.', origin: 'Bí tịch quý hiếm', type: 'Bị Động', passiveBonus: { cultivationSpeedBonus: 0.35 } },
    { id: 'skill_pas_008', name: 'Hấp Tinh Đại Pháp (Sơ Lược)', description: 'Bản sơ lược của một ma công, có thể hấp thụ linh khí từ cây cỏ xung quanh.', origin: 'Ma đạo bí pháp', type: 'Bị Động', passiveBonus: { cultivationSpeedBonus: 0.40 } },
    { id: 'skill_pas_009', name: 'Hỗn Nguyên Nhất Khí', description: 'Hợp nhất tinh-khí-thần, khiến cho việc tu luyện trở nên thông suốt, tốc độ tăng vọt.', origin: 'Thượng cổ công pháp', type: 'Bị Động', passiveBonus: { cultivationSpeedBonus: 0.50 } },
    { id: 'skill_pas_010', name: 'Cửu Chuyển Kim Đan', description: 'Mô phỏng quá trình luyện đan trong cơ thể, tinh luyện linh khí cực nhanh.', origin: 'Đan kinh bí truyền', type: 'Bị Động', passiveBonus: { cultivationSpeedBonus: 0.60 } },
    { id: 'skill_pas_011', name: 'Bắc Minh Thần Công (Bản Rách)', description: 'Một phần của công pháp thượng cổ, có thể cướp đoạt linh khí từ vạn vật.', origin: 'Thượng cổ công pháp', type: 'Bị Động', passiveBonus: { cultivationSpeedBonus: 0.70 } },
    { id: 'skill_pas_012', name: 'Thái Ất Chân Kinh', description: 'Chân kinh của đạo gia, giúp lĩnh ngộ bản chất linh khí, hấp thụ như cá gặp nước.', origin: 'Đạo gia chân kinh', type: 'Bị Động', passiveBonus: { cultivationSpeedBonus: 0.90 } },
    { id: 'skill_pas_013', name: 'Thôn Thiên Ma Công', description: 'Ma công bá đạo có thể nuốt chửng linh khí trong một vùng rộng lớn.', origin: 'Thái cổ ma công', type: 'Bị Động', passiveBonus: { cultivationSpeedBonus: 1.0 } },
    { id: 'skill_pas_014', name: 'Thánh Tâm Quyết', description: 'Công pháp của tiên gia, khiến tâm hồn hòa hợp với thiên địa, được thiên địa ưu ái rót linh khí vào.', origin: 'Tiên gia di thư', type: 'Bị Động', passiveBonus: { cultivationSpeedBonus: 2.0 } },
    { id: 'skill_pas_015', name: 'Tinh Thần Luyện Thể', description: 'Dùng tinh tú trên trời để rèn luyện cơ thể, mỗi đêm tu luyện bằng người khác cả tháng.', origin: 'Thượng cổ công pháp', type: 'Bị Động', passiveBonus: { cultivationSpeedBonus: 2.25 } },
    { id: 'skill_pas_016', name: 'Vạn Cổ Bất Diệt Thể', description: 'Tu luyện thân thể thành một lò luyện linh khí, tự động hấp thụ và tinh luyện không ngừng.', origin: 'Thượng cổ công pháp', type: 'Bị Động', passiveBonus: { cultivationSpeedBonus: 2.5 } },
    { id: 'skill_pas_017', name: 'Thái Cực Vô Lượng', description: 'Lĩnh ngộ thái cực, chuyển hóa âm dương, hấp thụ linh khí của cả cõi âm và cõi dương.', origin: 'Đại đạo pháp tắc', type: 'Bị Động', passiveBonus: { cultivationSpeedBonus: 3.0 } },
    { id: 'skill_pas_018', name: 'Hồng Mông Tạo Hóa Quyết', description: 'Công pháp khai thiên lập địa, có thể trực tiếp hấp thụ hồng mông tử khí để tu luyện.', origin: 'Đại đạo pháp tắc', type: 'Bị Động', passiveBonus: { cultivationSpeedBonus: 3.5 } },
    { id: 'skill_pas_019', name: 'Vũ Trụ Tinh Hấp', description: 'Hòa làm một với vũ trụ, lấy vạn vật tinh tú làm nguồn năng lượng.', origin: 'Đại đạo pháp tắc', type: 'Bị Động', passiveBonus: { cultivationSpeedBonus: 4.0 } },
    { id: 'skill_pas_020', name: 'Đại Đạo Quy Nhất', description: 'Trở thành một phần của đại đạo, tu luyện chính là hít thở, mỗi giây mỗi phút đều là đang đột phá.', origin: 'Đại đạo pháp tắc', type: 'Bị Động', passiveBonus: { cultivationSpeedBonus: 4.5 } },
];

export const COMPANION_LIST: Companion[] = [
  {
    id: 'companion_001',
    name: 'Tiểu Tinh Linh',
    description: 'Một tinh linh nhỏ bé, tinh nghịch được sinh ra từ linh khí của trời đất.',
    avatarUrl: 'https://api.multiavatar.com/Tinh%20Linh.png',
    level: 1,
    exp: 0,
    expToNextLevel: 50,
    hp: 60,
    maxHp: 60,
    mp: 40,
    maxMp: 40,
    baseStats: { attack: 3, magicAttack: 10, defense: 4, magicDefense: 8, critRate: 0.05, critDamage: 1.5, accuracy: 1, evasion: 0.1, speed: 11, armorPen: 0, blockRate: 0, mentalDemonResistance: 0.1 },
    totalStats: { attack: 3, magicAttack: 10, defense: 4, magicDefense: 8, critRate: 0.05, critDamage: 1.5, accuracy: 1, evasion: 0.1, speed: 11, armorPen: 0, blockRate: 0, mentalDemonResistance: 0.1 },
    skills: [SKILLS.find(s => s.id === 'skill_004')!],
    equippedItems: {},
  }
];

export const TRAN_PHAP_LIST: TranPhap[] = [
    { id: 'tp_001', name: 'Tụ Linh Trận', description: 'Trận pháp sơ cấp giúp hội tụ linh khí, tăng tốc độ tu luyện.', cultivationBonus: 0.1 },
    { id: 'tp_002', name: 'Kim Quang Trận', description: 'Trận pháp chiến đấu cơ bản, tăng nhẹ sức tấn công.', cultivationBonus: 0, combatBonus: { attack: 5 } },
];

const NEW_BOSSES: Monster[] = [
  // Phàm Giới
  { id: 'boss_thanh_thuy', name: 'Chuột Tinh Biến Dị', hp: 250, stats: { attack: 25, defense: 15, speed: 15, magicAttack: 0, magicDefense: 10, critRate: 0.1, critDamage: 1.6, accuracy: 1.0, evasion: 0.1, armorPen: 0.1, blockRate: 0.1, mentalDemonResistance: 0 }, rewards: { characterExp: 200, cultivationExp: 125, linhThach: 75, items: [{ itemId: 'item_com_05', chance: 1 }, { itemId: 'item_rar_01', chance: 0.1 }] } },
  { id: 'boss_me_anh', name: 'Hổ Vương Mê Ảnh', hp: 1200, stats: { attack: 80, defense: 40, speed: 20, magicAttack: 0, magicDefense: 30, critRate: 0.15, critDamage: 1.8, accuracy: 1.0, evasion: 0.2, armorPen: 0.2, blockRate: 0.15, mentalDemonResistance: 0.1 }, skills: [SKILLS.find(s => s.id === 'mskill_005')!], rewards: { characterExp: 600, cultivationExp: 375, linhThach: 225, items: [{ itemId: 'item_com_17', chance: 1 }, { itemId: 'item_rar_05', chance: 0.2 }] } },
  { id: 'boss_hang_da', name: 'Vua Dơi Hút Máu', hp: 2000, stats: { attack: 60, defense: 30, speed: 30, magicAttack: 0, magicDefense: 20, critRate: 0.2, critDamage: 1.6, accuracy: 0.9, evasion: 0.3, armorPen: 0.15, blockRate: 0, mentalDemonResistance: 0.1 }, skills: [SKILLS.find(s => s.id === 'mskill_006')!, SKILLS.find(s => s.id === 'mskill_004')!], rewards: { characterExp: 800, cultivationExp: 500, linhThach: 300, items: [{ itemId: 'item_013', chance: 1 }, { itemId: 'item_epi_01', chance: 0.1 }] } },
  // Tu Chân Giới
  { id: 'boss_thanh_van', name: 'Hộ Sơn Kỳ Lân', hp: 20000, stats: { attack: 1200, defense: 1500, speed: 25, magicAttack: 1000, magicDefense: 1200, critRate: 0.1, critDamage: 2.0, accuracy: 1.0, evasion: 0.1, armorPen: 0.2, blockRate: 0.3, mentalDemonResistance: 0.3 }, rewards: { characterExp: 2000, cultivationExp: 1250, linhThach: 750, items: [{ itemId: 'item_epi_05', chance: 1 }, { itemId: 'item_leg_01', chance: 0.1 }] } },
  { id: 'boss_van_yeu_son', name: 'Vạn Yêu Vương', hp: 100000, stats: { attack: 4000, defense: 3000, speed: 40, magicAttack: 0, magicDefense: 2500, critRate: 0.25, critDamage: 2.0, accuracy: 1.1, evasion: 0.2, armorPen: 0.3, blockRate: 0.2, mentalDemonResistance: 0.2 }, skills: [SKILLS.find(s => s.id === 'mskill_004')!, SKILLS.find(s => s.id === 'mskill_005')!], rewards: { characterExp: 5000, cultivationExp: 3125, linhThach: 1875, items: [{ itemId: 'item_epi_10', chance: 1 }, { itemId: 'item_leg_05', chance: 0.15 }] } },
  { id: 'boss_linh_tri', name: 'Thủy Mẫu Thánh Nữ', hp: 250000, stats: { attack: 6000, defense: 4500, speed: 35, magicAttack: 8000, magicDefense: 6000, critRate: 0.2, critDamage: 2.0, accuracy: 1.1, evasion: 0.25, armorPen: 0.2, blockRate: 0.1, mentalDemonResistance: 0.5 }, rewards: { characterExp: 10000, cultivationExp: 6250, linhThach: 3750, items: [{ itemId: 'item_epi_15', chance: 1 }, { itemId: 'item_leg_10', chance: 0.2 }] } },
  { id: 'boss_ma_vuc', name: 'Ma Soái Hắc Ám', hp: 800000, stats: { attack: 15000, defense: 10000, speed: 50, magicAttack: 12000, magicDefense: 8000, critRate: 0.3, critDamage: 2.2, accuracy: 1.2, evasion: 0.2, armorPen: 0.4, blockRate: 0.2, mentalDemonResistance: 0.4 }, skills: [SKILLS.find(s => s.id === 'mskill_002')!, SKILLS.find(s => s.id === 'mskill_006')!], rewards: { characterExp: 25000, cultivationExp: 15625, linhThach: 9375, items: [{ itemId: 'item_leg_15', chance: 1 }, { itemId: 'item_myt_01', chance: 0.1 }] } },
  { id: 'boss_ban_co', name: 'Cự Thần Bàn Cổ Tàn Hồn', hp: 2500000, stats: { attack: 30000, defense: 25000, speed: 20, magicAttack: 30000, magicDefense: 25000, critRate: 0.2, critDamage: 2.5, accuracy: 1.5, evasion: 0.1, armorPen: 0.5, blockRate: 0.5, mentalDemonResistance: 0.7 }, rewards: { characterExp: 50000, cultivationExp: 31250, linhThach: 18750, items: [{ itemId: 'item_leg_20', chance: 1 }, { itemId: 'item_myt_05', chance: 0.15 }] } },
];


export const MONSTERS: Monster[] = [
  // Phàm Giới - Luyện Khí
  { id: 'monster_c1', name: 'Cọc gỗ', hp: 30, stats: { attack: 1, defense: 5, speed: 1, magicAttack: 0, magicDefense: 0, critRate: 0, critDamage: 1.5, accuracy: 1.0, evasion: 0, armorPen: 0, blockRate: 0, mentalDemonResistance: 0 }, rewards: { characterExp: 5, cultivationExp: 2, linhThach: 1, items: [] } },
  { id: 'monster_c2', name: 'Chuột Đói', hp: 60, stats: { attack: 8, defense: 5, speed: 15, magicAttack: 0, magicDefense: 2, critRate: 0.05, critDamage: 1.5, accuracy: 0.9, evasion: 0.1, armorPen: 0, blockRate: 0, mentalDemonResistance: 0 }, rewards: { characterExp: 16, cultivationExp: 10, linhThach: 6, items: [{ itemId: 'item_005', chance: 0.1 }, { itemId: 'item_com_01', chance: 0.1 }, { itemId: 'item_com_02', chance: 0.1 }] } },
  { id: 'monster_c5', name: 'Chó Hoang', hp: 150, stats: { attack: 15, defense: 10, speed: 12, magicAttack: 0, magicDefense: 8, critRate: 0.05, critDamage: 1.5, accuracy: 0.9, evasion: 0.1, armorPen: 0, blockRate: 0.05, mentalDemonResistance: 0 }, rewards: { characterExp: 40, cultivationExp: 25, linhThach: 15, items: [{ itemId: 'item_005', chance: 0.6 }, { itemId: 'item_com_03', chance: 0.15 }, { itemId: 'item_com_04', chance: 0.15 }, { itemId: 'item_com_05', chance: 0.1 }] } },
  { id: 'monster_c10', name: 'Nhện Độc', hp: 400, stats: { attack: 35, defense: 15, speed: 14, magicAttack: 20, magicDefense: 15, critRate: 0.1, critDamage: 1.6, accuracy: 0.9, evasion: 0.1, armorPen: 0, blockRate: 0, mentalDemonResistance: 0.1 }, skills: [SKILLS.find(s => s.id === 'mskill_001')!], rewards: { characterExp: 80, cultivationExp: 50, linhThach: 30, items: [{ itemId: 'item_007', chance: 0.1 }, { itemId: 'item_com_10', chance: 0.2 }, { itemId: 'item_com_11', chance: 0.2 }, { itemId: 'item_epi_01', chance: 0.02 }] } },
  { id: 'monster_c15', name: 'Hổ Vằn Lửa Rừng', hp: 750, stats: { attack: 50, defense: 30, speed: 18, magicAttack: 0, magicDefense: 25, critRate: 0.1, critDamage: 1.7, accuracy: 0.9, evasion: 0.15, armorPen: 0.1, blockRate: 0.1, mentalDemonResistance: 0 }, rewards: { characterExp: 120, cultivationExp: 75, linhThach: 45, items: [{ itemId: 'item_012', chance: 0.1 }, { itemId: 'item_com_15', chance: 0.25 }, { itemId: 'item_com_16', chance: 0.25 }, { itemId: 'item_rar_01', chance: 0.05 }, { itemId: 'item_epi_02', chance: 0.03 }] } },
  { id: 'monster_c18', name: 'Dơi Máu', hp: 500, stats: { attack: 40, defense: 20, speed: 25, magicAttack: 0, magicDefense: 15, critRate: 0.15, critDamage: 1.5, accuracy: 0.85, evasion: 0.25, armorPen: 0.1, blockRate: 0, mentalDemonResistance: 0 }, skills: [SKILLS.find(s => s.id === 'mskill_006')!], rewards: { characterExp: 144, cultivationExp: 90, linhThach: 54, items: [{ itemId: 'item_013', chance: 0.2 }, { itemId: 'item_com_18', chance: 0.2 }, { itemId: 'item_rar_02', chance: 0.08 }, { itemId: 'item_rar_03', chance: 0.08 }, { itemId: 'item_epi_03', chance: 0.05 }] } },
  { id: 'monster_c20', name: 'Linh Thạch Nhân', hp: 1200, stats: { attack: 30, defense: 80, speed: 5, magicAttack: 0, magicDefense: 60, critRate: 0.05, critDamage: 1.5, accuracy: 0.9, evasion: 0.0, armorPen: 0, blockRate: 0.4, mentalDemonResistance: 0.3 }, skills: [SKILLS.find(s => s.id === 'mskill_003')!], rewards: { characterExp: 160, cultivationExp: 100, linhThach: 60, items: [{ itemId: 'item_014', chance: 0.2 }, { itemId: 'item_com_20', chance: 0.25 }, { itemId: 'item_rar_05', chance: 0.1 }, { itemId: 'item_epi_05', chance: 0.06 }] } },
  
  // Tu Chân Giới - Trúc Cơ
  { id: 'monster_c40', name: 'Hồ Linh', hp: 15000, stats: { attack: 800, defense: 500, speed: 22, magicAttack: 700, magicDefense: 600, critRate: 0.15, critDamage: 1.8, accuracy: 0.95, evasion: 0.2, armorPen: 0.1, blockRate: 0.1, mentalDemonResistance: 0.2 }, rewards: { characterExp: 320, cultivationExp: 200, linhThach: 120, items: [{ itemId: 'item_015', chance: 0.1 }, { itemId: 'item_rar_15', chance: 0.15 }, { itemId: 'item_epi_10', chance: 0.1 }, { itemId: 'item_leg_01', chance: 0.02 }] } },
  // Tu Chân Giới - Kim Đan
  { id: 'monster_c45', name: 'Lang Vương', hp: 80000, stats: { attack: 3500, defense: 2500, speed: 30, magicAttack: 0, magicDefense: 2000, critRate: 0.2, critDamage: 1.8, accuracy: 0.9, evasion: 0.15, armorPen: 0.2, blockRate: 0.1, mentalDemonResistance: 0 }, skills: [SKILLS.find(s => s.id === 'mskill_004')!, SKILLS.find(s => s.id === 'mskill_005')!], rewards: { characterExp: 360, cultivationExp: 225, linhThach: 135, items: [{ itemId: 'item_005', chance: 0.8 }, { itemId: 'item_rar_18', chance: 0.15 }, { itemId: 'item_epi_12', chance: 0.1 }, { itemId: 'item_leg_02', chance: 0.02 }] } },
  { id: 'monster_c50', name: 'Thủy Xà', hp: 100000, stats: { attack: 4000, defense: 3000, speed: 25, magicAttack: 3500, magicDefense: 3200, critRate: 0.1, critDamage: 1.7, accuracy: 0.9, evasion: 0.15, armorPen: 0, blockRate: 0.1, mentalDemonResistance: 0.2 }, rewards: { characterExp: 400, cultivationExp: 250, linhThach: 150, items: [{ itemId: 'item_012', chance: 0.7 }, { itemId: 'item_rar_20', chance: 0.15 }, { itemId: 'item_epi_15', chance: 0.1 }, { itemId: 'item_leg_05', chance: 0.03 }] } },
  // Tu Chân Giới - Nguyên Anh
  { id: 'monster_c55', name: 'Tinh Linh Thủy Nữ', hp: 200000, stats: { attack: 6500, defense: 4000, speed: 28, magicAttack: 7500, magicDefense: 5500, critRate: 0.15, critDamage: 1.8, accuracy: 0.95, evasion: 0.2, armorPen: 0, blockRate: 0, mentalDemonResistance: 0.4 }, rewards: { characterExp: 440, cultivationExp: 275, linhThach: 165, items: [{ itemId: 'item_017', chance: 0.1 }, { itemId: 'item_epi_18', chance: 0.12 }, { itemId: 'item_leg_06', chance: 0.04 }, { itemId: 'item_leg_07', chance: 0.04 }] } },
  // Tu Chân Giới - Hóa Thần
  { id: 'monster_c90', name: 'Lôi Điểu', hp: 750000, stats: { attack: 12000, defense: 8000, speed: 40, magicAttack: 15000, magicDefense: 10000, critRate: 0.2, critDamage: 1.9, accuracy: 0.9, evasion: 0.25, armorPen: 0.2, blockRate: 0, mentalDemonResistance: 0.3 }, skills: [SKILLS.find(s => s.id === 'mskill_002')!], rewards: { characterExp: 720, cultivationExp: 450, linhThach: 270, items: [{ itemId: 'item_009', chance: 0.1 }, { itemId: 'item_epi_20', chance: 0.15 }, { itemId: 'item_leg_10', chance: 0.05 }, { itemId: 'item_leg_11', chance: 0.05 }] } },
  // Tu Chân Giới - Luyện Hư
  { id: 'monster_c100', name: 'Lôi Linh Nhân', hp: 2000000, stats: { attack: 28000, defense: 22000, speed: 20, magicAttack: 28000, magicDefense: 22000, critRate: 0.15, critDamage: 2.0, accuracy: 0.95, evasion: 0.1, armorPen: 0.2, blockRate: 0.2, mentalDemonResistance: 0.5 }, rewards: { characterExp: 800, cultivationExp: 500, linhThach: 300, items: [{ itemId: 'item_011', chance: 0.01 }, { itemId: 'item_leg_12', chance: 0.08 }, { itemId: 'item_leg_13', chance: 0.08 }] } },
  // Tiên Giới - Hợp Thể
  { id: 'monster_c110', name: 'Cự Mộc Hộ Vệ', hp: 5000000, stats: { attack: 50000, defense: 80000, speed: 10, magicAttack: 40000, magicDefense: 70000, critRate: 0.1, critDamage: 1.8, accuracy: 0.9, evasion: 0.05, armorPen: 0.1, blockRate: 0.5, mentalDemonResistance: 0.4 }, rewards: { characterExp: 880, cultivationExp: 550, linhThach: 330, items: [{ itemId: 'item_016', chance: 0.1 }, { itemId: 'item_leg_15', chance: 0.1 }, { itemId: 'item_myt_01', chance: 0.01 }] } },
  { id: 'monster_c115', name: 'Linh Hầu Cổ', hp: 4500000, stats: { attack: 70000, defense: 50000, speed: 35, magicAttack: 20000, magicDefense: 45000, critRate: 0.25, critDamage: 2.0, accuracy: 0.95, evasion: 0.25, armorPen: 0.3, blockRate: 0.15, mentalDemonResistance: 0.2 }, rewards: { characterExp: 920, cultivationExp: 575, linhThach: 345, items: [{ itemId: 'item_018', chance: 0.1 }, { itemId: 'item_leg_17', chance: 0.1 }, { itemId: 'item_myt_02', chance: 0.01 }] } },
  // Tiên Giới - Độ Kiếp
  { id: 'monster_c125', name: 'Quỷ Huyết Nô', hp: 10000000, stats: { attack: 120000, defense: 80000, speed: 25, magicAttack: 100000, magicDefense: 70000, critRate: 0.2, critDamage: 2.1, accuracy: 0.9, evasion: 0.1, armorPen: 0.2, blockRate: 0.1, mentalDemonResistance: 0.6 }, rewards: { characterExp: 1000, cultivationExp: 625, linhThach: 375, items: [{ itemId: 'item_leg_18', chance: 0.12 }, { itemId: 'item_myt_03', chance: 0.015 }] } },
  { id: 'monster_c130', name: 'Ma Ngư', hp: 12000000, stats: { attack: 140000, defense: 90000, speed: 30, magicAttack: 110000, magicDefense: 80000, critRate: 0.15, critDamage: 2.0, accuracy: 0.9, evasion: 0.2, armorPen: 0.3, blockRate: 0.1, mentalDemonResistance: 0.5 }, rewards: { characterExp: 1040, cultivationExp: 650, linhThach: 390, items: [{ itemId: 'item_leg_19', chance: 0.12 }, { itemId: 'item_myt_04', chance: 0.015 }] } },
  // Tiên Giới - Đại Thừa
  { id: 'monster_c135', name: 'U Linh Quân', hp: 20000000, stats: { attack: 200000, defense: 150000, speed: 15, magicAttack: 180000, magicDefense: 140000, critRate: 0.1, critDamage: 2.0, accuracy: 1.0, evasion: 0.05, armorPen: 0.2, blockRate: 0.3, mentalDemonResistance: 0.8 }, rewards: { characterExp: 1080, cultivationExp: 675, linhThach: 405, items: [{ itemId: 'item_leg_20', chance: 0.15 }, { itemId: 'item_myt_05', chance: 0.02 }] } },
  { id: 'monster_c140', name: 'Ma Thần Bất Tử', hp: 25000000, stats: { attack: 250000, defense: 200000, speed: 20, magicAttack: 220000, magicDefense: 180000, critRate: 0.2, critDamage: 2.2, accuracy: 0.95, evasion: 0.1, armorPen: 0.4, blockRate: 0.2, mentalDemonResistance: 0.7 }, rewards: { characterExp: 1120, cultivationExp: 700, linhThach: 420, items: [{ itemId: 'item_myt_06', chance: 0.025 }, { itemId: 'item_myt_07', chance: 0.025 }] } },
  // Thần Giới
  { id: 'monster_c165', name: 'Ảnh Thân', hp: 50000000, stats: { attack: 500000, defense: 350000, speed: 50, magicAttack: 450000, magicDefense: 300000, critRate: 0.3, critDamage: 2.5, accuracy: 1.0, evasion: 0.4, armorPen: 0.5, blockRate: 0.1, mentalDemonResistance: 0.6 }, rewards: { characterExp: 1320, cultivationExp: 825, linhThach: 495, items: [{ itemId: 'item_005', chance: 0.05 }, { itemId: 'item_myt_08', chance: 0.03 }] } },
  { id: 'monster_c170', name: 'Huyễn Thú', hp: 60000000, stats: { attack: 550000, defense: 400000, speed: 25, magicAttack: 550000, magicDefense: 400000, critRate: 0.2, critDamage: 2.3, accuracy: 0.95, evasion: 0.2, armorPen: 0.3, blockRate: 0.3, mentalDemonResistance: 0.9 }, rewards: { characterExp: 1360, cultivationExp: 850, linhThach: 510, items: [{ itemId: 'item_010', chance: 0.01 }, { itemId: 'item_myt_09', chance: 0.04 }, { itemId: 'item_myt_10', chance: 0.04 }] } },
  ...NEW_BOSSES,
];

export const NPC_LIST: NPC[] = [
  {
    id: 'npc_001',
    name: 'Trưởng thôn',
    description: 'Một lão nhân tóc bạc phơ, ánh mắt hiền từ nhưng đầy uy nghiêm.',
    avatarUrl: 'https://api.multiavatar.com/Trưởng%20thôn-15-Trắng.png',
    hairStyle: 15,
    eyeColor: 'Trắng',
    baseStats: { attack: 5, magicAttack: 5, defense: 10, magicDefense: 10, critRate: 0.05, critDamage: 1.5, accuracy: 0.9, evasion: 0.05, speed: 10, armorPen: 0, blockRate: 0, mentalDemonResistance: 0.1 },
    totalStats: { attack: 5, magicAttack: 5, defense: 10, magicDefense: 20, critRate: 0.05, critDamage: 1.5, accuracy: 0.9, evasion: 0.05, speed: 10, armorPen: 0, blockRate: 0, mentalDemonResistance: 0.1 },
    equippedItems: {
      'pháp bảo': ITEM_LIST.find(i => i.id === 'item_018')
    }
  },
  {
    id: 'npc_002',
    name: 'Thầy thuốc',
    description: 'Một y sĩ có tấm lòng nhân hậu, luôn sẵn lòng cứu chữa cho người dân trong thôn.',
    avatarUrl: 'https://api.multiavatar.com/Thầy%20thuốc-5-Đen.png',
    hairStyle: 5,
    eyeColor: 'Đen',
    baseStats: { attack: 3, magicAttack: 15, defense: 5, magicDefense: 15, critRate: 0.05, critDamage: 1.5, accuracy: 0.9, evasion: 0.05, speed: 12, armorPen: 0, blockRate: 0, mentalDemonResistance: 0.05 },
    totalStats: { attack: 3, magicAttack: 30, defense: 5, magicDefense: 15, critRate: 0.05, critDamage: 1.5, accuracy: 0.9, evasion: 0.05, speed: 12, armorPen: 0, blockRate: 0, mentalDemonResistance: 0.05 },
    equippedItems: {
      'pháp bảo': ITEM_LIST.find(i => i.id === 'item_017')
    }
  },
  {
    id: 'npc_003',
    name: 'Thợ rèn',
    description: 'Một người đàn ông trung niên với cơ bắp cuồn cuộn và gương mặt lấm lem bụi than.',
    avatarUrl: 'https://api.multiavatar.com/Thợ%20rèn-1-Đen.png',
    hairStyle: 1,
    eyeColor: 'Đen',
    baseStats: { attack: 15, magicAttack: 0, defense: 20, magicDefense: 5, critRate: 0.1, critDamage: 1.6, accuracy: 0.95, evasion: 0.0, speed: 8, armorPen: 0.2, blockRate: 0.2, mentalDemonResistance: 0.0 },
    totalStats: { attack: 25, magicAttack: 0, defense: 22, magicDefense: 5, critRate: 0.1, critDamage: 1.6, accuracy: 0.95, evasion: 0.0, speed: 8, armorPen: 0.2, blockRate: 0.2, mentalDemonResistance: 0.0 },
    equippedItems: {
      'vũ khí': ITEM_LIST.find(i => i.id === 'item_016')
    }
  },
  {
    id: 'npc_004',
    name: 'Bạch Y Tiên Tử',
    description: 'Một nữ tử thần bí với dung mạo thoát tục, khí chất như tiên, dường như không thuộc về thế giới phàm trần.',
    avatarUrl: 'https://pic.surf/gqf9u',
    hairStyle: 1,
    eyeColor: 'Đen',
    baseStats: { attack: 150, magicAttack: 300, defense: 120, magicDefense: 250, critRate: 0.2, critDamage: 2.0, accuracy: 1.0, evasion: 0.3, speed: 100, armorPen: 0.3, blockRate: 0.2, mentalDemonResistance: 0.8 },
    totalStats: { attack: 150, magicAttack: 300, defense: 120, magicDefense: 250, critRate: 0.2, critDamage: 2.0, accuracy: 1.0, evasion: 0.3, speed: 100, armorPen: 0.3, blockRate: 0.2, mentalDemonResistance: 0.8 },
    equippedItems: {}
  }
];

export const STORE_INVENTORY = [
    { itemId: 'item_004', price: 25 },
    { itemId: 'item_019', price: 35 },
    { itemId: 'item_006', price: 120 },
    { itemId: 'item_008', price: 250 },
    { itemId: 'item_009', price: 400 },
];

export const BLACKSMITH_INVENTORY = [
    { itemId: 'item_001', price: 15 },
    { itemId: 'item_002', price: 12 },
];

export const CRAFTING_RECIPES = [
    { inputs: ['item_005', 'item_005'], output: 'item_002' },
];