"use client";

import { useState, useRef, useEffect } from "react";

interface PartyDetailProps {
  onClose?: () => void;
  markerData?: {
    position: [number, number];
    popup?: string;
  };
}

const PartyDetail = ({ onClose, markerData }: PartyDetailProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [backdropOpacity, setBackdropOpacity] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // 스냅 포인트 설정
  const COLLAPSED_HEIGHT = 50; // 기본 높이 (vh 단위)
  const EXPANDED_HEIGHT = 75; // 확장 높이 (vh 단위)
  const CLOSE_THRESHOLD = 20; // 닫기 임계점 (vh 단위)

  const handleStart = (clientY: number) => {
    setIsDragging(true);
    setDragStartY(clientY);
    setCurrentY(clientY);
  };

  const handleMove = (clientY: number) => {
    if (!isDragging || !sheetRef.current) return;

    const deltaY = clientY - dragStartY;
    const currentHeight = isExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT;

    // 드래그에 따른 높이 계산
    let newHeight = currentHeight - (deltaY / window.innerHeight) * 100;

    // 최소/최대 높이 제한
    newHeight = Math.max(CLOSE_THRESHOLD, Math.min(EXPANDED_HEIGHT, newHeight));

    sheetRef.current.style.height = `${newHeight}vh`;
    sheetRef.current.style.transition = "none";
  };

  const handleEnd = (clientY: number) => {
    if (!isDragging || !sheetRef.current) return;

    setIsDragging(false);
    const deltaY = clientY - dragStartY;
    const velocityY = deltaY / 100; // 간단한 속도 계산

    // 스냅 결정 로직
    const currentHeight =
      parseFloat(sheetRef.current.style.height) ||
      (isExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT);

    sheetRef.current.style.transition =
      "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

    if (currentHeight < CLOSE_THRESHOLD + 10 || velocityY > 5) {
      // 닫기 - 더 부드러운 애니메이션
      setBackdropOpacity(0);
      sheetRef.current.style.transition = "height 0.35s cubic-bezier(0.4, 0, 1, 1)";
      sheetRef.current.style.height = "0vh";
      setTimeout(() => onClose?.(), 350);
    } else if (
      currentHeight > (COLLAPSED_HEIGHT + EXPANDED_HEIGHT) / 2 ||
      velocityY < -5
    ) {
      // 확장
      setIsExpanded(true);
      sheetRef.current.style.height = `${EXPANDED_HEIGHT}vh`;
    } else {
      // 기본 높이로 복귀
      setIsExpanded(false);
      sheetRef.current.style.height = `${COLLAPSED_HEIGHT}vh`;
    }
  };

  // 마우스 이벤트
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientY);
  };

  const handleMouseUp = (e: MouseEvent) => {
    handleEnd(e.clientY);
  };

  // 터치 이벤트
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    handleMove(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const touch = e.changedTouches[0];
    handleEnd(touch.clientY);
  };

  // 전역 이벤트 리스너 설정
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging, dragStartY]);

  // 초기 애니메이션 설정
  useEffect(() => {
    if (sheetRef.current) {
      // 처음에는 완전히 아래로 숨김
      sheetRef.current.style.height = "0vh";
      sheetRef.current.style.transition = "none";
      
      // 다음 프레임에서 애니메이션과 함께 올라오도록 설정
      requestAnimationFrame(() => {
        if (sheetRef.current) {
          sheetRef.current.style.transition = "height 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
          sheetRef.current.style.height = `${COLLAPSED_HEIGHT}svh`;
          
          // 백드롭도 함께 나타나게 함
          setBackdropOpacity(1);
          
          // 애니메이션 완료 후 상태 업데이트
          setTimeout(() => {
            setIsAnimating(false);
          }, 400);
        }
      });
    }
  }, [COLLAPSED_HEIGHT]);

  // 백드롭 클릭 처리
  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 부드러운 닫기 애니메이션
    setBackdropOpacity(0);
    if (sheetRef.current) {
      sheetRef.current.style.transition = "height 0.35s cubic-bezier(0.4, 0, 1, 1)";
      sheetRef.current.style.height = "0vh";
      setTimeout(() => onClose?.(), 350);
    }
  };

  // 시트 내부 클릭 시 이벤트 전파 중단
  const handleSheetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* 백드롭 영역 */}
      <div 
        ref={backdropRef}
        className="fixed inset-0 z-999998 bg-black/20 backdrop-blur-[1px]"
        onClick={handleBackdropClick}
        style={{
          opacity: backdropOpacity,
          transition: "opacity 0.3s ease-out"
        }}
      />
      
      {/* 시트 */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 z-999999 bg-white/70 backdrop-blur-lg border border-gray-200 rounded-t-3xl shadow-2xl overflow-hidden flex flex-col"
        style={{
          height: "0vh", // 초기에는 숨김
          transition: "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onClick={handleSheetClick}
      >
        {/* 드래그 핸들 */}
        <div
          ref={handleRef}
          className="flex-shrink-0 flex justify-center py-3 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* 콘텐츠 영역 */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full px-6 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 break-keep">
              {markerData?.popup || "파티 상세 정보"}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">파티명</h3>
                <p className="text-gray-600 break-keep">
                  {markerData?.popup || "선택된 장소"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">위치</h3>
                <p className="text-gray-600 break-keep">
                  {markerData ? `위도: ${markerData.position[0].toFixed(4)}, 경도: ${markerData.position[1].toFixed(4)}` : "위치 정보 없음"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">시간</h3>
                <p className="text-gray-600 break-keep">2024년 12월 25일 오후 2시</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">참가자</h3>
                <p className="text-gray-600 break-keep">3명 / 8명</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">설명</h3>
                <p className="text-gray-600 break-keep">
                  {markerData?.popup ? `${markerData.popup}에서 진행되는 즐거운 모임입니다.` : "즐거운 시간을 보낼 수 있는 모임입니다."} 
                  많은 분들의 참여를 기다리고 있어요! 함께 좋은 추억을 만들어요.
                </p>
              </div>
              {isExpanded && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700">추가 정보</h3>
                    <p className="text-gray-600 break-keep">
                      이곳은 확장된 상태에서만 보이는 추가 정보입니다. 더 많은
                      세부사항을 확인할 수 있습니다.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">주의사항</h3>
                    <p className="text-gray-600 break-keep">
                      모임 시간에 늦지 않도록 주의해주세요. 우천 시에는 실내로
                      장소가 변경될 수 있습니다.
                    </p>
                  </div>
                </div>
              )}
              {/* 하단 여백 추가 */}
              <div className="h-8"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PartyDetail;