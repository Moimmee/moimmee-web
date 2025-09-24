const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default async function Home() {
  await delay(3000);
  
  console.log('User-web 페이지 로딩 완료');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        User Web App
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        이 페이지는 3초 지연 후 로딩됩니다
      </p>
      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
        <p className="text-blue-800">
          ✅ 로딩이 완료되었습니다!
        </p>
      </div>
    </div>
  );
}
