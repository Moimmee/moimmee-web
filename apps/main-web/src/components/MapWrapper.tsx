"use client";

import dynamic from "next/dynamic";

const Map = dynamic(
  () => import("@/components/Map").then((mod) => ({ default: mod.Map })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">지도를 불러오는 중...</span>
      </div>
    ),
  }
);

const MapWrapper = () => {
  // 예제 마커들
  const exampleMarkers = [
    {
      position: [37.5665, 126.978] as [number, number],
      popup: "서울특별시청",
    },
    {
      position: [37.5759, 126.9768] as [number, number],
      popup: "경복궁",
    },
    {
      position: [37.5662, 126.9779] as [number, number],
      popup: "덕수궁",
    },
  ];

  return (
    <Map
      markers={exampleMarkers}
      center={[37.5665, 126.978]}
      zoom={14}
    />
  );
};

export default MapWrapper;
