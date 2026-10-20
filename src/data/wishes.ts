/**
 * Database of 20/10 wishes & presets customized for family by Vũ Mạnh Quang
 * Không có chị, chỉ có bà, mẹ, các cô, các thím và các em gái
 */

export interface WishCategory {
  id: string;
  label: string;
  shortLabel: string;
}

export const WISH_CATEGORIES: WishCategory[] = [
  { id: 'all', label: 'Tất cả gia đình', shortLabel: 'gia đình' },
  { id: 'grandma_mom', label: 'Bà & Mẹ yêu', shortLabel: 'bà & mẹ' },
  { id: 'aunt', label: 'Cô & Thím', shortLabel: 'cô & thím' },
  { id: 'sisters', label: 'Các Em gái', shortLabel: 'các em gái' },
  { id: 'family', label: 'Đại gia đình', shortLabel: 'đại gia đình' },
  { id: 'poem', label: 'Thơ gia đình', shortLabel: 'thơ ca' },
];

export const WISH_DATA: Record<string, string[]> = {
  grandma_mom: [
    'Con chúc Bà và Mẹ luôn dồi dào sức khỏe, sống vui, sống khỏe bên con cháu, lúc nào cũng an yên và hạnh phúc.',
    'Nhân ngày 20/10, con xin cảm ơn Bà và Mẹ vì đã luôn hy sinh, chăm lo từng bữa ăn giấc ngủ và dành trọn tình yêu thương vô bờ bến cho gia đình.',
    'Chúc Mẹ yêu của con mãi luôn tươi trẻ, nụ cười luôn rạng rỡ trên môi. Con sẽ luôn cố gắng học tập, làm việc thật tốt để Mẹ luôn tự hào!',
    'Bà và Mẹ chính là chỗ dựa tinh thần bình yên nhất của con. Chúc hai người phụ nữ vĩ đại nhất đời con một ngày 20/10 ngập tràn niềm vui và bình an!',
    'Cầu mong cho Bà và Mẹ mọi âu lo tan biến, chỉ còn lại nụ cười, niềm vui và sự ấm áp bên con cháu sum vầy.',
  ],
  aunt: [
    'Con/cháu chúc các cô, các thím một ngày 20/10 thật nhiều niềm vui, luôn xinh đẹp, trẻ trung, hạnh phúc bên gia đình nhỏ!',
    'Cảm ơn các cô, các thím đã luôn chu đáo, yêu thương các cháu và vun đắp cho đại gia đình mình lúc nào cũng gắn kết, đầm ấm.',
    'Chúc các cô và các thím công việc thuận lợi, phát tài phát lộc, vạn sự như ý và mãi giữ được nét tươi tắn, duyên dáng!',
    'Nhân ngày 20/10, cháu chúc cô và thím nhận được thật nhiều hoa, nhiều quà và ngập tràn lời chúc ngọt ngào nhất từ những người thân yêu.',
  ],
  sisters: [
    'Anh chúc các em gái ngày 20/10 ngày càng xinh đẹp, rạng rỡ, học giỏi, công tác tốt và luôn tươi vui như những đóa hoa mùa thu!',
    'Chúc các em ăn hoài không béo, tiêu hoài không hết tiền, sớm đạt được mọi ước mơ và luôn là niềm tự hào của cả nhà!',
    'Chúc em gái ngày 20/10 vui vẻ, nhận được thật nhiều quà, luôn ngoan ngoãn và rạng rỡ mỗi ngày nhé!',
    'Chúc các em luôn tự tin, duyên dáng, luôn tìm thấy niềm vui và hạnh phúc trọn vẹn trong cuộc sống.',
  ],
  family: [
    'Nhân ngày 20/10, xin kính chúc tất cả các bà, mẹ, các cô, các thím và các em trong gia đình luôn bình an, mạnh khỏe và ngập tràn hạnh phúc!',
    'Những người phụ nữ trong gia đình mình chính là những bông hoa rực rỡ và quý giá nhất. Cảm ơn mọi người đã luôn gìn giữ ngọn lửa yêu thương cho tổ ấm!',
    'Chúc cho đại gia đình chúng ta mãi luôn đoàn kết, sum vầy ấm cúng, tiếng cười rộn rã khắp nhà và tràn ngập niềm vui mỗi ngày.',
    'Gửi ngàn lời chúc tốt đẹp nhất đến toàn thể bà, mẹ, các cô, các thím và các em gái nhân ngày 20/10!',
  ],
  poem: [
    'Tháng mười gió nhẹ thu sang,\nGia đình sum họp rộn ràng yêu thương.\nBà, mẹ tần tảo sớm sương,\nCô, thím đằm thắm vấn vương nghĩa tình.\nCác em rạng rỡ tươi xinh,\nTrọn đời hạnh phúc, an bình ấm êm.',
    'Ơn bà, nghĩa mẹ mênh mông,\nThím, cô đùm bọc thấu lòng cháu con.\nChúc người phơi phới sắc son,\nNụ cười rạng rỡ, vuông tròn niềm vui.',
    'Hôm nay ngày hội chúc mừng,\nCháu con gửi trọn tấc lòng kính yêu.\nChúc bà, chúc mẹ trăm điều,\nCô, thím vui vẻ, các em rạng ngời!',
  ],
};

export function getPersonalizedWish(category: string, recipientName?: string): string {
  const pool = category === 'all' ? Object.values(WISH_DATA).flat() : WISH_DATA[category] || WISH_DATA.family;
  const wish = pool[Math.floor(Math.random() * pool.length)];
  if (!recipientName) return wish;
  return wish.replace(/các bà, mẹ, các cô, các thím và các em/g, recipientName)
             .replace(/Bà và Mẹ/g, recipientName)
             .replace(/các cô, các thím/g, recipientName)
             .replace(/các em gái/g, recipientName);
}

