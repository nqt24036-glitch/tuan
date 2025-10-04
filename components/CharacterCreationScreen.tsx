

import React, { useState } from 'react';
// FIX: Added .ts extension to fix module resolution error.
import { CharacterCreationData } from '../types.ts';

interface Props {
  onCharacterCreate: (data: CharacterCreationData) => void;
}

const SECTS = ['Kiếm Tu', 'Pháp Tu', 'Thể Tu', 'Luyện Đan', 'Tán Tu'];
const GENDERS: Array<'Nam' | 'Nữ'> = ['Nam', 'Nữ'];
const EYE_COLORS: Array<'Đen' | 'Trắng'> = ['Đen', 'Trắng'];
const HAIR_STYLES_COUNT = 20;

const CharacterCreationScreen: React.FC<Props> = ({ onCharacterCreate }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [sect, setSect] = useState(SECTS[0]);
  const [hairStyle, setHairStyle] = useState(1);
  const [eyeColor, setEyeColor] = useState<'Đen' | 'Trắng'>('Đen');
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (!name.trim()) {
      setError('Vui lòng nhập danh xưng của bạn.');
      return;
    }
    setError('');
    onCharacterCreate({ name, gender, sect, hairStyle, eyeColor });
  };
  
  const nextHair = () => setHairStyle(prev => (prev % HAIR_STYLES_COUNT) + 1);
  const prevHair = () => setHairStyle(prev => (prev === 1 ? HAIR_STYLES_COUNT : prev - 1));

  // FIX: Switched to multiavatar for better, more consistent character avatars.
  const avatarUrl = `https://api.multiavatar.com/${name.trim() || gender}-${hairStyle}-${eyeColor}.png`;

  return (
    <div className="h-screen w-screen flex items-center justify-center p-4 font-sans text-gray-200">
      <div className="w-full max-w-4xl bg-black bg-opacity-60 border border-gray-700 rounded-lg p-6 md:p-8 shadow-2xl shadow-black/50 flex flex-col md:flex-row gap-8 overflow-y-auto">
        {/* Left Side: Avatar Preview */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <h2 className="text-2xl font-serif text-yellow-300 mb-4">Hình Dáng</h2>
          <div className="w-56 h-80 md:w-64 md:h-96 rounded-lg overflow-hidden border-2 border-yellow-600 mb-4 flex-shrink-0">
             <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover bg-gray-800" />
          </div>
          <p className="text-xs text-center text-gray-400">Trang phục: Áo bào trắng</p>
          <p className="text-xs text-center text-gray-400">Mặt: Tiêu chuẩn Châu Á</p>
        </div>

        {/* Right Side: Customization Options */}
        <div className="w-full md:w-2/3 flex flex-col space-y-4">
          <h1 className="text-3xl md:text-4xl font-serif text-center text-yellow-300 mb-2">Sáng Tạo Nhân Vật</h1>
          
          <div>
            <label className="block text-lg font-semibold text-yellow-400 font-serif mb-1">Danh Xưng</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên nhân vật..."
              className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-lg font-semibold text-yellow-400 font-serif mb-1">Giới Tính</label>
            <div className="flex gap-2">
              {GENDERS.map(g => (
                <button key={g} onClick={() => setGender(g)} className={`px-4 py-2 rounded border-2 transition-colors w-full ${gender === g ? 'bg-yellow-500 text-black border-yellow-400' : 'bg-transparent border-gray-600 hover:bg-gray-700'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-lg font-semibold text-yellow-400 font-serif mb-1">Kiểu Tóc</label>
              <div className="flex items-center gap-2">
                <button onClick={prevHair} className="px-3 py-1 rounded border-2 border-gray-600 bg-transparent hover:bg-gray-700">{'<'}</button>
                <span className="w-full text-center bg-gray-900 border border-gray-600 rounded py-1">{`Kiểu ${hairStyle}`}</span>
                <button onClick={nextHair} className="px-3 py-1 rounded border-2 border-gray-600 bg-transparent hover:bg-gray-700">{'>'}</button>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-lg font-semibold text-yellow-400 font-serif mb-1">Màu Mắt</label>
              <div className="flex gap-2">
                {EYE_COLORS.map(c => (
                  <button key={c} onClick={() => setEyeColor(c)} className={`flex-1 py-1 rounded border-2 transition-colors ${eyeColor === c ? 'bg-yellow-500 text-black border-yellow-400' : 'bg-transparent border-gray-600 hover:bg-gray-700'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-yellow-400 font-serif mb-1">Chọn Phái</label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {SECTS.map(s => (
                <button key={s} onClick={() => setSect(s)} className={`px-2 py-2 text-sm rounded border-2 transition-colors ${sect === s ? 'bg-yellow-500 text-black border-yellow-400' : 'bg-transparent border-gray-600 hover:bg-gray-700'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button 
              onClick={handleCreate}
              className="w-full bg-green-600 text-white text-xl font-bold py-3 rounded-lg border-2 border-green-400 hover:bg-green-500 transition-all duration-300 shadow-lg shadow-green-500/30"
            >
              Tiến Vào Huyền Giới
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CharacterCreationScreen;