import { WorldMapRealm } from '../types.ts';

export const WORLD_MAP_DATA: WorldMapRealm[] = [
  {
    id: 'realm_pham_gioi',
    name: 'Phàm Giới',
    description: 'Là nơi khởi đầu, sinh sống của người thường, ít linh khí, tài nguyên nghèo nàn nhưng có nhiều câu chuyện mở đầu.',
    levelRange: '1-30',
    areas: [
      {
        id: 'area_thanh_thuy',
        name: 'Thôn Thanh Thủy',
        description: 'Làng khởi đầu – nơi nhân vật chính lớn lên. Giao diện cơ bản, nhiệm vụ hướng dẫn.',
        levelRange: '1-5',
        npcs: ['Trưởng thôn', 'Thầy thuốc', 'Thợ rèn'],
        monsters: ['Cọc gỗ', 'Chuột Đói', 'Chó Hoang'],
        boss: 'Chuột Tinh Biến Dị',
        rewards: ['Nguyên liệu cơ bản', 'Trang bị phàm nhân', 'Đan dược cấp thấp'],
      },
      {
        id: 'area_van_lam',
        name: 'Thành Vân Lâm',
        description: 'Thành lớn, trung tâm giao thương. Có nhiều NPC, nơi nhận nhiệm vụ, luyện đan, giao dịch.',
        levelRange: '5-15',
        npcs: ['Thương nhân', 'Quan binh', 'Đạo sĩ lang thang'],
        monsters: ['Không có (thành an toàn)'],
        rewards: ['Vật phẩm giao dịch', 'Bí kíp sơ cấp', 'Bản đồ khu vực'],
      },
      {
        id: 'area_me_anh',
        name: 'Rừng Mê Ảnh',
        description: 'Khu rừng nguy hiểm đầu tiên – có yêu thú, kỳ thảo, phụ bản cấp thấp.',
        levelRange: '10-20',
        npcs: ['Tiều phu lạc đường', 'Yêu linh nhỏ'],
        monsters: ['Nhện Độc', 'Hổ Vằn Lửa Rừng'],
        boss: 'Hổ Vương Mê Ảnh',
        rewards: ['Linh thảo cấp thấp', 'Da thú', 'Pháp bảo sơ cấp'],
      },
      {
        id: 'area_hang_da',
        name: 'Hang Đá Tối',
        description: 'Bí cảnh ẩn dưới núi – luyện khí nhân tạo, có boss đầu tiên.',
        levelRange: '20-25',
        npcs: ['Ẩn sĩ'],
        monsters: ['Dơi Máu', 'Linh Thạch Nhân'],
        boss: 'Vua Dơi Hút Máu',
        rewards: ['Trang bị lam', 'Công pháp nhập môn', 'Thú cưỡi cấp thấp'],
      },
      {
        id: 'area_tich_duong',
        name: 'Đỉnh Tịch Dương',
        description: 'Nơi ngắm hoàng hôn – có NPC bí ẩn, lần đầu tiên nhắc đến "tu tiên".',
        levelRange: '25-30',
        npcs: ['Tiên giả bí ẩn'],
        monsters: [],
        rewards: ['Cơ duyên hiếm: ngộ tính +1', 'Pháp khí đầu tiên'],
      },
    ]
  },
  {
    id: 'realm_tu_chan_gioi',
    name: 'Tu Chân Giới',
    description: 'Nơi các tu sĩ hoạt động, linh khí dày đặc, có nhiều tông môn, yêu thú, di tích cổ xưa. Nơi bắt đầu con đường tu tiên thực sự.',
    levelRange: '30-80',
    areas: [
      { id: 'area_thanh_van', name: 'Tông môn Thanh Vân', description: 'Chính phái lớn – có thể gia nhập, học pháp thuật, nhận nhiệm vụ tông môn.', levelRange: '30-50', boss: 'Hộ Sơn Kỳ Lân' },
      { id: 'area_van_yeu_son', name: 'Vạn Yêu Sơn', description: 'Núi yêu thú cư ngụ – bắt linh thú, thu phục, huấn luyện.', levelRange: '40-60', monsters: ['Hồ Linh', 'Lang Vương', 'Thủy Xà'], boss: 'Vạn Yêu Vương' },
      { id: 'area_linh_tri', name: 'Vực Linh Trì', description: 'Hồ chứa linh khí – tăng tốc tu luyện, có boss canh giữ.', levelRange: '50-70', monsters: ['Tinh Linh Thủy Nữ'], boss: 'Thủy Mẫu Thánh Nữ' },
      { id: 'area_ma_vuc', name: 'Thành Ma Vực', description: 'Nơi ma tu tụ tập – PvP tự do, kịch bản phản diện mạnh.', levelRange: '60-80', boss: 'Ma Soái Hắc Ám' },
      { id: 'area_ban_co', name: 'Di tích Bàn Cổ', description: 'Di tích cổ – xuất hiện kỳ ngộ, bảo vật, ẩn chứa nguy hiểm cực lớn.', levelRange: '70+', monsters: ['Lôi Linh Nhân'], boss: 'Cự Thần Bàn Cổ Tàn Hồn' },
    ]
  },
  {
    id: 'realm_tien_gioi',
    name: 'Tiên Giới',
    description: 'Chỉ người vượt Độ Kiếp mới có thể đặt chân tới. Thế giới thần thánh, mỗi khu vực đều có thiên đạo giám sát.',
    levelRange: '80-150',
    areas: [
      { id: 'area_thien_cung', name: 'Thiên Cung', description: 'Trung tâm của Tiên giới – NPC thiên tướng, bảng xếp hạng tiên đồ.', levelRange: '80-100', npcs: ['Thiên tướng', 'Bạch Y Tiên Tử'] },
      { id: 'area_ngoc_hu', name: 'Ngọc Hư Cảnh', description: 'Cảnh giới tu luyện cực nhanh – cần điều kiện cao để vào.', levelRange: '90+' },
      { id: 'area_thien_loi', name: 'Thiên Lôi Vực', description: 'Nơi rèn luyện độ kiếp – boss Lôi Thần, yêu cầu đội nhóm mạnh.', levelRange: '100+', monsters: ['Lôi Điểu'] },
      { id: 'area_linh_dien', name: 'Linh Điện Cửu Trọng', description: '9 tầng tháp thử thách – vượt càng cao phần thưởng càng lớn.', levelRange: '110+', monsters: ['Linh Hầu Cổ'] },
      { id: 'area_van_mong', name: 'Đảo Vân Mộng', description: 'Khu vực thư giãn, câu cá, hẹn hò đạo lữ, mở khóa kỹ năng đôi.', levelRange: '120+' },
      { id: 'area_than_moc', name: 'Thần Mộc Viễn Cổ', description: 'Đại thụ cổ – chứa đựng truyền thừa Tiên Nhân thất lạc.', levelRange: '130+', monsters: ['Cự Mộc Hộ Vệ'] },
    ]
  },
  {
    id: 'realm_ma_gioi',
    name: 'Ma Giới',
    description: 'Có thể song song tồn tại với Tiên giới. Bị thiên đạo khinh thường, nhưng lại chứa sức mạnh cấm kỵ.',
    levelRange: '120+',
    areas: [
      { id: 'area_hac_phong', name: 'Hắc Phong Trì', description: 'Linh khí âm tà – luyện ma công, chế tạo pháp bảo tàn độc.', levelRange: '120+', monsters: ['Quỷ Huyết Nô'] },
      { id: 'area_huyet_hai', name: 'Huyết Hải Vô Biên', description: 'Biển máu – mỗi lần chết ở đây sẽ tăng "sát khí", mở khóa kỹ năng ma đạo.', levelRange: '130+', monsters: ['Ma Ngư'] },
      { id: 'area_phong_an', name: 'Phong Ấn Cổ Tông', description: 'Di tích ma tông – bị phong ấn, cần phá giải để nhận truyền thừa.', levelRange: '140+', monsters: ['U Linh Quân'] },
      { id: 'area_co_mo', name: 'Cổ Mộ U Linh', description: 'Khu mộ của ma thần – boss mạnh, tỷ lệ rớt đồ truyền thuyết cao.', levelRange: '150+', monsters: ['Ma Thần Bất Tử'] },
      { id: 'area_ma_de', name: 'Lãnh Địa Ma Đế', description: 'Thành trì cuối cùng – nơi đặt tổng hành dinh của Ma giới.', levelRange: '160+' },
    ]
  },
  {
    id: 'realm_hu_khong_gioi',
    name: 'Hư Không Giới / Thần Giới',
    description: 'Thế giới của những kẻ vượt khỏi thiên đạo, siêu việt, ít người từng đạt tới.',
    levelRange: '160+',
    areas: [
      { id: 'area_hu_khong_mon', name: 'Hư Không Chi Môn', description: 'Cổng vào – yêu cầu "Phá Thiên Lệnh" để mở.', levelRange: '160+' },
      { id: 'area_dien_than_hu', name: 'Điện Thần Hư', description: 'Nơi các “Thần tu” tu luyện – yêu cầu tinh thông cả ma & tiên pháp.', levelRange: '170+' },
      { id: 'area_huyen_canh', name: 'Huyễn Cảnh Luân Hồi', description: 'Cảnh giới ảo tưởng – cho phép quay lại quá khứ, thay đổi quyết định.', levelRange: '180+', monsters: ['Ảnh Thân', 'Huyễn Thú'] },
      { id: 'area_canh_tan_than', name: 'Cảnh Tàn Thần', description: 'Chiến trường thần giới – PvP cấp cao, tranh đoạt bảo vật thần thánh.', levelRange: '190+' },
    ]
  }
];