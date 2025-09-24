export default async function Home() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-4xl font-bold">안녕하세요! Pretendard 폰트 테스트</h1>
      
      <div className="space-y-3">
        <p className="text-xl font-thin">font-thin (100): 프리텐다드 얇은 폰트</p>
        <p className="text-xl font-extralight">font-extralight (200): 프리텐다드 매우 얇은 폰트</p>
        <p className="text-xl font-light">font-light (300): 프리텐다드 가는 폰트</p>
        <p className="text-xl font-normal">font-normal (400): 프리텐다드 보통 폰트</p>
        <p className="text-xl font-medium">font-medium (500): 프리텐다드 중간 폰트</p>
        <p className="text-xl font-semibold">font-semibold (600): 프리텐다드 반굵은 폰트</p>
        <p className="text-xl font-bold">font-bold (700): 프리텐다드 굵은 폰트</p>
        <p className="text-xl font-extrabold">font-extrabold (800): 프리텐다드 매우 굵은 폰트</p>
        <p className="text-xl font-black">font-black (900): 프리텐다드 가장 굵은 폰트</p>
      </div>
      
      <div className="mt-8">
        <p className="text-lg font-medium">
          한글과 영문이 조화롭게 표시됩니다. Korean and English text harmoniously displayed.
        </p>
        <code className="font-mono bg-gray-100 p-2 rounded block mt-4">
          console.log("Monospace font for code");
        </code>
      </div>
    </div>
  );
}
