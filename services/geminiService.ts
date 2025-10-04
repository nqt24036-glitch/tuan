import { GoogleGenAI, Type } from "@google/genai";
import { AdventureStorylet, WorldMapArea, Player, Quest } from '../types';
import { MONSTERS, ITEM_LIST } from '../data/gameData';

let ai: GoogleGenAI | null = null;

export const initializeAi = (apiKey: string) => {
    if (apiKey && apiKey.trim() !== '') {
        try {
            ai = new GoogleGenAI({ apiKey });
        } catch (error) {
            console.error("Failed to initialize GoogleGenAI:", error);
            ai = null;
        }
    } else {
        console.warn("AI initialization skipped: API key is missing.");
        ai = null;
    }
};

const getAi = (): GoogleGenAI | null => {
    return ai;
};


const adventureSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Một tiêu đề hấp dẫn cho câu chuyện phiêu lưu ngắn này." },
    startStepId: { type: Type.STRING, description: "ID của bước khởi đầu câu chuyện, phải khớp với một trong các ID trong danh sách các bước." },
    steps: {
      type: Type.ARRAY,
      description: "Một danh sách tất cả các bước có thể có trong câu chuyện.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Một ID độc nhất cho bước này (ví dụ: 'start', 'cave_entrance', 'choice_A1')." },
          description: { type: Type.STRING, description: "Đoạn văn mô tả tình huống, bối cảnh hiện tại của người chơi." },
          choices: {
            type: Type.ARRAY,
            description: "Luôn luôn cung cấp chính xác 4 lựa chọn cho người chơi.",
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING, description: "Nội dung lựa chọn hiển thị cho người chơi." },
                outcome: {
                  type: Type.OBJECT,
                  properties: {
                    type: { 
                      type: Type.STRING, 
                      description: "Loại kết quả: 'continue' (tiếp tục câu chuyện), 'battle' (bắt đầu trận chiến), 'reward' (nhận thưởng và kết thúc), 'end' (kết thúc câu chuyện mà không có gì đặc biệt)." 
                    },
                    nextStepId: { type: Type.STRING, description: "ID của bước tiếp theo nếu type là 'continue'. Phải khớp với một ID trong danh sách các bước." },
                    monsterName: { type: Type.STRING, description: "Tên của quái vật nếu type là 'battle'. Ví dụ: 'Dã Lang', 'Hắc Hùng'." },
                    rewardDescription: { type: Type.STRING, description: "Mô tả phần thưởng nếu type là 'reward'." },
                    rewardExp: { type: Type.INTEGER, description: "Lượng kinh nghiệm tu vi nhận được." },
                    rewardLinhThach: { type: Type.INTEGER, description: "Số linh thạch nhận được." },
                    rewardItemId: { type: Type.STRING, description: "ID của vật phẩm nhận được (nếu có)." }
                  },
                  required: ["type"]
                }
              },
              required: ["text", "outcome"]
            }
          }
        },
        required: ["id", "description", "choices"]
      }
    }
  },
  required: ["title", "startStepId", "steps"]
};

const questSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: "Một ID độc nhất cho nhiệm vụ, ví dụ: quest_npc_162534" },
    title: { type: Type.STRING, description: "Một tiêu đề ngắn gọn, hấp dẫn cho nhiệm vụ." },
    description: { type: Type.STRING, description: "Mô tả chi tiết về nhiệm vụ, bao gồm bối cảnh và yêu cầu." },
    progress: { type: Type.INTEGER, description: "Tiến độ ban đầu, luôn là 0." },
    target: { type: Type.INTEGER, description: "Mục tiêu cần đạt được (ví dụ: số lượng quái vật cần tiêu diệt)." },
    reward: { type: Type.STRING, description: "Mô tả phần thưởng khi hoàn thành nhiệm vụ (ví dụ: '100 EXP, 50 Linh Thạch')." },
    rewardObject: {
      type: Type.OBJECT,
      description: "Phần thưởng có cấu trúc để game xử lý.",
      properties: {
        characterExp: { type: Type.INTEGER, description: "Lượng kinh nghiệm nhân vật." },
        cultivationExp: { type: Type.INTEGER, description: "Lượng kinh nghiệm tu vi (linh lực)." },
        linhThach: { type: Type.INTEGER, description: "Số lượng linh thạch." },
        itemId: { type: Type.STRING, description: "ID của vật phẩm thưởng (nếu có)." }
      }
    },
    objective: {
      type: Type.OBJECT,
      description: "Mục tiêu có cấu trúc của nhiệm vụ.",
      properties: {
        type: {
          type: Type.STRING,
          description: "Loại mục tiêu: 'kill' (giết quái), 'collect' (thu thập vật phẩm), hoặc 'talk' (nói chuyện với NPC)."
        },
        targetName: {
          type: Type.STRING,
          description: "Tên của mục tiêu. Ví dụ: 'Dã Lang' cho kill, 'Da Sói' cho collect, 'Thợ rèn' cho talk. Phải khớp với một trong các tên được cung cấp trong bối cảnh."
        },
        itemId: { type: Type.STRING, description: "ID của vật phẩm cần thu thập. Chỉ điền trường này nếu type là 'collect'." }
      },
      required: ["type", "targetName"]
    }
  },
  required: ["id", "title", "description", "progress", "target", "reward", "objective", "rewardObject"]
};