export interface LetterPreset {
  id: string;
  label: string;
  to: string;
  from: string;
  badge: string;
  greeting: string;
  intro: string;
  highlight: string;
  poem: { l6: string; l8: string }[];
  closing: string;
  signature1: string;
  signature2: string;
}

export const LETTER_PRESETS: LetterPreset[] = [
  {
    id: 'family-all',
    label: 'Cả nhà (Bà, Mẹ, Cô, Thím, Em)',
    to: 'bà, mẹ, các cô, các thím và các em gái thân yêu',
    from: 'Vũ Mạnh Quang',
    badge: 'Vũ Mạnh Quang kính chúc',
    greeting: 'Kính gửi bà, mẹ, các cô, các thím và các em thân yêu trong gia đình,',
    intro:
      'Nhân ngày Phụ nữ Việt Nam 20/10, con/cháu/anh xin gửi tới bà, mẹ, các cô, các thím, cùng toàn thể các em những lời chúc mừng ấm áp và chân thành nhất từ tận đáy lòng.',
    highlight:
      'Cảm ơn bà và mẹ đã tần tảo hy sinh cả đời vì con cháu; cảm ơn các cô, các thím đã luôn chu đáo, vun vén tình cảm cho đại gia đình; và cảm ơn các em đã luôn mang lại tiếng cười, niềm vui rộn rã mỗi dịp sum vầy. Mọi người chính là những ngọn lửa ấm áp nhất sưởi ấm mái nhà chung của chúng ta.',
    poem: [
      { l6: 'Tháng mười gió nhẹ thu sang,', l8: 'Gia đình sum họp rộn ràng yêu thương.' },
      { l6: 'Bà, mẹ tần tảo sớm sương,', l8: 'Cô, thím đằm thắm vấn vương nghĩa tình.' },
      { l6: 'Các em rạng rỡ tươi xinh,', l8: 'Trọn đời hạnh phúc, an bình ấm êm.' },
    ],
    closing:
      'Con kính chúc bà luôn sống lâu trăm tuổi, chúc mẹ, các cô, các thím luôn dồi dào sức khoẻ, trẻ đẹp, an yên; và chúc các em luôn rạng rỡ, may mắn, học tập và công tác thật tốt, luôn là niềm tự hào của gia đình!',
    signature1: 'Vũ Mạnh Quang',
    signature2: 'Gia đình yêu thương · 20/10/2026',
  },
  {
    id: 'grandma-mom',
    label: 'Kính gửi Bà & Mẹ yêu',
    to: 'Bà và Mẹ kính yêu',
    from: 'Vũ Mạnh Quang',
    badge: 'Vũ Mạnh Quang kính chúc',
    greeting: 'Bà và Mẹ kính yêu của con,',
    intro:
      'Nhân ngày Phụ nữ Việt Nam 20/10, con xin gửi tới Bà và Mẹ ngàn lời chúc tốt đẹp nhất cùng tấm lòng biết ơn sâu sắc vô bờ bến.',
    highlight:
      'Cảm ơn Bà và Mẹ vì đã cả đời hy sinh, dành trọn tình thương, dạy dỗ và chở che cho con từng bước trưởng thành. Tình yêu thương của Bà và Mẹ là tài sản quý giá nhất trong cuộc đời con.',
    poem: [
      { l6: 'Ơn cha bóng núi ngút ngàn,', l8: 'Nghĩa mẹ dạt dào như biển mênh mông.' },
      { l6: 'Cầu mong bà, mẹ tươi hồng,', l8: 'Sống vui sống khỏe thỏa lòng cháu con.' },
    ],
    closing:
      'Con chúc Bà sống lâu trăm tuổi, chúc Mẹ luôn mạnh khỏe, bình an, nụ cười luôn nở trên môi và luôn tự hào về con!',
    signature1: 'Con/Cháu Vũ Mạnh Quang',
    signature2: '20/10/2026',
  },
  {
    id: 'aunts-younger',
    label: 'Cô, Thím & Các Em',
    to: 'các cô, các thím và các em gái',
    from: 'Vũ Mạnh Quang',
    badge: 'Vũ Mạnh Quang kính chúc',
    greeting: 'Thân gửi các cô, các thím và các em gái thân mến,',
    intro:
      'Nhân ngày 20/10, con/cháu/anh xin chúc các cô, các thím và các em có một ngày thật ý nghĩa, ngập tràn niềm vui, hoa tươi và những món quà bất ngờ!',
    highlight:
      'Cảm ơn các cô, các thím luôn chu toàn, ân cần với cháu con; cảm ơn các em luôn mang đến nguồn năng lượng tươi vui, tích cực cho gia đình.',
    poem: [
      { l6: 'Tháng mười rực rỡ nắng vàng,', l8: 'Gửi trao phái đẹp muôn ngàn lời ca.' },
      { l6: 'Chúc người tươi thắm như hoa,', l8: 'Trọn đời hạnh phúc, an hòa ấm êm.' },
    ],
    closing:
      'Chúc các cô, các thím luôn trẻ trung, an vui, chúc các em luôn xinh xắn, chăm ngoan, học giỏi và luôn giữ nụ cười rạng rỡ trên môi!',
    signature1: 'Vũ Mạnh Quang',
    signature2: '20/10/2026',
  },
];