export const generateAdventureStorylet = async (): Promise<AdventureStorylet | null> => {
  const aiInstance = getAi();
  if (!aiInstance) {
    console.error("AI service not initialized. Cannot generate storylet.");
    return null;
  }

  const monsterNames = MONSTERS.map(m => m.name).join(', ');
  
  const prompt = `Tạo một mini game phiêu lưu dạng văn bản (text-based adventure) ngắn gọn trong bối cảnh thế giới tu tiên huyền huyễn của Trung Quốc.
  
  Bối cảnh: Người chơi là một tu sĩ cấp thấp đang thám hiểm một khu vực nguy hiểm để tìm kiếm cơ duyên.
  
  Yêu cầu:
  1.  Tạo một câu chuyện có khởi đầu, một vài ngã rẽ, và kết thúc.
  2.  Tại mỗi bước, người chơi phải được cung cấp **chính xác 4 lựa chọn**.
  3.  **Thường xuyên đưa vào các NPC tương tác** như thương nhân thần bí, tu sĩ bị thương, lão nhân nắm giữ bí mật, hoặc các sinh vật thân thiện. Các lựa chọn của người chơi nên bao gồm việc tương tác với các NPC này (ví dụ: Giúp đỡ, Hỏi chuyện, Giao dịch, Phớt lờ).
  4.  Các lựa chọn phải dẫn đến các kết quả khác nhau: tiếp tục câu chuyện, chiến đấu với yêu thú, nhận được phần thưởng (linh thạch, kinh nghiệm, vật phẩm), hoặc một kết thúc đơn giản.
  5.  **Trận chiến ('battle') chỉ nên xảy ra như một hậu quả của một lựa chọn.** Khi cần một trận chiến, hãy chọn một yêu thú từ danh sách sau: ${monsterNames}.
  6.  Câu chuyện nên ngắn gọn, chỉ khoảng 2-4 bước trước khi kết thúc.
  7.  Đảm bảo 'startStepId' phải khớp với 'id' của một trong các bước trong danh sách.
  8.  Đảm bảo tất cả 'nextStepId' cũng phải khớp với 'id' của một bước nào đó trong danh sách.`;

  try {
    const response = await aiInstance.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: adventureSchema,
        temperature: 0.9,
      }
    });
    
    const jsonText = response.text.trim();
    const storylet = JSON.parse(jsonText) as AdventureStorylet;

    // Basic validation
    if (!storylet.steps || storylet.steps.length === 0 || !storylet.steps.find(s => s.id === storylet.startStepId)) {
        console.error("Invalid storylet: startStepId not found in steps array", storylet);
        return null;
    }

    return storylet;
  } catch (error) {
    console.error("Error generating adventure storylet:", error);
    return null;
  }
};

export const generateQuest = async (npc: string, area: WorldMapArea, player: Player): Promise<Quest | null> => {
  const aiInstance = getAi();
  if (!aiInstance) {
    console.error("AI service not initialized. Cannot generate quest.");
    return null;
  }
    
  const availableMonsters = area.monsters?.filter(m => m !== 'Không có (thành an toàn)') || [];
  const monsterList = availableMonsters.length > 0 ? availableMonsters.join(', ') : 'không có yêu thú nào';
  
  const availableNpcs = area.npcs?.filter(n => n !== npc) || [];
  const otherNpcs = availableNpcs.length > 0 ? availableNpcs.join(', ') : 'không có ai khác';
  
  const availableCollectibles = ITEM_LIST.filter(i => i.type === 'Nguyên liệu');
  const collectableItems = availableCollectibles.length > 0 
    ? availableCollectibles.map(i => `${i.name} (id: ${i.id})`).join('; ')
    : 'không có vật phẩm nào';
    
  const rewardableItems = ITEM_LIST.filter(i => ['Nguyên liệu', 'Tiêu hao', 'Sách Kỹ Năng'].includes(i.type)).map(i => `${i.name} (id: ${i.id})`).join('; ');

  // Determine possible quest types based on context
  const possibleQuestTypes = [];
  if (availableMonsters.length > 0) possibleQuestTypes.push("'kill'");
  if (availableCollectibles.length > 0) possibleQuestTypes.push("'collect'");
  if (availableNpcs.length > 0) possibleQuestTypes.push("'talk'");

  if (possibleQuestTypes.length === 0) {
      console.warn(`No possible quest types for NPC ${npc} in area ${area.name}.`);
      return null; // Cannot generate a quest if there are no valid objectives.
  }

  const questTypesString = possibleQuestTypes.join(', ');
  
  const prompt = `Tạo một nhiệm vụ ngắn trong bối cảnh thế giới tu tiên huyền huyễn cho một người chơi, tuân thủ nghiêm ngặt các yêu cầu về cấu trúc dữ liệu.

  Bối cảnh:
  - Người chơi: ${player.name}, Cấp ${player.level}, thuộc phái ${player.sect}.
  - Địa điểm: ${area.name} (${area.description}).
  - NPC giao nhiệm vụ: ${npc}.
  - Các yêu thú có thể có trong khu vực (dùng cho nhiệm vụ 'kill'): ${monsterList}.
  - Các vật phẩm có thể thu thập (dùng cho nhiệm vụ 'collect'): ${collectableItems}.
  - Các NPC khác trong khu vực (dùng cho nhiệm vụ 'talk'): ${otherNpcs}.
  - Các vật phẩm có thể làm phần thưởng: ${rewardableItems}.

  Yêu cầu CỐ ĐỊNH (phải tuân theo):
  1.  **Nội dung**: Tạo một nhiệm vụ phù hợp với bối cảnh. Lời thoại của NPC (${npc}) phải được tích hợp vào phần mô tả nhiệm vụ.
  2.  **Loại nhiệm vụ**: Dựa vào bối cảnh, hãy chọn một loại nhiệm vụ từ danh sách sau: ${questTypesString}. Đừng tạo nhiệm vụ loại 'kill' nếu không có yêu thú, 'collect' nếu không có vật phẩm, hoặc 'talk' nếu không có NPC khác.
  3.  **Cấu trúc dữ liệu**:
      *   \`id\`: Chuỗi ngẫu nhiên độc nhất (ví dụ: quest_thotren_12345).
      *   \`progress\`: Luôn là số 0.
      *   \`target\`: Một con số hợp lý (ví dụ: 5 cho kill/collect, 1 cho talk).
      *   \`reward\`: Chuỗi mô tả phần thưởng (ví dụ: "100 EXP, 50 Linh Thạch, 2x Luyện Khí Tán").
      *   **\`objective\` (BẮT BUỘC)**:
          *   \`type\` phải là một trong các chuỗi được phép: ${questTypesString}.
          *   \`targetName\` phải là tên của mục tiêu và PHẢI khớp với một trong các tên đã được cung cấp trong bối cảnh (tên yêu thú, tên vật phẩm, hoặc tên NPC).
          *   Nếu \`type\` là "collect", BẮT BUỘC phải có trường \`itemId\` và giá trị của nó phải khớp với ID của vật phẩm trong danh sách vật phẩm thu thập.
      *   **\`rewardObject\` (BẮT BUỘC)**:
          *   Các trường (\`characterExp\`, \`cultivationExp\`, \`linhThach\`) phải là SỐ và khớp với chuỗi \`reward\`.
          *   Nếu có vật phẩm thưởng, \`itemId\` phải là một trong các ID đã được cung cấp trong danh sách vật phẩm.
          *   Ví dụ: Nếu \`reward\` là "150 EXP Tu Luyện, 75 Linh Thạch, 1x Da Sói", thì \`rewardObject\` phải là \`{ "cultivationExp": 150, "linhThach": 75, "itemId": "item_005" }\`.`;

  try {
    const response = await aiInstance.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: questSchema,
        temperature: 0.8,
      }
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as Quest;
  } catch (error) {
    console.error("Error generating quest:", error);
    return null;
  }
};